import { AAIEvent } from "./AAIEvent";

interface ConfirmEmailTokenCreatedPayload {
  tokenId: string;
}

export class ConfirmEmailTokenCreated extends AAIEvent<ConfirmEmailTokenCreatedPayload> {
}