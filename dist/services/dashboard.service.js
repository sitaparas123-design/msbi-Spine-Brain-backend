"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
const analytics_service_1 = require("./analytics.service");
class DashboardService {
    async getSummary(query) {
        let startDate;
        const endDate = new Date().toISOString();
        const now = new Date();
        if (query.timeframe === 'today') {
            now.setHours(0, 0, 0, 0);
            startDate = now.toISOString();
        }
        else if (query.timeframe === 'week') {
            now.setDate(now.getDate() - 7);
            startDate = now.toISOString();
        }
        else if (query.timeframe === 'month') {
            now.setDate(now.getDate() - 30);
            startDate = now.toISOString();
        }
        else if (query.timeframe === 'year') {
            now.setFullYear(now.getFullYear() - 1);
            startDate = now.toISOString();
        }
        const overview = await analytics_service_1.analyticsService.getOverview({ startDate, endDate });
        const timeSeries = await analytics_service_1.analyticsService.getTimeSeries({ startDate, endDate });
        // Convert unified analytics overview into dashboard summary structure
        const activeCampaigns = await db_1.default.campaign.count({
            where: { status: 'Active' }
        });
        return {
            websiteTraffic: overview.website.data?.sessions || 0,
            totalLeads: overview.leads.data.leadCount + overview.leads.data.formSubmissionCount,
            conversionRate: 0, // Should be calculated or left 0 if undefined
            activeCampaigns,
            totalSpend: overview.paidAdvertising.data.totalSpend,
            overallRating: overview.reputation.data.averageRating,
            totalReviews: overview.reputation.data.totalReviews,
            timeSeries
        };
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
