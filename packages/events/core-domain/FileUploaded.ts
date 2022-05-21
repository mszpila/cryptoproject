import { CoreDomainEvent } from "./CoreDomainEvent";

interface FileUploadedPayload {
  file: string;
}

export class FileUploaded extends CoreDomainEvent<FileUploadedPayload> {
}