"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = dashboardRoutes;
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const dashboard_schema_1 = require("../validators/dashboard.schema");
async function dashboardRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/summary', {
        schema: {
            querystring: dashboard_schema_1.dashboardQuerySchema,
        },
    }, dashboard_controller_1.getDashboardSummaryHandler);
}
