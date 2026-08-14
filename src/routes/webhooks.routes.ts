import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { wordpressFormHandler } from '../controllers/webhooks.controller';
import { wordpressFormWebhookSchema } from '../validators/webhooks.schema';

export async function webhooksRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.post(
    '/wordpress/forms',
    {
      schema: {
        body: wordpressFormWebhookSchema,
      },
      config: {
        rateLimit: {
          max: 10, // Max 10 requests
          timeWindow: '1 minute' // per minute
        }
      }
    },
    wordpressFormHandler
  );
}
