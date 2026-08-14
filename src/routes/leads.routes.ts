import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createLeadWebhookHandler, getLeadsHandler } from '../controllers/leads.controller';
import { createLeadSchema } from '../validators/leads.schema';

export async function leadsRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/', getLeadsHandler);

  server.post(
    '/webhook',
    {
      schema: {
        body: createLeadSchema,
      },
    },
    createLeadWebhookHandler
  );
}
