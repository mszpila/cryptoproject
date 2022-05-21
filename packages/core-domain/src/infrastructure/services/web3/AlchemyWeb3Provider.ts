import { BlockchainType } from "../../../domain/nft/BlockchainType";
import { BadRequestException } from "@nestjs/common";
import { NFTDraft } from "../../../domain/nftDraft/NFTDraft";
import { EthereumWeb3Provider } from "./ethereum/EthereumWeb3Provider";
import { PolygonWeb3Provider } from "./polygon/PolygonWeb3Provider";
import { SolanaWeb3Provider } from "./solana/SolanaWeb3Provider";
import { NFTStandard } from "../../../domain/nft/NFTStandard";
import { Injectable } from "../../../../../shared/src/decorators/Injectable";
import { ICreateNFT, Web3Provider } from "../../../domain/nft/Web3Provider";
import { BlockchainAddress, NFT } from "../../../domain/nft/NFT";

@Injectable()
export class AlchemyWeb3Provider implements Web3Provider {
  constructor(
    private readonly ethereumProvider: EthereumWeb3Provider,
    private readonly polygonProvider: PolygonWeb3Provider,
    private readonly solanaProvider: SolanaWeb3Provider
  ) {
  }

  public async createNFTOnWeb3(nftWeb3Uri: URL, blockchainType: BlockchainType, standard: NFTStandard): Promise<ICreateNFT> {
    switch (blockchainType) {
      case BlockchainType.ETHEREUM: {
        return this.ethereumProvider.createNFT(nftWeb3Uri, standard);
      }
      case BlockchainType.POLYGON: {
        return this.polygonProvider.createNFT(nftWeb3Uri, standard);
      }
      case BlockchainType.SOLANA: {
        throw new BadRequestException("Solana has not been implemented yet");
      }
      default: {
        throw new BadRequestException("Selected blockchain is not implemented");
      }
    }
  }

  public async withdrawNFT(nft: NFT, address: BlockchainAddress): Promise<void> {
    switch (nft.getBlockchainType()) {
      case BlockchainType.ETHEREUM: {
        break;
      }
      case BlockchainType.POLYGON: {
        break;
      }
      case BlockchainType.SOLANA: {
        break;
      }
      default: {
        throw new BadRequestException("Not implemented");
      }
    }
  }

  getDeploymentPrice(nft: NFTDraft): Promise<string> {
    return Promise.resolve("");
  }

}