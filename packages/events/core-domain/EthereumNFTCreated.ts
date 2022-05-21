import { CoreDomainEvent } from "./CoreDomainEvent";

interface EthereumNFTCreatedPayload {
  nft: string;
}

export class EthereumNFTCreated extends CoreDomainEvent<EthereumNFTCreatedPayload> {
}