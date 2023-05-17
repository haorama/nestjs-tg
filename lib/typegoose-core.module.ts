import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
  Provider,
} from "@nestjs/common";
import { catchError, defer, lastValueFrom } from "rxjs";
import { MONGOOSE_CONNECTION_NAME } from "./typegoose.constants";
import { TypegooseModuleOptions } from "./interfaces";
import mongoose from "mongoose";
import { getConnectionToken, handleRetry } from "./utils/mongoose.utils";
import { ModuleRef } from "@nestjs/core";

@Global()
@Module({})
export class TypegooseCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(MONGOOSE_CONNECTION_NAME) private readonly connectionName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onApplicationShutdown(signal?: string) {
    console.log("database core module is shutting down...", signal);
    const connection = this.moduleRef.get<any>(this.connectionName);
    connection && (await connection.close());
  }

  static register(uri: string, options: TypegooseModuleOptions): DynamicModule {
    const { connectionFactory, retryAttempts, retryDelay, ...mongooseOptions } =
      options;

    const mongooseConnectionName = getConnectionToken(options.name);

    const mongooseConnectionNameProvider = {
      provide: MONGOOSE_CONNECTION_NAME,
      useValue: mongooseConnectionName,
    };

    const mongooseConnectionFactory =
      connectionFactory || ((connection) => connection);

    const connectionProvider: Provider = {
      provide: mongooseConnectionName,
      useFactory: async () => {
        const connection = await lastValueFrom(
          defer(async () => {
            return mongooseConnectionFactory(
              await mongoose.createConnection(uri, mongooseOptions).asPromise(),
              mongooseConnectionName,
            );
          }).pipe(
            handleRetry(retryAttempts, retryDelay),
            catchError((error) => {
              throw new Error(error);
            }),
          ),
        );

        return connection;
      },
    };

    return {
      module: TypegooseCoreModule,
      providers: [connectionProvider, mongooseConnectionNameProvider],
      exports: [connectionProvider, mongooseConnectionNameProvider],
    };
  }
}
