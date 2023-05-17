import { Injectable } from "@nestjs/common";
import { InjectModel } from "../../../lib";
import { User } from "./models/user.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: ModelType<User>,
  ) {}

  create(data: CreateUserDto) {
    return this.userModel.create(data);
  }

  find() {
    return this.userModel.find();
  }
}
