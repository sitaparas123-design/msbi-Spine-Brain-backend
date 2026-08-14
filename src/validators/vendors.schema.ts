import { z } from 'zod';

export const createVendorSchema = z.object({
  name: z.string().min(2),
  category: z.string(),
  performanceScore: z.number().min(0).max(10).optional(),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
