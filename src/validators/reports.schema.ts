import { z } from 'zod';

export const generateReportSchema = z.object({
  type: z.enum(['EXECUTIVE', 'MARKETING', 'BUDGET']),
  format: z.enum(['PDF', 'EXCEL']),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
});

export type GenerateReportInput = z.infer<typeof generateReportSchema>;
