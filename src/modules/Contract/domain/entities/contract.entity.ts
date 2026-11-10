import type { Amount } from '../value-objects/amount.vo.js';

export interface ContractProps {
  id: string;
  name: string;
  totalAmount: Amount;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ContractEntity {
  private constructor(
    private readonly props: ContractProps & { endDate: Date },
  ) {
    this.props = {
      ...props,
      startDate: new Date(props.startDate),
      endDate: new Date(props.endDate),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    };
    Object.freeze(this);
  }

  static create(props: ContractProps): ContractEntity {
    const endDate = new Date(props.startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    return new ContractEntity({ ...props, endDate });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get totalAmount(): number {
    return this.props.totalAmount.value;
  }

  get startDate(): Date {
    return new Date(this.props.startDate);
  }

  get endDate(): Date {
    return new Date(this.props.endDate);
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }
}
