"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLeadSchema = void 0;
const zod_1 = require("zod");
exports.createLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address').optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().optional().or(zod_1.z.literal('')),
    condition: zod_1.z.string().optional().or(zod_1.z.literal('')),
    source: zod_1.z.string().optional(),
});
