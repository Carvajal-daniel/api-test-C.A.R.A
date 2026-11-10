import { eq, sql } from 'drizzle-orm';
import { db } from '../../../../../shared/database/database.js';
import { ContractEntity } from '../../../domain/entities/contract.entity.js';
import { TransactionEntity } from '../../../domain/entities/transaction.entity.js';
import type { ContractsRepository } from '../../../domain/repository/contracts.repository.interface.js';
import type { TransactionsRepository } from '../../../domain/repository/transactions.repository.interface.js';
import { Amount } from '../../../domain/value-objects/amount.vo.js';
import { contracts, transactions } from '../schema/contract-schema.js';

export class ContractRepositoryImpl implements ContractsRepository {
  async save(contract: ContractEntity): Promise<void> {
    await db.insert(contracts).values({
      id: contract.id,
      name: contract.name,
      totalAmount: contract.totalAmount,
      startDate: contract.startDate,
      endDate: contract.endDate,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    });
  }

  async findById(id: string): Promise<ContractEntity | null> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);
    if (!contract) {
      return null;
    }

    // 1. Busca todas as transações atreladas a este contrato específico no banco
    const dbTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.contractId, id));

    // 2. Converte os registros do banco para entidades TransactionEntity do domínio
    const mappedTransactions = dbTransactions.map((tx) =>
      TransactionEntity.create({
        id: tx.id,
        contractId: tx.contractId,
        amount: Amount.create(tx.amount),
        description: tx.description,
        date: tx.date,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      })
    );

    // 3. Retorna a entidade removendo 'endDate' (gerado no domínio) e injetando as transações
    return ContractEntity.create({
      id: contract.id,
      name: contract.name,
      totalAmount: Amount.create(contract.totalAmount),
      startDate: contract.startDate,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
      transactions: mappedTransactions,
    } as any);
  }

  async findAll(): Promise<ContractEntity[]> {
    const rows = await db.select().from(contracts);
    
    // Mapeia em paralelo todos os contratos injetando suas respectivas listas de lançamentos
    return Promise.all(
      rows.map(async (contract) => {
        const dbTransactions = await db
          .select()
          .from(transactions)
          .where(eq(transactions.contractId, contract.id));

        const mappedTransactions = dbTransactions.map((tx) =>
          TransactionEntity.create({
            id: tx.id,
            contractId: tx.contractId,
            amount: Amount.create(tx.amount),
            description: tx.description,
            date: tx.date,
            createdAt: tx.createdAt,
            updatedAt: tx.updatedAt,
          })
        );

        return ContractEntity.create({
          id: contract.id,
          name: contract.name,
          totalAmount: Amount.create(contract.totalAmount),
          startDate: contract.startDate,
          createdAt: contract.createdAt,
          updatedAt: contract.updatedAt,
          transactions: mappedTransactions,
        } as any);
      })
    );
  }
}

export class TransactionRepositoryImpl implements TransactionsRepository {
  async save(transaction: TransactionEntity): Promise<void> {
    await db.insert(transactions).values({
      id: transaction.id,
      contractId: transaction.contractId,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
    if (!transaction) {
      return null;
    }

    return TransactionEntity.create({
      id: transaction.id,
      contractId: transaction.contractId,
      amount: Amount.create(transaction.amount),
      description: transaction.description,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }

  async sumAmountByContractId(contractId: string): Promise<number> {
    const [result] = await db
      .select({
        total: sql<string>`coalesce(sum(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(eq(transactions.contractId, contractId));

    return Number(result?.total ?? 0);
  }
}
