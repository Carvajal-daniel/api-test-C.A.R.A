import { AppError } from '../../../../shared/Errors/app-errors.js';

export class TransactionNotFoundError extends AppError {
  constructor() {
    super('Lançamento não encontrado.', 404);
    this.name = 'TransactionNotFoundError';
  }
}
