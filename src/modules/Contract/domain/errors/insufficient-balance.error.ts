import { AppError } from '../../../../shared/Errors/app-errors.js';

export class InsufficientBalanceError extends AppError {
  constructor() {
    super('O lançamento excede o valor total contratado.', 409);
    this.name = 'InsufficientBalanceError';
  }
}
