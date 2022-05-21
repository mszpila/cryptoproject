import { ObjectID } from "bson";
import { Equalable } from "./IEqualable";

export class Identifier implements Equalable<Identifier> {
  private readonly value: string;

  constructor(id?: string) {
    this.value = new ObjectID(id).toHexString();
  }

  static isValid(value: ObjectID): boolean {
    const isObjectId = /^[0-9a-fA-F]{24}$/;
    try {
      if (!isObjectId.test(value.toString())) {
        return false;
      }
      new ObjectID(value);
    } catch (e) {
      return false;
    }

    return true;
  }

  toString(): string {
    return this.value;
  }

  // toJSON(): JSON {
  //   return JSON.parse(this.value);
  // }

  equals(other: this): boolean {
    return this.value === other.toString();
  }

  toObjectID(): ObjectID {
    return new ObjectID(this.value);
  }
}
