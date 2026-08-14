import { FastifyRequest, FastifyReply } from 'fastify';
import { vendorsService } from '../services/vendors.service';
import { CreateVendorInput } from '../validators/vendors.schema';

export const getVendorsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const vendors = await vendorsService.getAllVendors();
  return reply.send({ success: true, data: vendors });
};

export const getVendorByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const vendor = await vendorsService.getVendorById(request.params.id);
  if (!vendor) {
    return reply.status(404).send({ success: false, message: 'Vendor not found' });
  }
  return reply.send({ success: true, data: vendor });
};

export const createVendorHandler = async (
  request: FastifyRequest<{ Body: CreateVendorInput }>,
  reply: FastifyReply
) => {
  const vendor = await vendorsService.createVendor(request.body);
  return reply.status(201).send({ success: true, data: vendor });
};

export const getRenewalsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const renewals = await vendorsService.getUpcomingRenewals();
  return reply.send({ success: true, data: renewals });
};

export const getContractsHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const contracts = await vendorsService.getVendorContracts(request.params.id);
  return reply.send({ success: true, data: contracts });
};

export const getInvoicesHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const invoices = await vendorsService.getVendorInvoices(request.params.id);
  return reply.send({ success: true, data: invoices });
};
