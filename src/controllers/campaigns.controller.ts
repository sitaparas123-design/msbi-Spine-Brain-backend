import { FastifyRequest, FastifyReply } from 'fastify';
import { campaignsService } from '../services/campaigns.service';
import { CreateCampaignInput, UpdateCampaignInput, CreateTaskInput } from '../validators/campaigns.schema';

export const getCampaignsHandler = async (
  request: FastifyRequest<{ Querystring: { status?: string } }>,
  reply: FastifyReply
) => {
  const campaigns = await campaignsService.getAllCampaigns(request.query.status);
  return reply.send({ success: true, data: campaigns });
};

export const getCampaignByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const campaign = await campaignsService.getCampaignById(request.params.id);
  if (!campaign) {
    return reply.status(404).send({ success: false, message: 'Campaign not found' });
  }
  return reply.send({ success: true, data: campaign });
};

export const createCampaignHandler = async (
  request: FastifyRequest<{ Body: CreateCampaignInput }>,
  reply: FastifyReply
) => {
  const campaign = await campaignsService.createCampaign(request.body);
  return reply.status(201).send({ success: true, data: campaign });
};

export const updateCampaignHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateCampaignInput }>,
  reply: FastifyReply
) => {
  try {
    const campaign = await campaignsService.updateCampaign(request.params.id, request.body);
    return reply.send({ success: true, data: campaign });
  } catch (err) {
    return reply.status(404).send({ success: false, message: 'Campaign not found to update' });
  }
};

export const getTasksHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const tasks = await campaignsService.getCampaignTasks(request.params.id);
  return reply.send({ success: true, data: tasks });
};

export const addTaskHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: CreateTaskInput }>,
  reply: FastifyReply
) => {
  const task = await campaignsService.addCampaignTask(request.params.id, request.body);
  return reply.status(201).send({ success: true, data: task });
};
