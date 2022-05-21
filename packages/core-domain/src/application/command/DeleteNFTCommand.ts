import { IsString } from "class-validator";

export class DeleteNFTCommand {
  @IsString()
  readonly nft: string;
  @IsString()
  readonly user: string;
}