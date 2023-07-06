import { registerAs } from "@nestjs/config";

export const DB_CONFIG = registerAs("db", () => ({
  uri: process.env.MONGO_URI as string,
}));
