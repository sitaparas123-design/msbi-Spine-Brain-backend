"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResponseSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    role: zod_1.z.string().optional().default('USER'),
    departmentId: zod_1.z.string().uuid().optional(),
});
exports.userResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    role: zod_1.z.string(),
    isActive: zod_1.z.boolean(),
    createdAt: zod_1.z.date(),
});
