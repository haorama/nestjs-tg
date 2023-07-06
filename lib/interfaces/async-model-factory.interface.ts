import type { ModuleMetadata } from "@nestjs/common";
import type { ModelDefinition } from "./model-definition.interface";
import type { MaybePromise } from "./common.interfaces";
import type { Schema } from "mongoose";

export interface AsyncModelFactory
  extends Pick<ModuleMetadata, "imports">,
    Pick<ModelDefinition, "model" | "discriminators" | "connection"> {
  useFactory: (...args: any[]) => MaybePromise<Schema>;
  inject?: any[];
}
