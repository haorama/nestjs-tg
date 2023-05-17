import { Type } from "@nestjs/common";
import { Schema } from "mongoose";
type SchemaType = Schema | (() => Schema);

export interface ModelDefinition {
  model: Type<any>;
  schema: SchemaType;
  connection?: string;
}
