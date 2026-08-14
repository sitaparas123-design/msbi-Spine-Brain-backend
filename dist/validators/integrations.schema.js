"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncIntegrationSchema = void 0;
const zod_1 = require("zod");
exports.syncIntegrationSchema = zod_1.z.object({
    platformName: zod_1.z.enum(['GA4', 'GOOGLE_ADS', 'META_ADS', 'HUBSPOT']),
});
