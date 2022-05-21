import { Controller, Get, InternalServerErrorException, Param, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { FileApplicationService } from "../../application/services/FileApplicationService";
import { Readable } from "stream";
import busboy, { FileInfo } from "busboy";
import { FilePriceDTO } from "../../application/dto/FilePriceDTO";

@Controller("/core/files")
export class FileController {
  constructor(
    private readonly fileApplicationService: FileApplicationService
  ) {
  }

  @Post("/:nft/upload/")
  public async uploadFile(
    @Param("nft") nft: string,
    @Req() request: Request
  ): Promise<void> {
    const stream = busboy({ headers: request.headers });

    stream.on("file", async (name: string, stream: Readable, fileInfo: FileInfo) => {
      await this.fileApplicationService.uploadFile({
        file: stream,
        fileName: fileInfo.filename,
        fileMimeType: fileInfo.mimeType,
        nft
      });
    });

    stream.on("error", async (error) => {
      console.log(new InternalServerErrorException(`Error: ${error}`));
    });

    request.pipe(stream);
  }

  @Get("/:nft/file")
  public async getFileByNFT(
    @Param("nft") nft: string
  ): Promise<any> {
    return this.fileApplicationService.getFileByNFT({ nft });
  }

  @Get("/:file")
  public async getFile(
    @Param("file") file: string
  ): Promise<any> {
    return this.fileApplicationService.getFile({ file });
  }

  @Get("/:file/download")
  public async downloadFile(
    @Param("file") file: string,
    @Res() response: Response
  ): Promise<any> {
    const stream = await this.fileApplicationService.downloadFile({ file });
    stream.pipe(response);
  }

  @Get("/:file/price")
  public async getFilePrice(
    @Param("file") file: string
  ): Promise<FilePriceDTO> {
    return this.fileApplicationService.getFilePrice({ file });
  }
}
