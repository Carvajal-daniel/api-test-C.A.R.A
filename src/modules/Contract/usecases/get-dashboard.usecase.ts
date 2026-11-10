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

        const contractDuration = contract.endDate.getTime() - contract.startDate.getTime();

        const elapsedPercentage =
          contractDuration > 0
            ? ((now.getTime() - contract.startDate.getTime()) / contractDuration) * 100
            : 0;

        return {
          contractId: contract.id,
          name: contract.name,
          totalContracted: contract.totalAmount,
          totalLaunched,
          availableBalance: contract.totalAmount - totalLaunched,
          nearLimit: consumptionPercentage >= 80,
          underutilized: consumptionPercentage < 20 && elapsedPercentage > 50,
        };
      }),
    );
  }
}
