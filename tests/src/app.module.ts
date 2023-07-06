import { Module } from "@nestjs/common";
import { TypegooseModule, TypegooseModuleFactoryOptions } from "../../lib";
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DB_CONFIG } from "./config/db.config";

require("dotenv").config();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [DB_CONFIG],
    }),
    TypegooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.get("db") as TypegooseModuleFactoryOptions;
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    // TypegooseModule.forRoot(process.env.MONGO_URI as string),
    UserModule,
  ],
})
export class AppModule {}
