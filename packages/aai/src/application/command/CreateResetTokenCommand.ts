import { IsEmail } from "class-validator";

export class CreateResetTokenCommand {
  @IsEmail()
  email!: string;
}