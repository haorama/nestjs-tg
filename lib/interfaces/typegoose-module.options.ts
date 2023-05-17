import { Type } from "@nestjs/common";
import type { ConnectOptions, Schema } from "mongoose";

type SchemaType = Schema | (() => Schema);

export type ConnectionFactory = (connection: any, name: string) => any;

export interface TypegooseModuleOptions extends ConnectOptions {
  // connection name
  name?: string;
  connectionFactory?: ConnectionFactory;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ModelFactory {
  model: Type<any>;
  schema: SchemaType;
  connection?: string;
}
