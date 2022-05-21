import { Enum } from "../../../../shared/src/domain/Enum";

@Enum.decorate()
export class NFTStandard extends Enum {
  public static readonly NFT_721 = new NFTStandard('NFT_721');
  public static readonly NFT_1155 = new NFTStandard('NFT_1155');
  public static readonly SOLANA = new NFTStandard('SOLANA');
}