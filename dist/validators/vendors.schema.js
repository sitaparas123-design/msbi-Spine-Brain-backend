"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendorSchema = void 0;
const zod_1 = require("zod");
exports.createVendorSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    category: zod_1.z.string(),
    performanceScore: zod_1.z.number().min(0).max(10).optional(),
});
