"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRoutes = analyticsRoutes;
const analytics_controller_1 = require("../controllers/analytics.controller");
const analytics_schema_1 = require("../validators/analytics.schema");
async function analyticsRoutes(fastify) {
    const server = fastify.withTypeProvider();
    const schema = { querystring: analytics_schema_1.analyticsQuerySchema };
    server.get('/overview', { schema }, analytics_controller_1.getAnalyticsOverviewHandler);
    server.get('/website', { schema }, analytics_controller_1.getWebsiteAnalyticsHandler);
    server.get('/leads', { schema }, analytics_controller_1.getLeadsAnalyticsHandler);
    server.get('/calls', { schema }, analytics_controller_1.getCallsAnalyticsHandler);
    server.get('/roi', { schema }, analytics_controller_1.getRoiAnalyticsHandler);
    server.get('/campaigns-performance', { schema }, analytics_controller_1.getCampaignsPerformanceHandler);
    server.get('/attribution', { schema }, analytics_controller_1.getAttributionHandler);
    server.get('/email-marketing', { schema }, analytics_controller_1.getEmailMarketingAnalyticsHandler);
    server.get('/time-series', { schema }, analytics_controller_1.getTimeSeriesHandler);
}
