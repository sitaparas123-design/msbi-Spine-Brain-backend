"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignsService = exports.CampaignsService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
class CampaignsService {
    async getAllCampaigns(statusFilter) {
        const whereClause = statusFilter ? { status: statusFilter } : {};
        const campaigns = await db_1.default.campaign.findMany({
            where: whereClause,
            include: {
                owner: { select: { firstName: true, lastName: true } },
                metrics: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return campaigns.map(c => {
            let aggregatedSpend = Number(c.spend);
            let aggregatedRevenue = Number(c.revenue);
            let totalConversions = 0;
            if (c.metrics && c.metrics.length > 0) {
                // Aggregate only if it's an external campaign, or just sum it up
                const totalMetricSpend = c.metrics.reduce((acc, m) => acc + Number(m.spend), 0);
                const totalMetricRevenue = c.metrics.reduce((acc, m) => acc + Number(m.conversionValue || 0), 0);
                const totalMetricConversions = c.metrics.reduce((acc, m) => acc + Number(m.conversions || 0), 0);
                aggregatedSpend += totalMetricSpend;
                aggregatedRevenue += totalMetricRevenue;
                totalConversions += totalMetricConversions;
            }
            let roi = null;
            if (aggregatedSpend > 0 && aggregatedRevenue > 0) {
                roi = ((aggregatedRevenue - aggregatedSpend) / aggregatedSpend) * 100;
            }
            return {
                ...c,
                spend: aggregatedSpend,
                revenue: aggregatedRevenue,
                leadsGenerated: totalConversions,
                roi: roi ? roi.toFixed(2) : null,
            };
        });
    }
    async createCampaign(data) {
        return db_1.default.campaign.create({
            data: {
                name: data.name,
                status: data.status,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                budget: data.budget,
                goal: data.goal,
                ownerId: data.ownerId,
            },
        });
    }
    async getCampaignById(id) {
        return db_1.default.campaign.findUnique({
            where: { id },
            include: { tasks: true, assets: true },
        });
    }
    async updateCampaign(id, data) {
        return db_1.default.campaign.update({
            where: { id },
            data,
        });
    }
    async getCampaignTasks(campaignId) {
        return db_1.default.campaignTask.findMany({
            where: { campaignId },
            orderBy: { dueDate: 'asc' }
        });
    }
    async addCampaignTask(campaignId, data) {
        return db_1.default.campaignTask.create({
            data: {
                campaignId,
                title: data.title,
                status: data.status,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                assignedTo: data.assignedTo,
            }
        });
    }
    async upsertExternalCampaigns(campaigns, metrics) {
        // We assume the caller (integrations controller) passes the array of external campaigns
        // and the array of metrics. We need to find or create the campaign locally and insert metrics.
        // Fallback owner if we don't know who owns the system integrations (get first admin)
        let adminUser = await db_1.default.user.findFirst({ where: { roleName: 'Admin' } });
        if (!adminUser) {
            adminUser = await db_1.default.user.findFirst();
        }
        const fallbackOwnerId = adminUser?.id || '';
        for (const c of campaigns) {
            const existing = await db_1.default.campaign.findFirst({
                where: { platform: c.platform, externalCampaignId: c.externalId }
            });
            let localCampaignId = existing?.id;
            if (!existing && fallbackOwnerId) {
                const created = await db_1.default.campaign.create({
                    data: {
                        name: c.name,
                        status: c.status,
                        startDate: c.startDate ? new Date(c.startDate) : new Date(),
                        endDate: c.endDate ? new Date(c.endDate) : null,
                        budget: 0,
                        spend: 0,
                        revenue: 0,
                        ownerId: fallbackOwnerId,
                        platform: c.platform,
                        externalCampaignId: c.externalId,
                        lastSyncedAt: new Date()
                    }
                });
                localCampaignId = created.id;
            }
            else if (existing) {
                await db_1.default.campaign.update({
                    where: { id: existing.id },
                    data: {
                        name: c.name,
                        status: c.status,
                        endDate: c.endDate ? new Date(c.endDate) : null,
                        lastSyncedAt: new Date()
                    }
                });
            }
            // Now upsert metrics for this specific campaign
            if (localCampaignId) {
                const campaignMetrics = metrics.filter(m => m.externalId === c.externalId);
                for (const m of campaignMetrics) {
                    const mDate = new Date(m.date);
                    await db_1.default.campaignMetricSnapshot.upsert({
                        where: {
                            campaignId_date: {
                                campaignId: localCampaignId,
                                date: mDate
                            }
                        },
                        update: {
                            impressions: m.impressions,
                            clicks: m.clicks,
                            spend: m.spend,
                            conversions: m.conversions,
                            conversionValue: m.conversionValue,
                            currencyCode: m.currencyCode
                        },
                        create: {
                            campaignId: localCampaignId,
                            date: mDate,
                            impressions: m.impressions,
                            clicks: m.clicks,
                            spend: m.spend,
                            conversions: m.conversions,
                            conversionValue: m.conversionValue,
                            currencyCode: m.currencyCode
                        }
                    });
                }
            }
        }
    }
}
exports.CampaignsService = CampaignsService;
exports.campaignsService = new CampaignsService();
