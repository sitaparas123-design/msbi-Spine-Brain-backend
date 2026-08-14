import { z } from 'zod';

export const createReviewRequestSchema = z.object({
  patientName: z.string().min(2),
  contactInfo: z.string().min(5),
});

export type CreateReviewRequestInput = z.infer<typeof createReviewRequestSchema>;
