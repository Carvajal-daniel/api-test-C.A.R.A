import type { Amount } from '../value-objects/amount.vo.js';

export interface TransactionProps {
  id: string;
  contractId: string;
  amount: Amount;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class TransactionEntity {
  private constructor(private readonly props: TransactionProps) {
    this.props = {
      ...props,
      date: new Date(props.date),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    };
    Object.freeze(this);
  }

  static create(props: TransactionProps): TransactionEntity {
    return new TransactionEntity(props);
  }

  get id(): string {
    return this.props.id;
  }

  get contractId(): string {
    return this.props.contractId;
  }

  get amount(): number {
    return this.props.amount.value;
  }

  get description(): string {
    return this.props.description;
  }

  get date(): Date {
    return new Date(this.props.date);
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }
}
