import { UserPassword } from "./UserPassword";
import { ResetPasswordTokenRepository } from "./ResetPasswordTokenRepository";
import { NotFoundException } from "@nestjs/common";
import { UserRepository } from "../UserRepository";
import { ResetPasswordToken, ResetPasswordTokenID } from "./ResetPasswordToken";
import { UserEmail } from "../email/UserEmail";

export class ResetPasswordTokenService {
  constructor(
    private readonly resetPasswordTokenRepository: ResetPasswordTokenRepository,
    private readonly userRepository: UserRepository
  ) {
  }

  public async resetPassword(password: UserPassword, resetToken: ResetPasswordTokenID): Promise<void> {
    const tokenExist = await this.resetPasswordTokenRepository.findById(resetToken);
    if (!tokenExist) throw new NotFoundException("Token not found");

    const user = await this.userRepository.findById(tokenExist.getUser());
    if (!user) throw new NotFoundException("User not found");

    user.updatePassword(password);
    await this.userRepository.update(user);
  }

  public async createResetPasswordToken(email: UserEmail): Promise<ResetPasswordToken> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException("User not found");

    return this.resetPasswordTokenRepository.add(new ResetPasswordToken(new ResetPasswordTokenID(), user.id));
  }
}