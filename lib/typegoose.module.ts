import { DynamicModule, Module } from "@nestjs/common";
import { TypegooseCoreModule } from "./typegoose-core.module";
import { createModelProviders } from "./typegoose.providers";
import type { TypegooseModuleOptions, ModelFactory } from "./interfaces";

@Module({})
export class TypegooseModule {
  static forRoot(uri: string, options: TypegooseModuleOptions): DynamicModule {
    return {
      module: TypegooseModule,
      imports: [TypegooseCoreModule.register(uri, options)],
    };
  }

  static forFeature(
    factories: ModelFactory[],
    connection?: string,
  ): DynamicModule {
    const providers = createModelProviders(factories, connection);
    return {
      imports: [TypegooseCoreModule],
      module: TypegooseModule,
      providers,
      exports: providers,
    };
  }
}
