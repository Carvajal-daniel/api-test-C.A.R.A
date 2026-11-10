import type { ContractsRepository } from '../domain/repository/contracts.repository.interface.js';
import type { TransactionsRepository } from '../domain/repository/transactions.repository.interface.js';

export interface ContractDashboard {
  contractId: string;
  name: string;
  totalContracted: number;
  totalLaunched: number;
  availableBalance: number;
  nearLimit: boolean;
  underutilized: boolean;
  startDate: string | null; // Adicionado
  endDate: string | null;   // Adicionado
  transactions: Array<{     // Adicionado
    id: string;
    description: string;
    amount: number;
    date: string | null;
  }>;
}

export class GetDashboardUseCase {
  constructor(
    private readonly contractsRepository: ContractsRepository,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute(now = new Date()): Promise<ContractDashboard[]> {
    
    const contracts = await this.contractsRepository.findAll();

    return Promise.all(
      contracts.map(async (contract) => {

        const totalLaunched = await this.transactionsRepository.sumAmountByContractId(contract.id);

        const consumptionPercentage = (totalLaunched / contract.totalAmount) * 100;

        const contractDuration = contract.endDate ? contract.endDate.getTime() - contract.startDate.getTime() : 0;

        const elapsedPercentage =
          contractDuration > 0
            ? ((now.getTime() - contract.startDate.getTime()) / contractDuration) * 100
            : 0;

        // Formata as transações que o repositório já trouxe do banco atreladas a este contrato
        const mappedTransactions = (contract as any).transactions?.map((tx: any) => ({
          id: tx.id,
          description: tx.description,
          amount: Number(tx.amount),
          date: tx.date ? new Date(tx.date).toISOString() : null,
        })) || [];

        return {
          contractId: contract.id,
          name: contract.name,
          totalContracted: contract.totalAmount,
          totalLaunched,
          availableBalance: contract.totalAmount - totalLaunched,
          nearLimit: consumptionPercentage >= 80,
          underutilized: consumptionPercentage < 20 && elapsedPercentage > 50,
          startDate: contract.startDate ? new Date(contract.startDate).toISOString() : null, // Mapeado
          endDate: contract.endDate ? new Date(contract.endDate).toISOString() : null,     // Mapeado
          transactions: mappedTransactions,                                                 // Mapeado
        };
      }),
    );
  }
}
