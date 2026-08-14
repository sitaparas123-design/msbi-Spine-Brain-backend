import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  logger.error(error);

  if (error.validation) {
    return reply.status(400).send({
      success: false,
      message: 'Validation Error',
      errors: error.validation,
    });
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : error.message;

  reply.status(statusCode).send({
    success: false,
    message,
  });
};
