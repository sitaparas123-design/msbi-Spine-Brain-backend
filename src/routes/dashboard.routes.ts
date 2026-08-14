import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getDashboardSummaryHandler } from '../controllers/dashboard.controller';
import { dashboardQuerySchema } from '../validators/dashboard.schema';

export async function dashboardRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/summary',
    {
      schema: {
        querystring: dashboardQuerySchema,
      },
    },
    getDashboardSummaryHandler
  );
}
