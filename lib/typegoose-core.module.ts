import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from "@nestjs/common";
import {
  TYPEGOOSE_CONNECTION_NAME,
  TYPEGOOSE_MODULE_OPTIONS,
} from "./typegoose.constants";
import {
  TypegooseModuleAsyncOptions,
  TypegooseModuleFactoryOptions,
  TypegooseModuleOptions,
  TypegooseOptionsFactory,
} from "./interfaces";
import { getConnectionToken } from "./utils/mongoose.utils";
import { ModuleRef } from "@nestjs/core";
import {
  createConnectionFactory,
  createConnectionProvider,
} from "./typegoose.providers";

@Global()
@Module({})
export class TypegooseCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(TYPEGOOSE_CONNECTION_NAME)
    private readonly connectionName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(
    uri: string,
    options: TypegooseModuleOptions = {},
  ): DynamicModule {
    const { connectionName } = options;

    const mongooseConnectionName = getConnectionToken(connectionName);

    const mongooseConnectionNameProvider = {
      provide: TYPEGOOSE_CONNECTION_NAME,
      useValue: mongooseConnectionName,
    };

    const connectionProvider = createConnectionProvider(uri, options);

    return {
      module: TypegooseCoreModule,
      providers: [connectionProvider, mongooseConnectionNameProvider],
      exports: [connectionProvider],
    };
  }

  static forRootAsync(options: TypegooseModuleAsyncOptions): DynamicModule {
    const mongooseConnectionName = getConnectionToken(options.connectionName);

    const mongooseConnectionNameProvider = {
      provide: TYPEGOOSE_CONNECTION_NAME,
      useValue: mongooseConnectionName,
    };

    const connectionProvider = {
      provide: mongooseConnectionName,
      useFactory: async (
        typegooseModuleOptions: TypegooseModuleFactoryOptions,
      ): Promise<any> => {
        return createConnectionFactory(mongooseConnectionName, {
          ...typegooseModuleOptions,
        });
      },
      inject: [TYPEGOOSE_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: TypegooseCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        connectionProvider,
        mongooseConnectionNameProvider,
      ],
      exports: [connectionProvider],
    };
  }

  private static createAsyncProviders(
    options: TypegooseModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<TypegooseOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: TypegooseModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TYPEGOOSE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<TypegooseOptionsFactory>,
    ];

    return {
      provide: TYPEGOOSE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: TypegooseOptionsFactory) =>
        await optionsFactory.createTypegooseOptions(),
      inject,
    };
  }

  async onApplicationShutdown() {
    const connection = this.moduleRef.get<any>(this.connectionName);
    connection && (await connection.close());
  }
}
