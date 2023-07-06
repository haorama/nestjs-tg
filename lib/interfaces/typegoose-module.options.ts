import { ModuleMetadata, Type } from "@nestjs/common";
import type { ConnectOptions, MongooseError } from "mongoose";
import { MaybePromise } from "./common.interfaces";

export type ConnectionFactory = (connection: any, name: string) => any;

export interface TypegooseModuleOptions extends ConnectOptions {
  uri?: string;
  retryAttempts?: number;
  retryDelay?: number;
  connectionName?: string;
  connectionFactory?: ConnectionFactory;
  connectionErrorFactory?: (error: MongooseError) => MongooseError;
  lazyConnection?: boolean;
}

export interface TypegooseOptionsFactory {
  createTypegooseOptions(): MaybePromise<TypegooseModuleOptions>;
}

export type TypegooseModuleFactoryOptions = Omit<
  TypegooseModuleOptions,
  "connectionName" | "uri"
> & {
  uri: string;
};

export interface TypegooseModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  connectionName?: string;
  useExisting?: Type<TypegooseOptionsFactory>;
  useClass?: Type<TypegooseOptionsFactory>;
  useFactory?: (...args: any[]) => MaybePromise<TypegooseModuleFactoryOptions>;
  inject?: any[];
}
