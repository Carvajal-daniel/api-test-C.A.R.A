import { z } from 'zod';

export const createContractSchema = z.object({
  name: z.string().trim().min(2).max(100),
  totalAmount: z.number().positive(),
  startDate: z.coerce.date(),
});

export const createTransactionSchema = z.object({
  contractId: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string().trim().min(1).max(500),
  date: z.coerce.date(),
});

export const transactionIdSchema = z.string().uuid();

export type CreateContractDTO = z.infer<typeof createContractSchema>;
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
