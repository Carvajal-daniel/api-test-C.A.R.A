import { relations } from 'drizzle-orm';
import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2, mode: 'number' }).notNull(),
  startDate: timestamp('start_date', { withTimezone: true, mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true, mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  contractId: uuid('contract_id')
    .notNull()
    .references(() => contracts.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 12, scale: 2, mode: 'number' }).notNull(),
  description: text('description').notNull(),
  date: timestamp('date', { withTimezone: true, mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const contractRelations = relations(contracts, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionRelations = relations(transactions, ({ one }) => ({
  contract: one(contracts, {
    fields: [transactions.contractId],
    references: [contracts.id],
  }),
}));
