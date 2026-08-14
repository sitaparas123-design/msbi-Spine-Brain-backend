import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { 
  getBudgetOverviewHandler, 
  createExpenseHandler,
  getPlannedVsActualHandler,
  getVendorSpendingHandler
} from '../controllers/budget.controller';
import { createExpenseSchema } from '../validators/budget.schema';

export async function budgetRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/overview', getBudgetOverviewHandler);
  server.get('/planned-vs-actual', getPlannedVsActualHandler);
  server.get('/vendor-spending', getVendorSpendingHandler);

  server.post(
    '/expenses',
    {
      schema: {
        body: createExpenseSchema,
      },
    },
    createExpenseHandler
  );
}
