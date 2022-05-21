import { IsString } from "class-validator";

export class FileCommand {
  @IsString()
  file: string;
}