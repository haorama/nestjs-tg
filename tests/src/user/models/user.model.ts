import { Prop, buildSchema } from "@typegoose/typegoose";

export class User {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  email: string;

  @Prop()
  bio?: string;
}

export const UserSchema = buildSchema(User);
