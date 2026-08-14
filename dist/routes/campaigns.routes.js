"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignRoutes = campaignRoutes;
const zod_1 = require("zod");
const campaigns_controller_1 = require("../controllers/campaigns.controller");
const campaigns_schema_1 = require("../validators/campaigns.schema");
async function campaignRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/', {
        schema: { querystring: zod_1.z.object({ status: zod_1.z.string().optional() }) }
    }, campaigns_controller_1.getCampaignsHandler);
    server.get('/:id', { schema: { params: zod_1.z.object({ id: zod_1.z.string().uuid() }) } }, campaigns_controller_1.getCampaignByIdHandler);
    server.post('/', { schema: { body: campaigns_schema_1.createCampaignSchema } }, campaigns_controller_1.createCampaignHandler);
    server.put('/:id', {
        schema: { params: zod_1.z.object({ id: zod_1.z.string().uuid() }), body: campaigns_schema_1.updateCampaignSchema }
    }, campaigns_controller_1.updateCampaignHandler);
    server.get('/:id/tasks', { schema: { params: zod_1.z.object({ id: zod_1.z.string().uuid() }) } }, campaigns_controller_1.getTasksHandler);
    server.post('/:id/tasks', {
        schema: { params: zod_1.z.object({ id: zod_1.z.string().uuid() }), body: campaigns_schema_1.createTaskSchema }
    }, campaigns_controller_1.addTaskHandler);
}
