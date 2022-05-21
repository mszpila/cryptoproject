import { ContainerModule } from "inversify";
import { PaymentService } from "./payment/PaymentService";
import { NFTCostPreparedHandler } from "./handlers/NFTCostPreparedHandler";

export class DomainModule extends ContainerModule {
  constructor() {
    super((bind) => {
      bind(PaymentService).toSelf();

      bind(NFTCostPreparedHandler).toSelf();
    });
  }
}