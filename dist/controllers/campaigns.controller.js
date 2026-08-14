"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTaskHandler = exports.getTasksHandler = exports.updateCampaignHandler = exports.createCampaignHandler = exports.getCampaignByIdHandler = exports.getCampaignsHandler = void 0;
const campaigns_service_1 = require("../services/campaigns.service");
const getCampaignsHandler = async (request, reply) => {
    const campaigns = await campaigns_service_1.campaignsService.getAllCampaigns(request.query.status);
    return reply.send({ success: true, data: campaigns });
};
exports.getCampaignsHandler = getCampaignsHandler;
const getCampaignByIdHandler = async (request, reply) => {
    const campaign = await campaigns_service_1.campaignsService.getCampaignById(request.params.id);
    if (!campaign) {
        return reply.status(404).send({ success: false, message: 'Campaign not found' });
    }
    return reply.send({ success: true, data: campaign });
};
exports.getCampaignByIdHandler = getCampaignByIdHandler;
const createCampaignHandler = async (request, reply) => {
    const campaign = await campaigns_service_1.campaignsService.createCampaign(request.body);
    return reply.status(201).send({ success: true, data: campaign });
};
exports.createCampaignHandler = createCampaignHandler;
const updateCampaignHandler = async (request, reply) => {
    try {
        const campaign = await campaigns_service_1.campaignsService.updateCampaign(request.params.id, request.body);
        return reply.send({ success: true, data: campaign });
    }
    catch (err) {
        return reply.status(404).send({ success: false, message: 'Campaign not found to update' });
    }
};
exports.updateCampaignHandler = updateCampaignHandler;
const getTasksHandler = async (request, reply) => {
    const tasks = await campaigns_service_1.campaignsService.getCampaignTasks(request.params.id);
    return reply.send({ success: true, data: tasks });
};
exports.getTasksHandler = getTasksHandler;
const addTaskHandler = async (request, reply) => {
    const task = await campaigns_service_1.campaignsService.addCampaignTask(request.params.id, request.body);
    return reply.status(201).send({ success: true, data: task });
};
exports.addTaskHandler = addTaskHandler;
