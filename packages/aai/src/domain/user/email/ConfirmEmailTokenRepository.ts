import { ConfirmEmailToken, ConfirmEmailTokenID } from "./ConfirmEmailToken";

export abstract class ConfirmEmailTokenRepository {
  public abstract add(token: ConfirmEmailToken): Promise<ConfirmEmailToken>;

  public abstract findById(tokenID: ConfirmEmailTokenID): Promise<ConfirmEmailToken>;

}