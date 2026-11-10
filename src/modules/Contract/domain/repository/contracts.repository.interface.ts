import type { ContractEntity } from '../entities/contract.entity.js';

export interface ContractsRepository {
  save(contract: ContractEntity): Promise<void>;
  findById(id: string): Promise<ContractEntity | null>;
  findAll(): Promise<ContractEntity[]>;
}
