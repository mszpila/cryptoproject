import { ResetPasswordToken, ResetPasswordTokenID } from "./ResetPasswordToken";

export abstract class ResetPasswordTokenRepository {
  public abstract add(token: ResetPasswordToken): Promise<ResetPasswordToken>;

  public abstract findById(tokenID: ResetPasswordTokenID): Promise<ResetPasswordToken>;
}