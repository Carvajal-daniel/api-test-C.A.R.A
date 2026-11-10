import { AppError } from '../../../../shared/Errors/app-errors.js';

export class ContractNotFoundError extends AppError {
  constructor() {
    super('Contrato não encontrado.', 404);
    this.name = 'ContractNotFoundError';
  }
}
