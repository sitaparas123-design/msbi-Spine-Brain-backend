"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsQuerySchema = void 0;
const zod_1 = require("zod");
exports.analyticsQuerySchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
