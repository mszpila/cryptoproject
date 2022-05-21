import * as util from "util";
import { BadRequestException } from "@nestjs/common";

type EnumValue = string | number;

export class EnumOld<T extends EnumValue = EnumValue> {
  constructor(protected readonly value: T) {
    if (this.hasAllowedValues()) {
      throw new BadRequestException(util.format('Use @EnumOld.decorate() to decorate your enum "%s"', this.constructor.name));
    }
    const obj = Reflect.getMetadata('enum:values', this).get(value);

    if (!obj) {
      throw new BadRequestException(`Illegal value "${ value }" for enum ${ this.constructor.name }`);
    }

    this.value = value;
  }

  toString() {
    return `${ this.value }`;
  }

  valueOf(): T {
    return this.value;
  }

  public equals(other: EnumOld<T>): boolean {
    return this.toString() === other.toString();
  }

  private hasAllowedValues(): boolean {
    return Reflect.hasMetadata('enum:values', this);
  }

  public static decorate<T>() {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
      const enumValues = new Set();

      for (const propertyKey in constructor) {
        if (enumValues.has(constructor[propertyKey])) {
          throw new BadRequestException(`Duplicate key "${ constructor[propertyKey] }" in enum ${ constructor.name }`);
        }
        enumValues.add(constructor[propertyKey]);
      }

      Reflect.defineMetadata('enum:values', enumValues, constructor.prototype);
    };
  }
}

// export function EnumDecorator() {
//   return function <T extends { new(...args: any[]): {} }>(constructor: T) {
//     const enumValues = new Set();
//
//     for (const propertyKey in constructor) {
//       if (enumValues.has(constructor[propertyKey])) {
//         throw new BadRequestException(`Duplicate key "${ constructor[propertyKey] }" in enum ${ constructor.name }`);
//       }
//       enumValues.add(constructor[propertyKey]);
//     }
//
//     Reflect.defineMetadata('enum:values', enumValues, constructor.prototype);
//   };
// }
