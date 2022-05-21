import { CoreDomainEvent } from "./CoreDomainEvent";

interface NFTPurchasedPayload {
  nftDraft: string;
}

export class NFTDraftPurchased extends CoreDomainEvent<NFTPurchasedPayload> {
}