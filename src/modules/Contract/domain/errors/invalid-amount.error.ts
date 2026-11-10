import { AppError } from '../../../../shared/Errors/app-errors.js';

export class InvalidAmountError extends AppError {
  constructor() {
    super('O valor deve ser maior que zero.', 400);
    this.name = 'InvalidAmountError';
  }
}
