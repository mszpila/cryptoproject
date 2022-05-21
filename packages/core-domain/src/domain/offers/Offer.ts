import { Entity } from "../../../../shared/src/domain/Entity";
import { NFTDraftID } from "../nftDraft/NFTDraft";
import { UserID } from "../UserID";
import { DateValue } from "../../../../shared/src/domain/DateValue";
import { OfferSnapshot } from "./OfferSnapshot";
import { Identifier } from "../../../../shared/src/domain/Identifier";
import { Price } from "./Price";

export class OfferID extends Identifier {
}

export class Offer extends Entity<OfferID, OfferSnapshot> {
  private nft: NFTDraftID;
  private ownerId: UserID;
  private price: Price;
  private bids: Price[];
  private createdAt: DateValue;
  private updatedAt: DateValue;
  private expiredAt: DateValue;
  private deletedAt: DateValue;

  public toSnapshot(): OfferSnapshot {
    return new OfferSnapshot();
  }

  public isDeleted(): boolean {
    return !this.deletedAt.isNullable();
  }
}