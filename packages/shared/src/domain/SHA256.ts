import { BadRequestException } from '@nestjs/common';

export class SHA256 {
  constructor(private readonly hash: Buffer) {
    if (this.validateFingerprintIsSHA256(hash)) throw new BadRequestException('Hash is not a valid SHA-256');
  }

  private validateFingerprintIsSHA256(hash: Buffer): boolean {
    return /^[a-f0-9]{64}$/gi.test(hash.toString());
  }

  public toSting(): string {
    return this.hash.toString();
  }

  public toBuffer(): Buffer {
    return this.hash;
  }
}