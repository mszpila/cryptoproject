import { registerDecorator, ValidationOptions } from "class-validator";
import { Readable } from "stream";

export function IsReadable(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: "IsReadable",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value instanceof Readable;
        },
        defaultMessage() {
          return `${propertyName} must be a Readable`;
        }
      }
    });
  };
}