import { Connection, Model, createConnection } from "mongoose";
import { Provider } from "@nestjs/common";
import { addModelToTypegoose, getName } from "@typegoose/typegoose";
import {
  getConnectionToken,
  getModelToken,
  handleRetry,
} from "./utils/mongoose.utils";
import { ModelDefinition, TypegooseModuleOptions } from "./interfaces";
import { catchError, defer, lastValueFrom } from "rxjs";
import { AsyncModelFactory } from "./interfaces/async-model-factory.interface";

export async function createConnectionFactory(
  mongooseConnectionName: string,
  options: TypegooseModuleOptions = {},
) {
  const {
    connectionFactory,
    connectionErrorFactory,
    retryAttempts,
    retryDelay,
    uri,
    ...mongooseOptions
  } = options;

  const mongooseConnectionFactory =
    connectionFactory || ((connection) => connection);

  const mongooseConnectionError = connectionErrorFactory || ((error) => error);
  const connection = await lastValueFrom(
    defer(async () => {
      return mongooseConnectionFactory(
        await createConnection(uri as string, mongooseOptions).asPromise(),
        mongooseConnectionName,
      );
    }).pipe(
      handleRetry(retryAttempts, retryDelay),
      catchError((error) => {
        throw mongooseConnectionError(error);
      }),
    ),
  );

  return connection;
}

export function createConnectionProvider(
  uri: string,
  options: TypegooseModuleOptions = {},
): Provider {
  const { connectionName } = options;
  const mongooseConnectionName = getConnectionToken(connectionName);

  return {
    provide: mongooseConnectionName,
    useFactory: async () => {
      return createConnectionFactory(mongooseConnectionName, {
        ...options,
        uri,
      });
    },
  };
}

export function createTypegooseProviders(
  options: ModelDefinition[],
  connectionName?: string,
) {
  const providers = options.reduce((acc, option) => {
    return [
      ...acc,
      ...(option.discriminators || []).map((d) => ({
        provide: getModelToken(getName(d.model), connectionName),
        useFactory: (model: Model<Document>) =>
          model.discriminator(getName(d.model), d.schema, d.value),
        inject: [getModelToken(getName(option.model), connectionName)],
      })),
      {
        provide: getModelToken(
          getName(option.model),
          option.connection || connectionName,
        ),
        useFactory: (connection: Connection) => {
          const schema =
            typeof option.schema === "function"
              ? option.schema()
              : option.schema;

          const ModelRaw = connection.model(getName(option.model), schema);

          return addModelToTypegoose(ModelRaw, option.model);
        },
        inject: [getConnectionToken(option.connection || connectionName)],
      },
    ];
  }, [] as Provider[]);

  return providers;
}

export function createTypegooseAsyncProviders(
  options: AsyncModelFactory[] = [],
  connectionName?: string,
): Provider[] {
  const providers = options.reduce((acc, option) => {
    const modelName = getName(option.model);
    return [
      ...acc,
      {
        provide: getModelToken(modelName, option.connection || connectionName),
        useFactory: async (connection: Connection, ...args: unknown[]) => {
          const schema = await option.useFactory(...args);
          const ModelRaw = connection.model(modelName, schema);
          return addModelToTypegoose(ModelRaw, option.model);
        },
        inject: [
          getConnectionToken(option.connection || connectionName),
          ...(option.inject || []),
        ],
      },
      ...(option.discriminators || []).map((d) => ({
        provide: getModelToken(
          getName(d.model),
          option.connection || connectionName,
        ),
        useFactory: (model: Model<Document>) =>
          model.discriminator(getName(d.model), d.schema, d.value),
        inject: [getModelToken(getName(option.model), connectionName)],
      })),
    ];
  }, [] as Provider[]);

  return providers;
}
