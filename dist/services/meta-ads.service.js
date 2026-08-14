"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaAdsService = exports.MetaAdsService = void 0;
const axios_1 = __importDefault(require("axios"));
const integrations_service_1 = require("./integrations.service");
class MetaAdsService {
    getApiVersion() {
        return process.env.META_GRAPH_API_VERSION || 'v26.0';
    }
    async getClientInfo() {
        const creds = await integrations_service_1.integrationsService.getSecureCredentials('meta-ads');
        if (!creds || !creds.accessToken || !creds.config?.adAccountId)
            return null;
        return {
            accessToken: creds.accessToken,
            adAccountId: creds.config.adAccountId,
        };
    }
    async healthCheck() {
        try {
            const client = await this.getClientInfo();
            if (!client)
                return false;
            // Make a lightweight call to verify access to the ad account (using ads_read permission)
            const url = `https://graph.facebook.com/${this.getApiVersion()}/act_${client.adAccountId}`;
            const params = {
                access_token: client.accessToken,
                fields: 'id,name,account_status'
            };
            await axios_1.default.get(url, { params });
            return true;
        }
        catch (error) {
            console.error('Meta Ads healthCheck failed:', error.response?.data || error.message);
            return false;
        }
    }
    async listCampaigns() {
        const client = await this.getClientInfo();
        if (!client)
            throw new Error('Meta Ads not connected or missing configuration');
        const url = `https://graph.facebook.com/${this.getApiVersion()}/act_${client.adAccountId}/campaigns`;
        const params = {
            access_token: client.accessToken,
            fields: 'id,name,status,start_time,stop_time'
        };
        try {
            const res = await axios_1.default.get(url, { params });
            return (res.data.data || []).map((row) => ({
                platform: 'meta_ads',
                externalId: String(row.id),
                name: row.name,
                status: row.status,
                startDate: row.start_time,
                endDate: row.stop_time,
            }));
        }
        catch (error) {
            console.error('Meta Ads listCampaigns failed:', error.response?.data || error.message);
            throw error;
        }
    }
    async getCampaignMetricsByDateRange(startDate, endDate) {
        const client = await this.getClientInfo();
        if (!client)
            throw new Error('Meta Ads not connected or missing configuration');
        const url = `https://graph.facebook.com/${this.getApiVersion()}/act_${client.adAccountId}/insights`;
        const params = {
            access_token: client.accessToken,
            level: 'campaign',
            time_increment: 1, // Break down by day
            time_range: JSON.stringify({ since: startDate, until: endDate }),
            fields: 'campaign_id,campaign_name,date_start,impressions,clicks,spend,actions,action_values'
        };
        try {
            const res = await axios_1.default.get(url, { params });
            return (res.data.data || []).map((row) => {
                // Facebook stores conversions inside the `actions` array and conversion value inside `action_values`
                const offsiteConversions = row.actions?.find((a) => a.action_type === 'offsite_conversion.custom.123') || row.actions?.find((a) => a.action_type === 'omni_purchase');
                const offsiteValue = row.action_values?.find((a) => a.action_type === 'offsite_conversion.custom.123') || row.action_values?.find((a) => a.action_type === 'omni_purchase');
                return {
                    externalId: String(row.campaign_id),
                    date: row.date_start,
                    impressions: parseInt(row.impressions || '0', 10),
                    clicks: parseInt(row.clicks || '0', 10),
                    spend: parseFloat(row.spend || '0'),
                    conversions: offsiteConversions ? parseFloat(offsiteConversions.value) : null,
                    conversionValue: offsiteValue ? parseFloat(offsiteValue.value) : null,
                    currencyCode: 'USD', // Standardizing for this CRM, assuming USD or would require checking account settings
                };
            });
        }
        catch (error) {
            console.error('Meta Ads metrics failed:', error.response?.data || error.message);
            throw error;
        }
    }
}
exports.MetaAdsService = MetaAdsService;
exports.metaAdsService = new MetaAdsService();
