"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardQuerySchema = void 0;
const zod_1 = require("zod");
exports.dashboardQuerySchema = zod_1.z.object({
    timeframe: zod_1.z.enum(['today', 'week', 'month', 'year']).optional().default('month'),
});
