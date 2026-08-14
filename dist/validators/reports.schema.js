"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportSchema = void 0;
const zod_1 = require("zod");
exports.generateReportSchema = zod_1.z.object({
    type: zod_1.z.enum(['EXECUTIVE', 'MARKETING', 'BUDGET']),
    format: zod_1.z.enum(['PDF', 'EXCEL']),
    dateRange: zod_1.z.object({
        start: zod_1.z.string().datetime(),
        end: zod_1.z.string().datetime(),
    }),
});
