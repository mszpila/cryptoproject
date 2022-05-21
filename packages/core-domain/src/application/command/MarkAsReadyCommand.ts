import { IsString } from "class-validator";

export class MarkAsReadyCommand {
  readonly metadata: NftMetadataCommand;
  @IsString()
  readonly nft;
  readonly file: any;
  @IsString()
  readonly user: string;
  @IsString()
  readonly blockchain: string;
  @IsString()
  readonly contract: string;
  @IsString()
  readonly nftStandard: string;
}

class NftMetadataCommand {
  @IsString()
  readonly image: string;
}