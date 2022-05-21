import { IsEmail, IsString } from "class-validator";

export class StandardUserCommand {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}