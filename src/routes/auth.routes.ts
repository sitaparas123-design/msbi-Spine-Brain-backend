import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { loginHandler, getCurrentUserHandler } from '../controllers/auth.controller';
import { loginSchema } from '../validators/auth.schema';

export async function authRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.post(
    '/login',
    {
      schema: {
        body: loginSchema,
      },
    },
    loginHandler
  );

  server.get('/me', getCurrentUserHandler);
}
