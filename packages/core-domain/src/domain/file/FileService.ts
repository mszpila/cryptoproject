import { FileRepository } from "./FileRepository";
import { Web3StorageService } from "./Web3StorageService";
import { NFTDraftID } from "../nftDraft/NFTDraft";
import { NFTDraftRepository } from "../nftDraft/NFTDraftRepository";
import { FileID } from "./File";
import { StorageService } from "./StorageService";
import { FileUploadedToWeb3 } from "../../../../events/core-domain/FileUploadedToWeb3";
import { MetadataUploadedToWeb3 } from "../../../../events/core-domain/MetadataUploadedToWeb3";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { Web3Provider } from "../nft/Web3Provider";
import { EventBus } from "../../../../shared/src/domain/EventBus";
import { NFTMetadata } from "../nftDraft/NFTMetadata";
import { FileSizeSet } from "../../../../events/core-domain/FileSizeSet";

@Injectable()
export class FileService {
  constructor(
    private readonly nftDraftRepository: NFTDraftRepository,
    private readonly fileRepository: FileRepository,
    private readonly web3Provider: Web3Provider,
    private readonly web3StorageService: Web3StorageService,
    private readonly storageService: StorageService,
    private readonly eventBus: EventBus
  ) {
  }

  public async uploadFileToWeb3(nftDraftId: NFTDraftID): Promise<void> {
    const file = await this.fileRepository.findByNFTDraft(nftDraftId);

    file.registerEvent(new FileUploadedToWeb3({ nftDraft: nftDraftId.toString() }));
    const fileWeb3URI = await this.web3StorageService.uploadFile(await this.storageService.downloadFile(file));

    file.setWeb3URI(fileWeb3URI);
    await this.fileRepository.update(file);
  }

  public async uploadMetadataToWeb3(nftId: NFTDraftID): Promise<void> {
    const nftDraft = await this.nftDraftRepository.findById(nftId);
    const file = await this.fileRepository.findByNFTDraft(nftId);

    const metadata = nftDraft.getMetadata();
    nftDraft.updateMetadata(new NFTMetadata({ ...metadata, file: file.getWeb3URI().toString() }));

    const metadataWeb3URI = await this.web3StorageService.uploadMetadata(nftDraft.getMetadata());
    nftDraft.setWeb3URI(metadataWeb3URI);

    nftDraft.registerEvent(new MetadataUploadedToWeb3({ nftDraft: nftDraft.id.toString() }));
    await this.nftDraftRepository.update(nftDraft);
  }

  public async updateFileSize(fileId: FileID): Promise<void> {
    const file = await this.fileRepository.find(fileId);
    const size = await this.storageService.getFileSize(file);

    file.setSize(size);
    file.registerEvent(new FileSizeSet({ file: file.id.toString() }));
    await this.fileRepository.update(file);
  }
}