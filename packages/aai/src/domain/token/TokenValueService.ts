import { TokenValue } from "./TokenValue";

export abstract class TokenValueService {
  public abstract createTokenValue(): Promise<TokenValue>;

  public abstract validateTokenValue(tokenValue: TokenValue): Promise<boolean>;
}