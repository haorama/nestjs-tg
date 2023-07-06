import { Module } from "@nestjs/common";
import { TypegooseModule } from "../../../lib";
import { User, UserSchema } from "./models/user.model";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypegooseModule.forFeatureAsync([
      {
        model: User,
        useFactory: () => {
          UserSchema.pre("save", function (next) {
            this.bio = `${this.name} Bio`;
            next();
          });

          return UserSchema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
