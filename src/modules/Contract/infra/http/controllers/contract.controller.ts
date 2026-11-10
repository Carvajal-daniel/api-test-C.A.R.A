import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createContractSchema,
  createTransactionSchema,
  transactionIdSchema,
} from '../../../usecases/contract-dto.js';
import type { CreateContractUseCase } from '../../../usecases/create-contract.usecase.js';
import type { CreateTransactionUseCase } from '../../../usecases/create-transaction.usecase.js';
import type { DeleteTransactionUseCase } from '../../../usecases/delete-transaction.usecase.js';
import type { GetDashboardUseCase } from '../../../usecases/get-dashboard.usecase.js';

interface TransactionParams {
  id: string;
}

export class ContractController {
  constructor(
    private readonly createContractUseCase: CreateContractUseCase,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
    private readonly getDashboardUseCase: GetDashboardUseCase,
  ) {}

  async createContract(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = createContractSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({ message: 'Dados inválidos.', issues: parsed.error.issues });
    }

    const contract = await this.createContractUseCase.execute(parsed.data);
    return reply.code(201).send({
      id: contract.id,
      name: contract.name,
      totalAmount: contract.totalAmount,
      startDate: contract.startDate,
      endDate: contract.endDate,
    });
  }

  async createTransaction(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const parsed = createTransactionSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ message: 'Dados inválidos.', issues: parsed.error.issues });
    }

    const transaction = await this.createTransactionUseCase.execute(parsed.data);
    return reply.code(201).send({
      id: transaction.id,
      contractId: transaction.contractId,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
    });
  }

  async deleteTransaction( request: FastifyRequest<{ Params: TransactionParams }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> {
    const parsed = transactionIdSchema.safeParse(request.params.id);
    if (!parsed.success) {
      return reply.code(400).send({ message: 'ID de lançamento inválido.', issues: parsed.error.issues });
    }

    await this.deleteTransactionUseCase.execute(parsed.data);
    return reply.code(204).send();
  }

  async getDashboard(_request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const dashboard = await this.getDashboardUseCase.execute();
    return reply.code(200).send(dashboard);
  }
}
