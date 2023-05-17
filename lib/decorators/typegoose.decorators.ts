import { Inject } from "@nestjs/common";
import { getModelToken, getConnectionToken } from "../utils/mongoose.utils";

export function InjectModel(name: string, connectionName?: string) {
  return Inject(getModelToken(name, connectionName));
}

export const InjectConnection = (connection?: string) =>
  Inject(getConnectionToken(connection));
