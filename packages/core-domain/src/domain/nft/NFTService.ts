import { NFTDraft } from "../nftDraft/NFTDraft";
import { BlockchainType } from "./BlockchainType";
import { NFTStandard } from "./NFTStandard";
import { ICreateNFT, Web3Provider } from "./Web3Provider";
import { NFTRepository } from "./NFTRepository";
import { BlockchainAddress, NFT, NFTID } from "./NFT";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { NFTOnWeb3Created } from "../../../../events/core-domain/NFTOnWeb3Created";
import { FileRepository } from "../file/FileRepository";
import { DateValue } from "../../../../shared/src/domain/DateValue";

@Injectable()
export class NFTService {
  constructor(
    private readonly web3Provider: Web3Provider,
    private readonly web3Repository: NFTRepository,
    private readonly fileRepository: FileRepository
  ) {
  }

  public async createNFT(nft: NFTDraft): Promise<void> {
    for (let options of nft.getSelectedOptions()) {
      console.log("creating eth nft from draft...");
      const txReceipt = await this.web3Provider.createNFTOnWeb3(nft.getWeb3URI(), options.blockchainType, options.nftStandard);
      console.log("txReceipt in service: ", txReceipt);
      await this.saveNFTWeb3Data(txReceipt, nft, options.nftStandard);

      // switch (options.blockchainType) {
      //   case BlockchainType.ETHEREUM: {
      //     console.log('creating eth nftDraft...')
      //     const txReceipt = await this.web3Provider.createNFT(nftDraft, options.blockchainType, options.nftStandard, file);
      //     console.log('txReceipt in service: ', txReceipt);
      //     await this.saveNFTWeb3Data(txReceipt, nftDraft, options.nftStandard);
      //     break;
      //   }
      //   case BlockchainType.POLYGON: {
      //     const txReceipt = await this.web3Provider.createNFT(nftDraft, options.blockchainType, options.nftStandard, file);
      //     await this.saveNFTWeb3Data(txReceipt, nftDraft, options.nftStandard);
      //     break;
      //   }
      //   default: {
      //     throw new BadRequestException(`Selected type is not implemented: ${options.blockchainType}`)
      //   }
      // }
    }

  }

  private async saveNFTWeb3Data(tx: ICreateNFT, nftDraft: NFTDraft, nftStandard: NFTStandard): Promise<void> {
    if (!tx) {
      throw new Error("Transaction receipt is null");
    }

    // const nftsWeb3Data = await this.web3Repository.findByNFT(nftDraft.id);
    // const nftWeb3 = nftsWeb3Data.find(nftW3 => nftW3.getBlockchainType().equals(BlockchainType.ETHEREUM));
    // nftWeb3.markAsFinal();
    // nftWeb3.markAsProcessed();
    // nftWeb3.setBlockchainExternalID(
    //   new BlockchainExternalID(tx.contract.toString()),
    //   tx.tokenId,
    // );
    //
    // nftWeb3.registerEvent(new NFTOnWeb3Created({ nftDraft: nftDraft.id.toString() }));
    // await this.web3Repository.add(nftWeb3);

    const nftWeb3Data = new NFT(
      new NFTID(),
      nftDraft.getCreator(),
      false,
      BlockchainType.ETHEREUM,
      new BlockchainAddress(tx.contract.toString()),
      tx.tokenId,
      nftStandard,
      null,
      nftDraft.getWeb3URI(),
      DateValue.now(),
      DateValue.now(),
      DateValue.null(),
    );

    nftWeb3Data.registerEvent(new NFTOnWeb3Created({ nft: nftWeb3Data.id.toString() }));
    await this.web3Repository.add(nftWeb3Data);
  }

  public async checkConfirmations(): Promise<void> {

  }
}