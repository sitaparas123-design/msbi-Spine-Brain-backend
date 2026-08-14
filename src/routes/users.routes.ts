import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { 
  getUsersHandler, 
  createUserHandler,
  getRolesHandler,
  getActivityLogsHandler 
} from '../controllers/users.controller';
import { createUserSchema } from '../validators/users.schema';

export async function userRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/', getUsersHandler);
  
  server.post(
    '/',
    {
      schema: { body: createUserSchema },
    },
    createUserHandler
  );

  server.get('/roles', getRolesHandler);
  server.get('/activity-logs', getActivityLogsHandler);
}
