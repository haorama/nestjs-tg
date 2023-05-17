import type { ModelFactory } from "./interfaces";
import { Connection } from "mongoose";
import { Provider } from "@nestjs/common";
import { addModelToTypegoose, getName } from "@typegoose/typegoose";
import { getConnectionToken, getModelToken } from "./utils/mongoose.utils";

export function createModelProviders(
  factories: ModelFactory[],
  connection?: string,
) {
  const providers: Provider[] = factories.map((factory) => ({
    provide: getModelToken(
      factory.model.name,
      factory.connection || connection,
    ),
    useFactory: (connection: Connection) => {
      const schema =
        typeof factory.schema === "function"
          ? factory.schema()
          : factory.schema;

      const ModelRaw = connection.model(getName(factory.model), schema);

      return addModelToTypegoose(ModelRaw, factory.model);
    },
    inject: [getConnectionToken(factory.connection || connection)],
  }));

  return providers;
}
