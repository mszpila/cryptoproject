import { NFTApplicationService } from "../../application/services/NFTApplicationService";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { DraftCreatedDTO } from "../../application/dto/DraftCreatedDTO";

@Controller("/core/nfts")
export class NFTController {
  constructor(
    private readonly nftApplicationService: NFTApplicationService
  ) {
  }

  @Post("/draft")
  public async createDraftNFT(): Promise<DraftCreatedDTO> {
    return this.nftApplicationService.createDraft({
      user: ""
    });
  }

  @Put("/:nft")
  public async updateDraftNFT(
    @Param("nft") nft: string,
    @Body() body: IUpdateNFTDraftBody
  ): Promise<void> {
    await this.nftApplicationService.updateDraft({
      nft,
      ...body
    });
  }

  @Post("/:nft")
  public async createNFT(
    @Param("nft") nft: string
  ): Promise<void> {
    await this.nftApplicationService.createNFT({ nft });
  }

  @Get("/:nft")
  public async getNFT(
    @Param("nft") nft: string
  ): Promise<any> {
    return this.nftApplicationService.getNFTDraft({ nft });
  }

  @Get()
  public async listNFT(
    @Body() body: { user: string }
  ): Promise<any> {
    return this.nftApplicationService.listNFT({ ...body });
  }

  @Delete("/:nft")
  public async deleteDraftNFT(
    @Param("nft") nft: string
  ): Promise<void> {
    await this.nftApplicationService.deleteDraft({
      nft,
      user: ""
    });
  }
}

interface IUpdateNFTDraftBody {
  options: {
    blockchain: string;
    standard: string;
  }[];
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: string[];
  };
}