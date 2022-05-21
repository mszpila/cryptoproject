import { CoreDomainEvent } from "./CoreDomainEvent";

interface MetadataUploadedToWeb3Payload {
  nftDraft: string;
}

export class MetadataUploadedToWeb3 extends CoreDomainEvent<MetadataUploadedToWeb3Payload> {
}