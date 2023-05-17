import type { ConnectOptions, MongooseError } from "mongoose";

export type ConnectionFactory = (connection: any, name: string) => any;

export interface TypegooseModuleOptions extends ConnectOptions {
  connectionName?: string;
  connectionFactory?: ConnectionFactory;
  connectionErrorFactory?: (error: MongooseError) => MongooseError;
  retryAttempts?: number;
  retryDelay?: number;
}
