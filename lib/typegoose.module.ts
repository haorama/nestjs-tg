import { DynamicModule, Module, flatten } from "@nestjs/common";
import { TypegooseCoreModule } from "./typegoose-core.module";
import {
  createTypegooseAsyncProviders,
  createTypegooseProviders,
} from "./typegoose.providers";
import type {
  TypegooseModuleOptions,
  ModelDefinition,
  TypegooseModuleAsyncOptions,
} from "./interfaces";
import { AsyncModelFactory } from "./interfaces/async-model-factory.interface";

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

  static forRootAsync(options: TypegooseModuleAsyncOptions) {
    return TypegooseCoreModule.forRootAsync(options);
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

  static forFeatureAsync(
    factories: AsyncModelFactory[] = [],
    connectionName?: string,
  ): DynamicModule {
    const providers = createTypegooseAsyncProviders(factories, connectionName);
    const imports = factories.map((factory) => factory.imports || []);
    const uniqImports = new Set(flatten(imports));

    return {
      module: TypegooseModule,
      imports: [...uniqImports],
      providers: providers,
      exports: providers,
    };
  }
}
