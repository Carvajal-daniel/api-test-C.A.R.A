import type { TransactionEntity } from '../entities/transaction.entity.js';

export interface TransactionsRepository {
  save(transaction: TransactionEntity): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<TransactionEntity | null>;
  sumAmountByContractId(contractId: string): Promise<number>;
}
