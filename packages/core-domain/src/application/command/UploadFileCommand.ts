import { IsReadable } from "../../../../shared/src/application/IsReadableValidator";
import { Readable } from "stream";
import { IsString } from "class-validator";

export class UploadFileCommand {
  @IsReadable()
  file: Readable;
  @IsString()
  fileName: string;
  @IsString()
  fileMimeType: string;
  @IsString()
  nft: string;
}