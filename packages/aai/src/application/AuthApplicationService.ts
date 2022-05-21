import { AuthService } from "../domain/user/AuthService";
import { TokenService } from "../domain/token/TokenService";
import { UserPassword } from "../domain/user/password/UserPassword";
import { UserEmail } from "../domain/user/email/UserEmail";
import { UserOAuthID } from "../domain/user/UserOAuthID";
import { ResetPasswordTokenService } from "../domain/user/password/ResetPasswordTokenService";
import { ResetPasswordTokenID } from "../domain/user/password/ResetPasswordToken";
import { StandardUserCommand } from "./command/StandardUserCommand";
import { GoogleUserCommand } from "./command/GoogleUserCommand";
import { CreateResetTokenCommand } from "./command/CreateResetTokenCommand";
import { ResetPasswordCommand } from "./command/ResetPasswordCommand";
import { TokenDTO } from "./dto/TokenDTO";

export class AuthApplicationService {
  constructor(
    private readonly userService: AuthService,
    private readonly tokenService: TokenService,
    private readonly resetPasswordTokenService: ResetPasswordTokenService
  ) {
  }

  public async standardRegisterUser(command: StandardUserCommand): Promise<TokenDTO> {
    const user = await this.userService.standardRegister(new UserEmail(command.email), await UserPassword.createPassword(command.password));
    const token = await this.tokenService.createUserToken(user.id);

    return new TokenDTO(token);
  }

  public async googleRegisterUser(command: GoogleUserCommand): Promise<TokenDTO> {
    const user = await this.userService.googleRegister(new UserEmail(command.email), new UserOAuthID(command.oauth));
    const token = await this.tokenService.createUserToken(user.id);

    return new TokenDTO(token);
  }

  public async standardLoginUser(command: StandardUserCommand): Promise<TokenDTO> {
    const user = await this.userService.standardLogin(new UserEmail(command.email), command.password);
    const token = await this.tokenService.createUserToken(user.id);

    return new TokenDTO(token);
  }

  public async googleLoginUser(command: GoogleUserCommand): Promise<TokenDTO> {
    const user = await this.userService.googleLogin(new UserEmail(command.email), command.oauth);
    const token = await this.tokenService.createUserToken(user.id);

    return new TokenDTO(token);
  }

  public async getResetPasswordToken(command: CreateResetTokenCommand): Promise<any> {
    await this.resetPasswordTokenService.createResetPasswordToken(new UserEmail(command.email));
  }

  public async resetPassword(command: ResetPasswordCommand): Promise<void> {
    await this.resetPasswordTokenService.resetPassword(await UserPassword.createPassword(command.password), new ResetPasswordTokenID(command.resetToken));
  }
}