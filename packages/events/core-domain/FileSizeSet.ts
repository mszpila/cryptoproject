import { CoreDomainEvent } from "./CoreDomainEvent";

interface FileSizeSetPayload {
  file: string;
}

export class FileSizeSet extends CoreDomainEvent<FileSizeSetPayload> {
}