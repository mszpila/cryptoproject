import { UserRepository } from "../domain/user/UserRepository";
import { ConfirmEmailTokenRepository } from "../domain/user/email/ConfirmEmailTokenRepository";
import { ConfirmEmailTokenID } from "../domain/user/email/ConfirmEmailToken";
import { BadRequestException } from "@nestjs/common";

export class UserApplicationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly confirmEmailTokenRepository: ConfirmEmailTokenRepository
  ) {
  }

  public async confirmEmail(command: any): Promise<void> {
    const confirmToken = await this.confirmEmailTokenRepository.findById(new ConfirmEmailTokenID(command.emailToken));
    const user = await this.userRepository.findById(confirmToken.getUser());

    if (user.isEmailVerified()) throw new BadRequestException("Email already verified");

    user.verifyEmail();
    await this.userRepository.update(user);
  }
}