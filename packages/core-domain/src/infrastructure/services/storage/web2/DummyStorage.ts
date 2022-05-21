import { StorageService } from "../../../../domain/file/StorageService";
import { createReadStream, createWriteStream, readFileSync } from "fs";
import { join } from "path";
import { Readable } from "stream";
import { File } from "../../../../domain/file/File";
import { Injectable } from "../../../../../../shared/src/decorators/Injectable";
import { FileRepository } from "../../../../domain/file/FileRepository";

@Injectable()
export class DummyStorage implements StorageService {
  constructor(
    private readonly fileRepository: FileRepository
  ) {
  }

  public async uploadFile(file: File, stream: Readable, fileMimeType: string): Promise<void> {
    const path = join(__dirname, "../../../../../../../", "storage", `${file.id.toString()}.${fileMimeType.split("/")[1]}`);
    const writeStream = createWriteStream(path);

    stream.on("data", async (data) => {
      writeStream.write(data);
    });

    stream.on("end", () => {
      console.log("end dummy storage upload");
    });

    stream.on("close", async () => {
      console.log("close dummy storage upload and emit event");
      await this.fileRepository.add(file);
    });
  }

  public async downloadFile(file: File): Promise<Readable> {
    return createReadStream(join(__dirname, "../../../../../../../", "storage", `${file.id.toString()}.${file.getMimeType().split("/")[1]}`));
  }

  getFileSize(file: File): Promise<number> {
    const bytes = readFileSync(join(__dirname, "../../../../../../../", "storage", `${file.id.toString()}.${file.getMimeType().split("/")[1]}`))
    return Promise.resolve(bytes.byteLength || 100);
  }
}