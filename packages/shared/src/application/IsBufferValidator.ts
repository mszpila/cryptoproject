import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsBuffer(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isKeyValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Buffer.isBuffer(value);
        },
      },
    });
  };
}

export function IsMulterFile(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isKeyValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Buffer.isBuffer(value);
        },
      },
    });
  };
}
