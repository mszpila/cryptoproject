import { PaymentProvider } from "../../domain/PaymentProvider";
import { Injectable } from "../../../../shared/src/decorators/Injectable";

@Injectable()
export class DummyPaymentProvider implements PaymentProvider {
  public async pay(amount: string): Promise<string> {
    return "100";
  }
}