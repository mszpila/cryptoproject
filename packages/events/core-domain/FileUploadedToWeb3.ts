import { CoreDomainEvent } from "./CoreDomainEvent";

interface FileUploadedToWeb3Payload {
  nftDraft: string;
}

export class FileUploadedToWeb3 extends CoreDomainEvent<FileUploadedToWeb3Payload> {
}