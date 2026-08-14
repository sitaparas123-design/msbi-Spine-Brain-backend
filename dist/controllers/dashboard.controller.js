"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummaryHandler = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const getDashboardSummaryHandler = async (request, reply) => {
    try {
        const data = await dashboard_service_1.dashboardService.getSummary(request.query);
        return reply.send({ success: true, data });
    }
    catch (error) {
        return reply.status(500).send({ success: false, message: error.message });
    }
};
exports.getDashboardSummaryHandler = getDashboardSummaryHandler;
