import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { generateReportHandler, getExportsHandler } from '../controllers/reports.controller';
import { generateReportSchema } from '../validators/reports.schema';

export async function reportsRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.post(
    '/generate',
    {
      schema: {
        body: generateReportSchema,
      },
    },
    generateReportHandler
  );

  server.get('/exports', getExportsHandler);
}
