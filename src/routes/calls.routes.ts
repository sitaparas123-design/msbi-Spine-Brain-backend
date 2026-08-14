import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createCallWebhookHandler, getCallsHandler } from '../controllers/calls.controller';
import { createCallLogSchema } from '../validators/calls.schema';

export async function callsRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/', getCallsHandler);

  server.post(
    '/webhook',
    {
      schema: {
        body: createCallLogSchema,
      },
    },
    createCallWebhookHandler
  );
}
