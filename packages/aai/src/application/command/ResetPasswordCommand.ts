import { IsString } from "class-validator";

export class ResetPasswordCommand {
  @IsString()
  password!: string;

  @IsString()
  resetToken!: string;
}