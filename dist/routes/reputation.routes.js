"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reputationRoutes = reputationRoutes;
const reputation_controller_1 = require("../controllers/reputation.controller");
const reputation_schema_1 = require("../validators/reputation.schema");
async function reputationRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/reviews', reputation_controller_1.getReviewsHandler);
    server.get('/clinics', reputation_controller_1.getClinicRatingsHandler);
    server.get('/providers', reputation_controller_1.getProviderRatingsHandler);
    server.post('/requests', {
        schema: {
            body: reputation_schema_1.createReviewRequestSchema,
        },
    }, reputation_controller_1.sendReviewRequestHandler);
}
