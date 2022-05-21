import { CoreDomainEvent } from "../CoreDomainEvent";

interface NFTTokenMintedPayload {
  nft: string;
}

export class NFTTokenMinted extends CoreDomainEvent<NFTTokenMintedPayload> {
}