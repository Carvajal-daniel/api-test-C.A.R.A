import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ContractEntity } from '../domain/entities/contract.entity.js';
import { InsufficientBalanceError } from '../domain/errors/insufficient-balance.error.js';
import type { ContractsRepository } from '../domain/repository/contracts.repository.interface.js';
import type { TransactionsRepository } from '../domain/repository/transactions.repository.interface.js';
import { Amount } from '../domain/value-objects/amount.vo.js';
import { CreateTransactionUseCase } from './create-transaction.usecase.js';
import { GetDashboardUseCase } from './get-dashboard.usecase.js';

function createContract(): ContractEntity {
  const startDate = new Date('2026-01-01T00:00:00.000Z');
  return ContractEntity.create({
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Contrato de teste',
    totalAmount: Amount.create(100),
    startDate,
    createdAt: startDate,
    updatedAt: startDate,
  });
}

function createContractsRepository(contract: ContractEntity): ContractsRepository {
  return {
    save: async () => {},
    findById: async () => contract,
    findAll: async () => [contract],
  };
}

function createTransactionsRepository(
  currentAmount: number,
  saveTransaction: (contractId: string, amount: number) => void,
): TransactionsRepository {
  return {
    save: async (transaction) => saveTransaction(transaction.contractId, transaction.amount),
    delete: async () => {},
    findById: async () => null,
    sumAmountByContractId: async () => currentAmount,
  };
}

const transactionInput = {
  contractId: '00000000-0000-4000-8000-000000000001',
  amount: 30,
  description: 'Serviço executado',
  date: new Date('2026-03-01T00:00:00.000Z'),
};

test('salva lançamento quando o valor permanece dentro do limite contratado', async () => {
  const contract = createContract();
  let saved: { contractId: string; amount: number } | undefined;
  const useCase = new CreateTransactionUseCase(
    createContractsRepository(contract),
    createTransactionsRepository(60, (contractId, amount) => {
      saved = { contractId, amount };
    }),
  );

  await useCase.execute(transactionInput);

  assert.deepEqual(saved, { contractId: contract.id, amount: transactionInput.amount });
});

test('bloqueia lançamento que ultrapassa o valor total contratado', async () => {
  let saveCalled = false;
  const useCase = new CreateTransactionUseCase(
    createContractsRepository(createContract()),
    createTransactionsRepository(80, () => {
      saveCalled = true;
    }),
  );

  await assert.rejects(useCase.execute(transactionInput), InsufficientBalanceError);
  assert.equal(saveCalled, false);
});

test('calcula alertas de limite e subutilização com seus percentuais definidos', async () => {
  const startDate = new Date('2025-01-01T00:00:00.000Z');
  const now = new Date('2025-08-01T00:00:00.000Z');
  const nearLimitContract = ContractEntity.create({
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Contrato próximo do limite',
    totalAmount: Amount.create(100),
    startDate,
    createdAt: startDate,
    updatedAt: startDate,
  });
  const underutilizedContract = ContractEntity.create({
    id: '00000000-0000-4000-8000-000000000003',
    name: 'Contrato subutilizado',
    totalAmount: Amount.create(100),
    startDate,
    createdAt: startDate,
    updatedAt: startDate,
  });
  const contractsRepository: ContractsRepository = {
    save: async () => {},
    findById: async () => null,
    findAll: async () => [nearLimitContract, underutilizedContract],
  };
  const amounts = new Map([
    [nearLimitContract.id, 80],
    [underutilizedContract.id, 10],
  ]);
  const transactionsRepository: TransactionsRepository = {
    save: async () => {},
    delete: async () => {},
    findById: async () => null,
    sumAmountByContractId: async (contractId) => amounts.get(contractId) ?? 0,
  };

  const dashboard = await new GetDashboardUseCase(contractsRepository, transactionsRepository).execute(now);

  assert.equal(dashboard[0]?.nearLimit, true);
  assert.equal(dashboard[0]?.underutilized, false);
  assert.equal(dashboard[1]?.nearLimit, false);
  assert.equal(dashboard[1]?.underutilized, true);
});
