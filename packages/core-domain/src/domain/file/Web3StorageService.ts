import { Readable } from "stream";
import { File } from "./File";
import { Injectable } from "@nestjs/common";
import { NFTMetadata } from "../nftDraft/NFTMetadata";

@Injectable()
export abstract class Web3StorageService {
  abstract uploadFile(file: Readable): Promise<URL>;

  abstract uploadMetadata(nftMetadata: NFTMetadata): Promise<URL>;

  abstract getFilePrice(file: File): Promise<string>;
}