import { BlockchainType } from "../../../domain/nft/BlockchainType";
import { NFTStandard } from "../../../domain/nft/NFTStandard";
import { NFTDraft } from "../../../domain/nftDraft/NFTDraft";
import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { ICreateNFT, Web3Provider } from "../../../domain/nft/Web3Provider";
import { BlockchainAddress, NFT } from "../../../domain/nft/NFT";

@Injectable()
export class DummyNFTWeb3DataProvider implements Web3Provider {
  public async createNFTOnWeb3(nftWeb3Uri: URL, blockchainType: BlockchainType, standard: NFTStandard): Promise<ICreateNFT> {
    console.log("creating NFT...");

    return {
      contract: new BlockchainAddress("0xA1914517E8395b9086F1e0347A4c40665ea6F0e9"),
      tokenId: "1"
    };
  }

  getDeploymentPrice(nft: NFTDraft): Promise<string> {
    return Promise.resolve("");
  }

  withdrawNFT(nft: NFT, address: BlockchainAddress): Promise<void> {
    return Promise.resolve(undefined);
  }
}