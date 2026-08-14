"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeSeriesHandler = exports.getEmailMarketingAnalyticsHandler = exports.getAttributionHandler = exports.getCampaignsPerformanceHandler = exports.getRoiAnalyticsHandler = exports.getCallsAnalyticsHandler = exports.getLeadsAnalyticsHandler = exports.getWebsiteAnalyticsHandler = exports.getAnalyticsOverviewHandler = void 0;
const analytics_service_1 = require("../services/analytics.service");
const getAnalyticsOverviewHandler = async (request, reply) => {
    const data = await analytics_service_1.analyticsService.getOverview(request.query);
    return reply.send({ success: true, data });
};
exports.getAnalyticsOverviewHandler = getAnalyticsOverviewHandler;
const getWebsiteAnalyticsHandler = async (request, reply) => {
    const data = await analytics_service_1.analyticsService.getWebsiteAnalytics(request.query);
    return reply.send({ success: true, data });
};
exports.getWebsiteAnalyticsHandler = getWebsiteAnalyticsHandler;
const getLeadsAnalyticsHandler = async (request, reply) => {
    const data = await analytics_service_1.analyticsService.getLeadsAnalytics(request.query);
    return reply.send({ success: true, data });
};
exports.getLeadsAnalyticsHandler = getLeadsAnalyticsHandler;
const getCallsAnalyticsHandler = async (request, reply) => {
    const data = await analytics_service_1.analyticsService.getCallsAnalytics(request.query);
    return reply.send({ success: true, data });
};
exports.getCallsAnalyticsHandler = getCallsAnalyticsHandler;
const getRoiAnalyticsHandler = async (request, reply) => {
    const data = await analytics_service_1.analyticsService.getRoiAnalytics(request.query);
    return reply.send({ success: true, data });
};
exports.getRoiAnalyticsHandler = getRoiAnalyticsHandler;
const getCampaignsPerformanceHandler = async (request, reply) => {
    const data = await analytics_service_1.analyticsService.getCampaignsPerformance(request.query);
    return reply.send({ success: true, data });
};
exports.getCampaignsPerformanceHandler = getCampaignsPerformanceHandler;
const getAttributionHandler = async (request, reply) => {
    const data = await analytics_service_1.analyticsService.getAttribution(request.query);
    return reply.send({ success: true, data });
};
exports.getAttributionHandler = getAttributionHandler;
const getEmailMarketingAnalyticsHandler = async (request, reply) => {
    const result = await analytics_service_1.analyticsService.getEmailMarketing(request.query);
    return reply.send({ success: true, ...result });
};
exports.getEmailMarketingAnalyticsHandler = getEmailMarketingAnalyticsHandler;
const getTimeSeriesHandler = async (request, reply) => {
    const data = await analytics_service_1.analyticsService.getTimeSeries(request.query);
    return reply.send({ success: true, data });
};
exports.getTimeSeriesHandler = getTimeSeriesHandler;
