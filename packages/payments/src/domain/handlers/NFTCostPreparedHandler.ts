import { PaymentHandler } from "./registry/PaymentHandler";
import { NFTCostPrepared } from "../../../../events";
import { Injectable } from "../../../../shared/src/decorators/Injectable";
import { Handler } from "../../../../shared/src/decorators/Handler";
import { PaymentService } from "../payment/PaymentService";
import { NFTDraftID } from "../NFTDraftID";

@Injectable()
@Handler(NFTCostPrepared)
export class NFTCostPreparedHandler extends PaymentHandler {
  constructor(
    private readonly paymentService: PaymentService
  ) {
    super();
  }

  public async handle(event: NFTCostPrepared): Promise<void> {
    await this.paymentService.buyNFT(new NFTDraftID(event.payload.nft));
  }
}