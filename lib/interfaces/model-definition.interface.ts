import type { Type } from "@nestjs/common";
import type { Schema } from "mongoose";
type SchemaType = Schema | (() => Schema);

export type DiscriminatorOptions = {
  model: Type<any>;
  schema: Schema;
  value?: string;
};

export interface ModelDefinition {
  model: Type<any>;
  schema: SchemaType;
  connection?: string;
  collection?: string;
  discriminators?: DiscriminatorOptions[];
}
