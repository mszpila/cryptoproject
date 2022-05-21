export abstract class PaymentProvider {
  public abstract pay(amount: string): Promise<string>;
}