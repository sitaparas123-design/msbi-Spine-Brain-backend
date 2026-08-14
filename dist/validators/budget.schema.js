"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpenseSchema = void 0;
const zod_1 = require("zod");
exports.createExpenseSchema = zod_1.z.object({
    budgetId: zod_1.z.string().uuid(),
    category: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    vendorId: zod_1.z.string().uuid().optional(),
    date: zod_1.z.string().datetime(),
    description: zod_1.z.string().optional(),
});
