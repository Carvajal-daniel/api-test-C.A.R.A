import { randomUUID } from 'node:crypto';
import { ContractEntity } from '../domain/entities/contract.entity.js';
import type { ContractsRepository } from '../domain/repository/contracts.repository.interface.js';
import { Amount } from '../domain/value-objects/amount.vo.js';
import type { CreateContractDTO } from './contract-dto.js';

export class CreateContractUseCase {
  constructor(private readonly contractsRepository: ContractsRepository) {}

  async execute(data: CreateContractDTO): Promise<ContractEntity> {
    const now = new Date();
    const contract = ContractEntity.create({
      id: randomUUID(),
      name: data.name,
      totalAmount: Amount.create(data.totalAmount),
      startDate: data.startDate,
      createdAt: now,
      updatedAt: now,
    });

    await this.contractsRepository.save(contract);
    return contract;
  }
}
