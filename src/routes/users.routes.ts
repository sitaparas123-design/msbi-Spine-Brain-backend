import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { 
  getUsersHandler, 
  createUserHandler,
  getRolesHandler,
  getActivityLogsHandler,
  updateNotificationPreferencesHandler
} from '../controllers/users.controller';
import { createUserSchema } from '../validators/users.schema';
import { z } from 'zod';

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

  server.put('/:id/notifications', {
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({
        phoneNumber: z.string().optional().nullable(),
        emailAlerts: z.boolean(),
        smsAlerts: z.boolean(),
        alertLocations: z.array(z.string()).optional().nullable()
      })
    }
  }, updateNotificationPreferencesHandler);

  server.get('/roles', getRolesHandler);
  server.get('/activity-logs', getActivityLogsHandler);
}
