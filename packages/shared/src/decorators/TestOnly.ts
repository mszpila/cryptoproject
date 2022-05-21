// import { RuntimeError } from '../errors/RuntimeError';

export function TestOnly() {
  return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void {
    if (process.env.NODE_ENV !== 'testing') {
      // descriptor.value = function () { throw new RuntimeError('Test method can be used only in testing environment', { propertyKey }) };
      descriptor.value = function () { throw new Error('Test method can be used only in testing environment') };
    }
  };
}