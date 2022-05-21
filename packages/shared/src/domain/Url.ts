import { BadRequestException } from '@nestjs/common';
import { URL } from "url";

export class Url {

  private readonly url: URL;

  constructor(
    initUrlString: string
  ) {
    try {
      this.url = new URL(initUrlString);
    } catch (error) {
      throw new BadRequestException( error, 'Wrong url provided');
    }
  }

  public isHttps(): boolean {
    return this.url.protocol === 'https:';
  }

  public getHost(): string {
    return this.url.hostname;
  }

  public getSlug(): string {
    return this
      .getHost()
      .replace(/[^A-Za-z0-9]/g, '-') // replace non char/number by dashes
      .replace(/-+/g, '-') // split dashes
      .replace(/^-+|-+$/g, '');
  }

  public toString(): string {
    return this.url.toString();
  }

  // from project model
  public trimSlash(): string {
    return (`${ this.url }`.trim().endsWith('/')) ? `${ this.url }`.trim().slice(0, -1) : `${ this.url }`.trim();
  }
}
