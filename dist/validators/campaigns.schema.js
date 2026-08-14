"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskSchema = exports.updateCampaignSchema = exports.createCampaignSchema = void 0;
const zod_1 = require("zod");
exports.createCampaignSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    status: zod_1.z.enum(['Active', 'Completed', 'Draft']),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime().optional(),
    budget: zod_1.z.number().positive(),
    goal: zod_1.z.string().optional(),
    ownerId: zod_1.z.string().uuid(),
});
exports.updateCampaignSchema = zod_1.z.object({
    status: zod_1.z.enum(['Active', 'Completed', 'Draft']).optional(),
    budget: zod_1.z.number().positive().optional(),
});
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    status: zod_1.z.enum(['Pending', 'In Progress', 'Completed']),
    dueDate: zod_1.z.string().datetime().optional(),
    assignedTo: zod_1.z.string().uuid().optional(),
});
