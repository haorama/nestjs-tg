import { Module } from "@nestjs/common";
import { TypegooseModule } from "../../lib";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";

require("dotenv").config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRoot(process.env.MONGO_URI as string),
    UserModule,
  ],
})
export class AppModule {}
