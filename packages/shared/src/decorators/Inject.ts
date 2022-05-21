import { inject, interfaces } from "inversify";

export function Inject(
  serviceIdentifier: interfaces.ServiceIdentifier<any>
) {
  return inject(serviceIdentifier);
}