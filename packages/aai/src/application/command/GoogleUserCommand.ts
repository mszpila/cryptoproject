import { IsEmail, IsString } from "class-validator";

export class GoogleUserCommand {
  @IsEmail()
  email!: string;

  @IsString()
  oauth!: string;
}