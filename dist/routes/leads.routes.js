"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRoutes = leadsRoutes;
const leads_controller_1 = require("../controllers/leads.controller");
const leads_schema_1 = require("../validators/leads.schema");
async function leadsRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/', leads_controller_1.getLeadsHandler);
    server.post('/webhook', {
        schema: {
            body: leads_schema_1.createLeadSchema,
        },
    }, leads_controller_1.createLeadWebhookHandler);
}
