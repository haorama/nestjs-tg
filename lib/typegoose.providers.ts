import { Connection } from "mongoose";
import { Provider } from "@nestjs/common";
import { addModelToTypegoose, getName } from "@typegoose/typegoose";
import { getConnectionToken, getModelToken } from "./utils/mongoose.utils";
import { ModelDefinition } from "./interfaces";

export function createTypegooseProviders(
  models: ModelDefinition[],
  connectionName?: string,
) {
  const providers: Provider[] = models.map((factory) => ({
    provide: getModelToken(
      factory.model.name,
      factory.connection || connectionName,
    ),
    useFactory: (connection: Connection) => {
      const schema =
        typeof factory.schema === "function"
          ? factory.schema()
          : factory.schema;

      const ModelRaw = connection.model(getName(factory.model), schema);

      return addModelToTypegoose(ModelRaw, factory.model);
    },
    inject: [getConnectionToken(factory.connection || connectionName)],
  }));

  return providers;
}
