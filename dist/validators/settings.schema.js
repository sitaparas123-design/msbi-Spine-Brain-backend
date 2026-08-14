"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrganizationSchema = void 0;
const zod_1 = require("zod");
exports.updateOrganizationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    timezone: zod_1.z.string().optional(),
    currency: zod_1.z.string().optional(),
});
