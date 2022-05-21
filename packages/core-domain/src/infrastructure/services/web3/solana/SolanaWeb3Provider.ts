import { BlockchainType } from "../../../../domain/nft/BlockchainType";
import { NFTDraft } from "../../../../domain/nftDraft/NFTDraft";
import { NFTStandard } from "../../../../domain/nft/NFTStandard";
import { Injectable } from "../../../../../../shared/src/decorators/Injectable";
import { BlockchainAddress, NFT } from "../../../../domain/nft/NFT";
import { ICreateNFT } from "../../../../domain/nft/Web3Provider";

@Injectable()
export class SolanaWeb3Provider {
  createNFT(nft: NFTDraft, blockchainType: BlockchainType, standard: NFTStandard): Promise<ICreateNFT> {
    return Promise.resolve(undefined);
  }

  getDeploymentPrice(nft: NFTDraft): Promise<string> {
    return Promise.resolve("");
  }

  withdrawNFT(nft: NFT, address: BlockchainAddress): Promise<void> {
    return Promise.resolve(undefined);
  }
}