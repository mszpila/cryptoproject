import { BadRequestException } from '@nestjs/common';

export class ListOptions {
  public readonly offset: number;
  public readonly limit: number;
  public readonly sortBy: string | null;

  constructor(offset: number, limit: number, sortBy?: string) {
    if (ListOptions.isOffsetValid(offset)) this.offset = offset;
    if (ListOptions.isLimitValid(limit)) this.limit = limit;
    this.sortBy = sortBy || null;
  }

  private static isOffsetValid(offset: number): boolean {
    if (offset < 0) {
      throw new BadRequestException('Offset option cannot be less than 0');
    }
    return true;
  }

  private static isLimitValid(limit: number): boolean {
    if (limit < 1) {
      throw new BadRequestException('Limit option cannot be less than 1');
    }
    return true;
  }
}