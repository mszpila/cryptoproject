import { IsString } from "class-validator";

export class UserCommand {
  @IsString()
  user: string;
}