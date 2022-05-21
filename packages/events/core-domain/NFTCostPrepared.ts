import { CoreDomainEvent } from "./CoreDomainEvent";

interface NFTCostPreparedPayload {
  nft: string;
  cost: string;
}

export class NFTCostPrepared extends CoreDomainEvent<NFTCostPreparedPayload> {
}