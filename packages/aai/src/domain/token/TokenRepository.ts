import { Token } from "./Token";
import { TokenValue } from "./TokenValue";

export abstract class TokenRepository {
  public abstract save(token: Token): Promise<Token>;

  public abstract findByValue(value: TokenValue): Promise<Token>;
}