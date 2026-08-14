import { FastifyInstance } from 'fastify';
import { getFormSubmissionsHandler, getFormSubmissionByIdHandler } from '../controllers/form-submissions.controller';

export async function formSubmissionsRoutes(fastify: FastifyInstance) {
  // Use requireAuth to protect these endpoints via RBAC once auth is fully implemented

  fastify.get('', getFormSubmissionsHandler);
  fastify.get('/:id', getFormSubmissionByIdHandler);
}
