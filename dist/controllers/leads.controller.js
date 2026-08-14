"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadsHandler = exports.createLeadWebhookHandler = void 0;
const leads_service_1 = require("../services/leads.service");
const createLeadWebhookHandler = async (request, reply) => {
    const lead = await leads_service_1.leadsService.createLead(request.body);
    return reply.send({ success: true, data: lead });
};
exports.createLeadWebhookHandler = createLeadWebhookHandler;
const getLeadsHandler = async (request, reply) => {
    const leads = await leads_service_1.leadsService.getLeads();
    return reply.send({ success: true, data: leads });
};
exports.getLeadsHandler = getLeadsHandler;
