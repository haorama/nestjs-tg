import { Module } from "@nestjs/common";
import { TypegooseModule } from "../../lib";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    TypegooseModule.forRoot(
      "mongodb://root:password@localhost:27017/nestjs-tg?authSource=admin",
    ),
    UserModule,
  ],
})
export class AppModule {}
