import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { 
  getReviewsHandler, 
  sendReviewRequestHandler,
  getClinicRatingsHandler,
  getProviderRatingsHandler,
  createReviewHandler,
  getGbpAccountsHandler,
  getGbpLocationsHandler,
  getMappingsHandler,
  saveMappingsHandler,
  replyToReviewHandler,
  syncGbpReviewsHandler
} from '../controllers/reputation.controller';
import { createReviewRequestSchema, createReviewSchema } from '../validators/reputation.schema';

export async function reputationRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/reviews', getReviewsHandler);
  server.get('/clinics', getClinicRatingsHandler);
  server.get('/providers', getProviderRatingsHandler);

  server.get('/gbp/accounts', getGbpAccountsHandler);
  server.get('/gbp/locations', getGbpLocationsHandler);
  server.get('/mappings', getMappingsHandler);
  server.post('/mappings', saveMappingsHandler);
  server.post('/reviews/:id/reply', replyToReviewHandler);
  server.post('/sync', syncGbpReviewsHandler);

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
