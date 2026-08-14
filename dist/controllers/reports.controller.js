"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExportsHandler = exports.generateReportHandler = void 0;
const reports_service_1 = require("../services/reports.service");
const generateReportHandler = async (request, reply) => {
    const result = await reports_service_1.reportsService.triggerReportGeneration(request.body);
    return reply.status(202).send({ success: true, data: result }); // 202 Accepted
};
exports.generateReportHandler = generateReportHandler;
const getExportsHandler = async (request, reply) => {
    const exportsList = await reports_service_1.reportsService.getExports();
    return reply.send({ success: true, data: exportsList });
};
exports.getExportsHandler = getExportsHandler;
