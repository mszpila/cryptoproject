import { Readable } from "stream";
import { StorageService } from "../../domain/file/StorageService";
import { File, FileID } from "../../domain/file/File";
import { FileRepository } from "../../domain/file/FileRepository";
import { NFTDraftRepository } from "../../domain/nftDraft/NFTDraftRepository";
import { NFTDraftID } from "../../domain/nftDraft/NFTDraft";
import { Web3StorageService } from "../../domain/file/Web3StorageService";
import { FilePriceDTO } from "../dto/FilePriceDTO";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { FileUploaded } from "../../../../events/core-domain/FileUploaded";
import { DateValue } from "../../../../shared/src/domain/DateValue";
import { UploadFileCommand } from "../command/UploadFileCommand";
import { FileCommand } from "../command/FileCommand";
import { NFTCommand } from "../command/NFTCommand";
import { FileDTO } from "../dto/FileDTO";

@Injectable()
export class FileApplicationService {

  constructor(
    private readonly storageService: StorageService,
    private readonly fileRepository: FileRepository,
    private readonly nftRepository: NFTDraftRepository,
    private readonly web3StorageService: Web3StorageService
  ) {
  }

  public async uploadFile(command: UploadFileCommand): Promise<void> {
    const file = new File(new FileID(), new NFTDraftID(command.nft), command.fileMimeType, null, null, DateValue.now(), DateValue.now(), DateValue.null());
    file.registerEvent(new FileUploaded({ file: file.id.toString() }));
    await this.storageService.uploadFile(file, command.file, command.fileMimeType);
  }

  public async getFile(command: FileCommand): Promise<FileDTO> {
    const file = await this.fileRepository.find(new FileID(command.file));
    return new FileDTO(file);
  }

  public async getFileByNFT(command: NFTCommand): Promise<FileDTO> {
    const file = await this.fileRepository.findByNFTDraft(new NFTDraftID(command.nft));
    return new FileDTO(file);
  }

  public async downloadFile(command: FileCommand): Promise<Readable> {
    const file = await this.fileRepository.find(new FileID(command.file));
    return this.storageService.downloadFile(file);
  }

  public async getFilePrice(command: FileCommand): Promise<FilePriceDTO> {
    const file = await this.fileRepository.find(new FileID(command.file));
    const price = await this.web3StorageService.getFilePrice(file);

    return new FilePriceDTO(price);
  }
}