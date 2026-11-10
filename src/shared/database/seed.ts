import { db, pool } from './database.js';
import { contracts, transactions } from '../../modules/Contract/infra/database/schema/contract-schema.js';

const nearLimitContractId = 'c65a5b71-7706-4bd0-9e41-323891b3e340';
const underutilizedContractId = '1cfd3a63-f238-479f-aa0a-d92f194ef703';
const nearLimitTransactionId = '53bb2b40-f02f-4d35-8fab-37e93a198ef2';
const underutilizedTransactionId = 'b1064d37-bc15-46c1-8c37-a997969af64d';

function oneYearAfter(date: Date): Date {
  const endDate = new Date(date);
  endDate.setFullYear(endDate.getFullYear() + 1);
  return endDate;
}

async function seed(): Promise<void> {
  const now = new Date();
  const nearLimitStartDate = new Date(now);
  nearLimitStartDate.setDate(nearLimitStartDate.getDate() - 60);
  const underutilizedStartDate = new Date(now);
  underutilizedStartDate.setDate(underutilizedStartDate.getDate() - 240);

  const sampleContracts = [
    {
      id: nearLimitContractId,
      name: 'Contrato próximo do limite',
      totalAmount: 1000,
      startDate: nearLimitStartDate,
    },
    {
      id: underutilizedContractId,
      name: 'Contrato subutilizado',
      totalAmount: 1000,
      startDate: underutilizedStartDate,
    },
  ];

  for (const contract of sampleContracts) {
    await db
      .insert(contracts)
      .values({
        ...contract,
        endDate: oneYearAfter(contract.startDate),
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: contracts.id,
        set: {
          name: contract.name,
          totalAmount: contract.totalAmount,
          startDate: contract.startDate,
          endDate: oneYearAfter(contract.startDate),
          updatedAt: now,
        },
      });
  }

  const sampleTransactions = [
    {
      id: nearLimitTransactionId,
      contractId: nearLimitContractId,
      amount: 900,
      description: 'Lançamento para simular consumo próximo ao limite',
    },
    {
      id: underutilizedTransactionId,
      contractId: underutilizedContractId,
      amount: 100,
      description: 'Lançamento para simular baixa utilização',
    },
  ];

  for (const transaction of sampleTransactions) {
    await db
      .insert(transactions)
      .values({ ...transaction, date: now, createdAt: now, updatedAt: now })
      .onConflictDoUpdate({
        target: transactions.id,
        set: {
          contractId: transaction.contractId,
          amount: transaction.amount,
          description: transaction.description,
          date: now,
          updatedAt: now,
        },
      });
  }
}

try {
  await seed();
  console.log('Contratos de exemplo inseridos ou atualizados com sucesso.');
} finally {
  await pool.end();
}
