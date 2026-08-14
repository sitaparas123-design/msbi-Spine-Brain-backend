import { z } from 'zod';

export const createExpenseSchema = z.object({
  budgetId: z.string().uuid(),
  category: z.string(),
  amount: z.number().positive(),
  vendorId: z.string().uuid().optional(),
  date: z.string().datetime(),
  description: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
