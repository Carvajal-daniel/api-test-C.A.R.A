import type { FastifyInstance } from 'fastify';
import { makeContractControllers } from '../factories/make-contract-controllers.js';

export async function ContractRoutes(app: FastifyInstance): Promise<void> {
  
  const controller = makeContractControllers();

  app.post('/contracts', controller.createContract.bind(controller));
  app.post('/transactions', controller.createTransaction.bind(controller));
  app.delete('/transactions/:id', controller.deleteTransaction.bind(controller));
  app.get('/contracts/dashboard', controller.getDashboard.bind(controller));
}
