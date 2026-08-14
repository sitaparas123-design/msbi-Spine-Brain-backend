"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCallLogSchema = void 0;
const zod_1 = require("zod");
exports.createCallLogSchema = zod_1.z.object({
    caller: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(1, 'Phone is required'),
    duration: zod_1.z.string().min(1, 'Duration is required'),
    campaign: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    audioUrl: zod_1.z.string().optional(),
});
