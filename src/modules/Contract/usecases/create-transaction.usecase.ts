import { randomUUID } from 'node:crypto';
import { ContractNotFoundError } from '../domain/errors/contract-not-found.error.js';
import { InsufficientBalanceError } from '../domain/errors/insufficient-balance.error.js';
import { TransactionEntity } from '../domain/entities/transaction.entity.js';
import type { ContractsRepository } from '../domain/repository/contracts.repository.interface.js';
import type { TransactionsRepository } from '../domain/repository/transactions.repository.interface.js';
import { Amount } from '../domain/value-objects/amount.vo.js';
import type { CreateTransactionDTO } from './contract-dto.js';

export class CreateTransactionUseCase {
  constructor(
    private readonly contractsRepository: ContractsRepository,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute(data: CreateTransactionDTO): Promise<TransactionEntity> {

    const contract = await this.contractsRepository.findById(data.contractId);
    if (!contract) {
      throw new ContractNotFoundError();
    }

    const amount = Amount.create(data.amount);
    
    const currentAmount = await this.transactionsRepository.sumAmountByContractId(contract.id);
    if (currentAmount + amount.value > contract.totalAmount) {
      throw new InsufficientBalanceError();
    }

    const now = new Date();
    const transaction = TransactionEntity.create({
      id: randomUUID(),
      contractId: contract.id,
      amount,
      description: data.description,
      date: data.date,
      createdAt: now,
      updatedAt: now,
    });

    await this.transactionsRepository.save(transaction);
    return transaction;
  }
}
