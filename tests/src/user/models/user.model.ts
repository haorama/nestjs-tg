import { Prop, buildSchema } from "@typegoose/typegoose";

export class User {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  email: string;
}

export const UserSchema = buildSchema(User);
