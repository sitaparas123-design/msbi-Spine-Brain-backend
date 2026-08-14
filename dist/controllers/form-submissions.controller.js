"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormSubmissionByIdHandler = exports.getFormSubmissionsHandler = void 0;
const db_1 = __importDefault(require("../plugins/db"));
const zod_1 = require("zod");
const querySchema = zod_1.z.object({
    formName: zod_1.z.string().optional(),
    campaign: zod_1.z.string().optional(),
    source: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional()
});
const getFormSubmissionsHandler = async (request, reply) => {
    const query = querySchema.parse(request.query);
    const where = {};
    if (query.formName)
        where.formName = query.formName;
    if (query.campaign)
        where.utmCampaign = query.campaign;
    if (query.source)
        where.utmSource = query.source;
    if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate)
            where.createdAt.gte = new Date(query.startDate);
        if (query.endDate)
            where.createdAt.lte = new Date(query.endDate);
    }
    const submissions = await db_1.default.formSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: {
            lead: {
                select: { id: true, status: true }
            }
        }
    });
    // Ensure we don't return raw sensitive bodies to generic analytics API consumers
    // The frontend requested "safe summary fields" for MarketingAnalytics
    const safeData = submissions.map(sub => ({
        id: sub.id,
        externalSubmissionId: sub.externalSubmissionId,
        leadId: sub.leadId,
        formName: sub.formName,
        name: sub.name,
        email: sub.email,
        phone: sub.phone,
        landingPage: sub.landingPage,
        sourceUrl: sub.sourceUrl,
        utmSource: sub.utmSource,
        utmMedium: sub.utmMedium,
        submittedAt: sub.submittedAt,
        createdAt: sub.createdAt,
        status: sub.lead?.status || 'Unknown'
    }));
    return reply.send({ success: true, data: safeData });
};
exports.getFormSubmissionsHandler = getFormSubmissionsHandler;
const getFormSubmissionByIdHandler = async (request, reply) => {
    const { id } = request.params;
    const submission = await db_1.default.formSubmission.findUnique({
        where: { id },
        include: {
            lead: true
        }
    });
    if (!submission) {
        return reply.status(404).send({ success: false, error: 'Not found' });
    }
    return reply.send({ success: true, data: submission });
};
exports.getFormSubmissionByIdHandler = getFormSubmissionByIdHandler;
