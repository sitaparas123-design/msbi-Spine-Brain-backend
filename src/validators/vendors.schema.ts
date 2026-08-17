import { z } from 'zod';

export const createVendorSchema = z.object({
  name: z.string().min(2),
  category: z.string(),
  performanceScore: z.number().min(0).max(10).optional(),
});

export const createContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
});

export const createContractSchema = z.object({
  value: z.number().positive(),
  startDate: z.string(), // ISO String
  renewalDate: z.string(), // ISO String
  documentUrl: z.string().url().nullable().optional(),
});

export const createInvoiceSchema = z.object({
  amount: z.number().positive(),
  status: z.enum(['Paid', 'Pending', 'Overdue']),
  dueDate: z.string(), // ISO String
  documentUrl: z.string().url().nullable().optional(),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(['Paid', 'Pending', 'Overdue']),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type CreateContractInput = z.infer<typeof createContractSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceStatusInput = z.infer<typeof updateInvoiceStatusSchema>;
