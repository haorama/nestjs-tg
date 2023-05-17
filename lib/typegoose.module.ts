import { DynamicModule, Module } from "@nestjs/common";
import { TypegooseCoreModule } from "./typegoose-core.module";
import { createTypegooseProviders } from "./typegoose.providers";
import type { TypegooseModuleOptions, ModelDefinition } from "./interfaces";

@Module({})
export class TypegooseModule {
  static forRoot(
    uri: string,
    options: TypegooseModuleOptions = {},
  ): DynamicModule {
    return {
      module: TypegooseModule,
      imports: [TypegooseCoreModule.forRoot(uri, options)],
    };
  }

  static forFeature(
    models: ModelDefinition[],
    connectionName?: string,
  ): DynamicModule {
    const providers = createTypegooseProviders(models, connectionName);
    return {
      module: TypegooseModule,
      providers: providers,
      exports: providers,
    };
  }
}
