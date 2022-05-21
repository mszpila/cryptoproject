export class NFTTitle {
  private readonly maxLength = 60;

  constructor(
    private readonly title: string
  ) {
    this.title = title
      .toLowerCase()
      .substring(0, this.maxLength)
  }

  public toString(): string {
    return this.title;
  }
}