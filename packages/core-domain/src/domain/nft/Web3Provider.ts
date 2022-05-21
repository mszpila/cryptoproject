import { NFTDraft, TokenID } from "../nftDraft/NFTDraft";
import { BlockchainType } from "./BlockchainType";
import { NFTStandard } from "./NFTStandard";
import { BlockchainAddress, NFT } from "./NFT";

export abstract class Web3Provider {
  abstract createNFTOnWeb3(nftWeb3Uri: URL, blockchainType: BlockchainType, standard: NFTStandard): Promise<ICreateNFT>;

  abstract withdrawNFT(nft: NFT, address: BlockchainAddress): Promise<void>;

  abstract getDeploymentPrice(nft: NFTDraft): Promise<string>;
}


export interface ICreateNFT {
  contract: BlockchainAddress;
  tokenId: TokenID | null;
  // data?: IDataDetails;
}

interface IDataDetails {
  tokenId: TokenID | null;
  txId: BlockchainAddress;
}