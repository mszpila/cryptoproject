import { BlockchainType } from "../nft/BlockchainType";
import { TokenID } from "./NFTDraft";
import { NFTStandard } from "../nft/NFTStandard";
import { BlockchainAddress } from "../nft/NFT";

export class NFTBlockchainDetails {
  constructor(
    private readonly blockchainType: BlockchainType | null,
    private readonly contract: BlockchainAddress | null,
    private readonly tokenId: TokenID | null,
    private readonly standard: NFTStandard | null
  ) {
  }

  public getBlockchainType(): BlockchainType | null {
    return this.blockchainType;
  }

  public getContract(): BlockchainAddress | null {
    return this.contract;
  }

  public getTokenId(): TokenID | null {
    return this.tokenId;
  }

  public getStandard(): NFTStandard | null {
    return this.standard;
  }
}