import { Readable } from "stream";
import { File, FileID } from "./File";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class StorageService {
  abstract uploadFile(file: File, stream: Readable, fileMimeType: string): Promise<void>;

  abstract downloadFile(file: File): Promise<Readable>;

  abstract getFileSize(file: File): Promise<number>;
}