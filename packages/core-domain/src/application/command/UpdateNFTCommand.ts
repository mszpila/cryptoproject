import { IsOptional, IsString } from "class-validator";

export class UpdateNFTCommand {
  @IsString()
  readonly nft: any;
  readonly options: NFTOptionsCommand[];
  readonly metadata: NFTMetadataCommand;
}

class NFTOptionsCommand {
  @IsString()
  readonly blockchain: string;
  @IsString()
  readonly standard: string;
}

class NFTMetadataCommand {
  @IsString()
  readonly name: string;
  @IsString()
  readonly description: string;
  @IsString()
  @IsOptional()
  readonly image: string;
  @IsString({ each: true })
  @IsOptional()
  readonly attributes: string[];
}