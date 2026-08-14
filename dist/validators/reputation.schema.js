"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewRequestSchema = void 0;
const zod_1 = require("zod");
exports.createReviewRequestSchema = zod_1.z.object({
    patientName: zod_1.z.string().min(2),
    contactInfo: zod_1.z.string().min(5),
});
