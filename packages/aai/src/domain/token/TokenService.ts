import { TokenValue } from "./TokenValue";
import { TokenRepository } from "./TokenRepository";
import { Token, TokenID } from "./Token";
import { UserID } from "../user/User";
import { TokenRole } from "./TokenRole";
import { TokenValueService } from "./TokenValueService";

export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly tokenValueService: TokenValueService
  ) {
  }

  public async createUserToken(userId: UserID): Promise<Token> {
    const tokenValue = await this.tokenValueService.createTokenValue();
    const token = new Token(new TokenID(), userId, tokenValue, TokenRole.USER);

    return this.tokenRepository.save(token);
  }

  public async createAdminToken(userId: UserID): Promise<Token> {
    const tokenValue = await this.tokenValueService.createTokenValue();
    const token = new Token(new TokenID(), userId, tokenValue, TokenRole.ADMIN);

    return this.tokenRepository.save(token);
  }

  public async validateUserToken(userId: UserID, tokenValue: TokenValue): Promise<boolean> {
    const token = await this.tokenRepository.findByValue(tokenValue);
    if (!token.getUser().equals(userId)) return false;
    return this.tokenValueService.validateTokenValue(token.getValue());
  }

  public async validateAdminToken(userId: UserID, tokenValue: TokenValue): Promise<boolean> {
    const token = await this.tokenRepository.findByValue(tokenValue);
    if (!token.getUser().equals(userId) || !token.isAdmin()) return false;
    return this.tokenValueService.validateTokenValue(token.getValue());
  }
}