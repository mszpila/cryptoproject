import { CoreDomainEvent } from "./CoreDomainEvent";

interface NFTOnWeb3CreatedPayload {
  nft: string;
}

export class NFTOnWeb3Created extends CoreDomainEvent<NFTOnWeb3CreatedPayload> {
}