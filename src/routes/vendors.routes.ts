import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { 
  getVendorsHandler, 
  getVendorByIdHandler, 
  createVendorHandler,
  getRenewalsHandler,
  getContractsHandler,
  getInvoicesHandler
} from '../controllers/vendors.controller';
import { createVendorSchema } from '../validators/vendors.schema';
import { z } from 'zod';

export async function vendorRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();

  server.get('/', getVendorsHandler);
  server.get('/renewals', getRenewalsHandler);
  
  server.get('/:id', { schema: { params: z.object({ id: z.string().uuid() }) } }, getVendorByIdHandler);
  
  server.post('/', { schema: { body: createVendorSchema } }, createVendorHandler);

  server.get('/:id/contracts', { schema: { params: z.object({ id: z.string().uuid() }) } }, getContractsHandler);
  server.get('/:id/invoices', { schema: { params: z.object({ id: z.string().uuid() }) } }, getInvoicesHandler);
}
