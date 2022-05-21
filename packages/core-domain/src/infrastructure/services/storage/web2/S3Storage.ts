import { StorageService } from "../../../../domain/file/StorageService";
import { CompletedPart, GetObjectRequest, S3 } from "@aws-sdk/client-s3";
import { Readable, ReadableOptions } from "stream";
import { File } from "../../../../domain/file/File";
import { ConfigService } from "../../../../../../ConfigService";
import { Injectable } from "../../../../../../shared/src/decorators/Injectable";
import { FileRepository } from "../../../../domain/file/FileRepository";

@Injectable()
export class S3Storage implements StorageService {
  private readonly S3_BUCKET = "S3_BUCKET";
  private readonly S3_ACL = "S3_ACL";
  private readonly S3_STORAGE_CLASS = "S3_STORAGE_CLASS";

  private readonly s3: S3;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileRepository: FileRepository
  ) {
    this.s3 = new S3({});
  }

  public async uploadFile(file: File, stream: Readable, fileMimeType: string): Promise<void> {
    const id = file.id;
    const completedParts: CompletedPart[] = [];

    const chunkSizeToUpload = 1024 * 1024 * 5; // 5MB
    let chunksToUpload: Uint8Array[] = [];
    let chunksToUploadSize = 0;
    let partNumber = 1;

    let reconnectionTry = 3;

    const prepareUpload = await this.s3.createMultipartUpload({
      Bucket: this.configService.get<string>(this.S3_BUCKET),
      Key: `${id}`,
      ACL: this.configService.get<string>(this.S3_ACL),
      ContentType: fileMimeType,
      StorageClass: this.configService.get<string>(this.S3_STORAGE_CLASS)
    });

    stream.on("data", async (data: Uint8Array) => {
      chunksToUploadSize += data.byteLength;
      chunksToUpload.push(data);

      if (chunksToUploadSize > chunkSizeToUpload) {
        const readyChunkToSend = Buffer.concat(chunksToUpload);

        let { ETag } = await this.s3.uploadPart({
          Bucket: this.configService.get<string>(this.S3_BUCKET),
          Key: `${id}`,
          UploadId: prepareUpload.UploadId,
          Body: readyChunkToSend,
          PartNumber: partNumber
        });

        while (!ETag && reconnectionTry > 0) {
          let response = await this.s3.uploadPart({
            Bucket: this.configService.get<string>(this.S3_BUCKET),
            Key: `${id}`,
            UploadId: prepareUpload.UploadId,
            Body: readyChunkToSend,
            PartNumber: partNumber
          });

          ETag = response.ETag;
          if (!ETag) reconnectionTry--;
        }

        completedParts.push({ ETag });
        chunksToUpload = [];
        chunksToUploadSize = 0;
        partNumber++;
      }
    });

    stream.on("end", async () => {
      const lastChunkToSend = Buffer.concat(chunksToUpload);

      let { ETag } = await this.s3.uploadPart({
        Bucket: this.configService.get<string>(this.S3_BUCKET),
        Key: `${id}`,
        UploadId: prepareUpload.UploadId,
        Body: lastChunkToSend,
        PartNumber: partNumber
      });

      while (!ETag && reconnectionTry > 0) {
        let response = await this.s3.uploadPart({
          Bucket: this.configService.get<string>(this.S3_BUCKET),
          Key: `${id}`,
          UploadId: prepareUpload.UploadId,
          Body: lastChunkToSend,
          PartNumber: partNumber
        });

        ETag = response.ETag;
        if (!ETag) reconnectionTry--;
      }

      completedParts.push({ ETag });
    });

    stream.on("close", async () => {
      const completedUpload = await this.s3.completeMultipartUpload({
        Bucket: this.configService.get<string>(this.S3_BUCKET),
        Key: `${id}`,
        UploadId: prepareUpload.UploadId,
        MultipartUpload: {
          Parts: completedParts
        }
      });

      if (completedUpload) {
        await this.fileRepository.add(file);
      }
    });
  }

  public async downloadFile(file: File): Promise<Readable> {
    const s3File = {
      Bucket: this.configService.get<string>(this.S3_BUCKET),
      Key: `${file.id.toString()}.${file.getMimeType()}`
    };

    const response = await this.s3.headObject(s3File);
    return new SmartStream(s3File, this.s3, response.ContentLength);
  }

  public async getFileSize(file: File): Promise<number> {
    const size = await this.s3.headObject({
      Bucket: this.configService.get<string>(this.S3_BUCKET),
      Key: `${file.id.toString()}.${file.getMimeType()}`
    });

    return size.ContentLength;
  }
}

class SmartStream extends Readable {
  _currentCursorPosition = 0; // Holds the current starting position for our range queries
  _s3DataRange = 2048 * 1024; // Amount of bytes to grab (I have jacked this up HD video files)
  _maxContentLength: number; // Total number of bites in the file
  _s3: S3; // AWS.S3 instance
  _s3StreamParams: GetObjectRequest; // Parameters passed into s3.getObject method

  constructor(
    parameters: GetObjectRequest,
    s3: S3,
    maxLength: number,
    // You can pass any ReadableStream options to the NodeJS Readable super class here
    // For this example we wont use this, however I left it in to be more robust
    nodeReadableStreamOptions?: ReadableOptions
  ) {
    super(nodeReadableStreamOptions);
    this._maxContentLength = maxLength;
    this._s3 = s3;
    this._s3StreamParams = parameters;
  }

  _read() {
    if (this._currentCursorPosition > this._maxContentLength) {
      // If the current position is greater than the amount of bytes in the file
      // We push null into the buffer, NodeJS ReadableStream will see this as the end of file (EOF) and emit the 'end' event
      this.push(null);
    } else {
      // Calculate the range of bytes we want to grab
      const range = this._currentCursorPosition + this._s3DataRange;
      // If the range is greater than the total number of bytes in the file
      // We adjust the range to grab the remaining bytes of data
      const adjustedRange =
        range < this._maxContentLength ? range : this._maxContentLength;
      // Set the Range property on our s3 stream parameters
      this._s3StreamParams.Range = `bytes=${this._currentCursorPosition}-${adjustedRange}`;
      // Update the current range beginning for the next go
      this._currentCursorPosition = adjustedRange + 1;
      // Grab the range of bytes from the file
      this._s3.getObject(this._s3StreamParams, (error, data) => {
        if (error) {
          // If we encounter an error grabbing the bytes
          // We destroy the stream, NodeJS ReadableStream will emit the 'error' event
          this.destroy(error);
        } else {
          // We push the data into the stream buffer
          this.push(data.Body);
        }
      });
    }
  }
}