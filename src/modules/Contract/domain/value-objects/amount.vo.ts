import { InvalidAmountError } from '../errors/invalid-amount.error.js';

export class Amount {
  private constructor(private readonly amount: number) {
    Object.freeze(this);
  }

  static create(value: number): Amount {
    if (!Number.isFinite(value) || value <= 0) {
      throw new InvalidAmountError();
    }

    return new Amount(value);
  }

  get value(): number {
    return this.amount;
  }
}
