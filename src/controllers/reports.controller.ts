import { FastifyRequest, FastifyReply } from 'fastify';
import { reportsService } from '../services/reports.service';
import { GenerateReportInput } from '../validators/reports.schema';

export const generateReportHandler = async (
  request: FastifyRequest<{ Body: GenerateReportInput }>,
  reply: FastifyReply
) => {
  const result = await reportsService.triggerReportGeneration(request.body);
  return reply.status(202).send({ success: true, data: result }); // 202 Accepted
};

export const getExportsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const exportsList = await reportsService.getExports();
  return reply.send({ success: true, data: exportsList });
};
