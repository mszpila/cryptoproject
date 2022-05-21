import { ConfirmEmailTokenRepository } from "./ConfirmEmailTokenRepository";
import { ConfirmEmailToken, ConfirmEmailTokenID } from "./ConfirmEmailToken";
import { UserID } from "../User";
import { ConfirmEmailTokenCreated } from "../../../../../events/aai/ConfirmEmailTokenCreated";

export class ConfirmEmailTokenService {
  constructor(
    private readonly confirmEmailTokenRepository: ConfirmEmailTokenRepository
  ) {
  }

  public async createConfirmEmailToken(userId: UserID): Promise<void> {
    const token = new ConfirmEmailToken(new ConfirmEmailTokenID(), userId);
    token.registerEvent(new ConfirmEmailTokenCreated({ tokenId: token.id.toString() }));

    await this.confirmEmailTokenRepository.add(token);
  }
}