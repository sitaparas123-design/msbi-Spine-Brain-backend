"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhooksRoutes = webhooksRoutes;
const webhooks_controller_1 = require("../controllers/webhooks.controller");
const webhooks_schema_1 = require("../validators/webhooks.schema");
async function webhooksRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.post('/wordpress/forms', {
        schema: {
            body: webhooks_schema_1.wordpressFormWebhookSchema,
        },
        config: {
            rateLimit: {
                max: 10, // Max 10 requests
                timeWindow: '1 minute' // per minute
            }
        }
    }, webhooks_controller_1.wordpressFormHandler);
}
