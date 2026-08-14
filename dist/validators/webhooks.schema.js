"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordpressFormWebhookSchema = void 0;
const zod_1 = require("zod");
exports.wordpressFormWebhookSchema = zod_1.z.object({
    formId: zod_1.z.string().optional(),
    formName: zod_1.z.string().optional(),
    submissionId: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().optional(),
    message: zod_1.z.string().optional(),
    subject: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    service: zod_1.z.string().optional(),
    sourceUrl: zod_1.z.string().optional(),
    landingPage: zod_1.z.string().optional(),
    utm_source: zod_1.z.string().optional(),
    utm_medium: zod_1.z.string().optional(),
    utm_campaign: zod_1.z.string().optional(),
    utm_term: zod_1.z.string().optional(),
    utm_content: zod_1.z.string().optional(),
    gclid: zod_1.z.string().optional(),
    fbclid: zod_1.z.string().optional(),
    metadata: zod_1.z.object({
        hadMRI: zod_1.z.enum(['Yes', 'No']).nullable().optional(),
        preferredContactMethod: zod_1.z.union([
            zod_1.z.array(zod_1.z.enum(['Phone', 'Email'])),
            zod_1.z.enum(['Phone', 'Email'])
        ]).optional(),
        howDidYouHearAboutUs: zod_1.z.string().max(1000).optional(),
    }).strict().optional(),
    submittedAt: zod_1.z.string().optional()
}).catchall(zod_1.z.any());
