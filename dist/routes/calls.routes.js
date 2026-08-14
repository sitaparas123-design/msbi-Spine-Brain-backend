"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callsRoutes = callsRoutes;
const calls_controller_1 = require("../controllers/calls.controller");
const calls_schema_1 = require("../validators/calls.schema");
async function callsRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/', calls_controller_1.getCallsHandler);
    server.post('/webhook', {
        schema: {
            body: calls_schema_1.createCallLogSchema,
        },
    }, calls_controller_1.createCallWebhookHandler);
}
