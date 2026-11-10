import {
  ContractRepositoryImpl,
  TransactionRepositoryImpl,
} from '../../database/repositories/contract-repository.impl.js';
import { ContractController } from '../controllers/contract.controller.js';
import { CreateContractUseCase } from '../../../usecases/create-contract.usecase.js';
import { CreateTransactionUseCase } from '../../../usecases/create-transaction.usecase.js';
import { DeleteTransactionUseCase } from '../../../usecases/delete-transaction.usecase.js';
import { GetDashboardUseCase } from '../../../usecases/get-dashboard.usecase.js';

export function makeContractControllers(): ContractController {
  const contractsRepository = new ContractRepositoryImpl();
  const transactionsRepository = new TransactionRepositoryImpl();

  return new ContractController(
    new CreateContractUseCase(contractsRepository),
    new CreateTransactionUseCase(contractsRepository, transactionsRepository),
    new DeleteTransactionUseCase(transactionsRepository),
    new GetDashboardUseCase(contractsRepository, transactionsRepository),
  );
}
