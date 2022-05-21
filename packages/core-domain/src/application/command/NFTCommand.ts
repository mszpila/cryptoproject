import { IsString } from "class-validator";

export class NFTCommand {
  @IsString()
  nft: string;
}