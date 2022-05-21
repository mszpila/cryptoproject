import { Container } from "inversify";
import { UserID } from "../../../src/domain/UserID";
import { NFTApplicationService } from "../../../src/application/services/NFTApplicationService";
import { BlockchainType } from "../../../src/domain/nft/BlockchainType";
import { NFTStandard } from "../../../src/domain/nft/NFTStandard";
import { FileApplicationService } from "../../../src/application/services/FileApplicationService";
import { Readable } from "stream";
import { DraftCreatedDTO } from "../../../src/application/dto/DraftCreatedDTO";
import { delay } from "../../../../shared/src/utils/delay";
import { CoreDomainModule } from "../../../src/CoreDomainModule";
import { PaymentModule } from "../../../../payments/src/PaymentModule";
import { EventBus } from "../../../../shared/src/domain/EventBus";
import { NFTDraftPurchased } from "../../../../events/core-domain/NFTDraftPurchased";

describe("NFTApplicationService", () => {
  let ctx: Container;
  let ctx2: Container;
  let nftApplicationService: NFTApplicationService;
  let fileApplicationService: FileApplicationService;
  let userId: UserID;

  beforeAll(async () => {
    ctx = await CoreDomainModule.create();
    ctx2 = await PaymentModule.create();
    nftApplicationService = ctx.get(NFTApplicationService);
    fileApplicationService = ctx.get(FileApplicationService);
    userId = new UserID();
  });

  describe("NFT draft", () => {
    it("should create NFT draft", async () => {
      const nftCreatedDTO = await nftApplicationService.createDraft({ user: userId.toString() });
      const nftDraftDTO = await nftApplicationService.getNFTDraft({ nft: nftCreatedDTO.id });

      expect(nftDraftDTO).toBeDefined();
      expect(nftDraftDTO.creator).toEqual(userId.toString());
    });

    it("should update NFT draft", async () => {
      const nftCreatedDTO = await nftApplicationService.createDraft({ user: userId.toString() });
      await nftApplicationService.updateDraft({
        nft: nftCreatedDTO.id,
        options: [{
          blockchain: BlockchainType.ETHEREUM.toString(),
          standard: NFTStandard.NFT_1155.toString()
        }],
        metadata: {
          name: "testCollection",
          description: "test",
          image: "",
          attributes: []
        }
      });
      const nftDraftDTO = await nftApplicationService.getNFTDraft({ nft: nftCreatedDTO.id });

      expect(nftDraftDTO).toBeDefined();
      expect(nftDraftDTO.id).toEqual(nftCreatedDTO.id);
      expect(nftDraftDTO.options.length).toEqual(1);
      expect(nftDraftDTO.options[0].blockchainType).toEqual(BlockchainType.ETHEREUM.toString());
      expect(nftDraftDTO.options[0].nftStandard).toEqual(NFTStandard.NFT_1155.toString());
    });

    it("should delete NFT draft", async () => {
      const nftCreatedDTO = await nftApplicationService.createDraft({ user: userId.toString() });
      await nftApplicationService.deleteDraft({ nft: nftCreatedDTO.id, user: userId.toString() });

      await expect(nftApplicationService.getNFTDraft({ nft: nftCreatedDTO.id }))
        .rejects.toThrowError(`NFT ${nftCreatedDTO.id} does not exist`);
    });
  });

  describe("NFT", () => {
    let nftCreatedDTO: DraftCreatedDTO;

    beforeAll(async () => {
      nftCreatedDTO = await nftApplicationService.createDraft({ user: userId.toString() });
      await nftApplicationService.updateDraft({
        nft: nftCreatedDTO.id,
        options: [{
          blockchain: BlockchainType.ETHEREUM.toString(),
          standard: NFTStandard.NFT_1155.toString()
        }],
        metadata: {
          name: "testCollection",
          description: "test",
          image: "",
          attributes: []
        }
      });
      await fileApplicationService.uploadFile({
        nft: nftCreatedDTO.id,
        file: Readable.from(Buffer.from("test data")),
        fileMimeType: "image/png",
        fileName: "test_file"
      });

      await delay(100);
    });

    it("should create NFT", async () => {
      await nftApplicationService.createNFT({ nft: nftCreatedDTO.id });
      await ctx.get(EventBus).publish(new NFTDraftPurchased({ nftDraft: nftCreatedDTO.id }));
      await delay(100);
      const nftDTO = await nftApplicationService.getNFTByOwner({ user: userId.toString() });

      expect(nftDTO).toBeDefined();
      expect(nftDTO.owner).toEqual(userId.toString());
    });
  });
});