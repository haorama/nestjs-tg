import { Module } from "@nestjs/common";
import { TypegooseModule } from "../../../lib";
import { User, UserSchema } from "./models/user.model";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        model: User,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
