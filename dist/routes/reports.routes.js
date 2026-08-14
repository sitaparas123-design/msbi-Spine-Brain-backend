"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsRoutes = reportsRoutes;
const reports_controller_1 = require("../controllers/reports.controller");
const reports_schema_1 = require("../validators/reports.schema");
async function reportsRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.post('/generate', {
        schema: {
            body: reports_schema_1.generateReportSchema,
        },
    }, reports_controller_1.generateReportHandler);
    server.get('/exports', reports_controller_1.getExportsHandler);
}
