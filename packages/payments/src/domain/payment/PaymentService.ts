import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { EventBus } from "../../../../shared/src/domain/EventBus";
import { NFTDraftPurchased } from "../../../../events/core-domain/NFTDraftPurchased";
import { NFTDraftID } from "../NFTDraftID";

@Injectable()
export class PaymentService {
  constructor(
    private readonly eventBus: EventBus
  ) {
  }

  public async buyNFT(nftDraftId: NFTDraftID): Promise<void> {
    await this.eventBus.publish(new NFTDraftPurchased({ nftDraft: nftDraftId.toString() }));
  }
}