import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { 
  getReviewsHandler, 
  sendReviewRequestHandler,
  getClinicRatingsHandler,
  getProviderRatingsHandler,
  createReviewHandler
} from '../controllers/reputation.controller';
import { createReviewRequestSchema, createReviewSchema } from '../validators/reputation.schema';

export async function reputationRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/reviews', getReviewsHandler);
  server.get('/clinics', getClinicRatingsHandler);
  server.get('/providers', getProviderRatingsHandler);

  server.post(
    '/requests',
    {
      schema: {
        body: createReviewRequestSchema,
      },
    },
    sendReviewRequestHandler
  );

  server.post(
    '/reviews',
    {
      schema: {
        body: createReviewSchema,
      },
    },
    createReviewHandler
  );
}
