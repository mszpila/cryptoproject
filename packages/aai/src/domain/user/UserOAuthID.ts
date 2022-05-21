export class UserOAuthID {
  constructor(
    private readonly id: string
  ) {
  }

  public toString(): string {
    return this.id;
  }
}