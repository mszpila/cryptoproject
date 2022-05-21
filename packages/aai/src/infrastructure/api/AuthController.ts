import { Controller, Post } from "@nestjs/common";
import { AuthApplicationService } from "../../application/AuthApplicationService";
import { TokenDTO } from "../../application/dto/TokenDTO";

@Controller("/auth-and-identity")
export class AuthController {
  constructor(
    private readonly authApplicationService: AuthApplicationService
  ) {
  }

  @Post("/register")
  public async standardRegisterUser(): Promise<TokenDTO> {
    return this.authApplicationService.standardRegisterUser({
      email: "",
      password: ""
    });
  }

  @Post("/register/google")
  public async googleRegisterUser(): Promise<TokenDTO> {
    return this.authApplicationService.googleRegisterUser({
      email: "",
      oauth: ""
    });
  }

  @Post("/login")
  public async standardLoginUser(): Promise<TokenDTO> {
    return this.authApplicationService.standardLoginUser({
      email: "",
      password: ""
    });
  }

  @Post("/login/google")
  public async googleLoginUser(): Promise<TokenDTO> {
    return this.authApplicationService.googleLoginUser({
      email: "",
      oauth: ""
    });
  }

  @Post("/submit-reset-password")
  public async registerStandardUser(): Promise<void> {
    await this.authApplicationService.getResetPasswordToken({
      email: ""
    });
  }

  @Post("/reset-password")
  public async resetPassword(): Promise<void> {
    await this.authApplicationService.resetPassword({
      password: "",
      resetToken: ""
    });
  }
}