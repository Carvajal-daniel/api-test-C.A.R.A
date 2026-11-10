import { TransactionNotFoundError } from '../domain/errors/transaction-not-found.error.js';
import type { TransactionsRepository } from '../domain/repository/transactions.repository.interface.js';

export class DeleteTransactionUseCase {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async execute(id: string): Promise<void> {
    const transaction = await this.transactionsRepository.findById(id);
    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    await this.transactionsRepository.delete(transaction.id);
  }
}
