"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callRailService = exports.CallRailService = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("../plugins/db"));
const integrations_service_1 = require("./integrations.service");
class CallRailService {
    getApiToken() {
        return process.env.CALLRAIL_API_TOKEN || '';
    }
    async getClientInfo() {
        const creds = await integrations_service_1.integrationsService.getSecureCredentials('callrail');
        if (!creds)
            return null;
        return {
            accountId: creds.config?.accountId || null,
        };
    }
    async healthCheck() {
        try {
            const token = this.getApiToken();
            if (!token)
                return false;
            // Validate token by fetching accessible accounts
            const url = `https://api.callrail.com/v3/a.json`;
            await axios_1.default.get(url, {
                headers: { 'Authorization': `Token token=${token}` }
            });
            return true;
        }
        catch (error) {
            console.error('CallRail healthCheck failed:', error.response?.data || error.message);
            return false;
        }
    }
    async getAccessibleAccounts() {
        const token = this.getApiToken();
        if (!token)
            throw new Error('CallRail API Token missing');
        try {
            const url = `https://api.callrail.com/v3/a.json`;
            const res = await axios_1.default.get(url, {
                headers: { 'Authorization': `Token token=${token}` }
            });
            return (res.data.accounts || []).map((acc) => ({
                id: acc.id,
                name: acc.name
            }));
        }
        catch (error) {
            console.error('Failed to fetch CallRail accounts:', error.response?.data || error.message);
            throw error;
        }
    }
    async syncCalls() {
        const token = this.getApiToken();
        const client = await this.getClientInfo();
        if (!token || !client || !client.accountId) {
            throw new Error('CallRail not configured. Missing API token or accountId.');
        }
        const url = `https://api.callrail.com/v3/a/${client.accountId}/calls.json`;
        try {
            const res = await axios_1.default.get(url, {
                headers: { 'Authorization': `Token token=${token}` },
                params: {
                    per_page: 100, // Fetch recent 100 calls for sync
                }
            });
            const calls = res.data.calls || [];
            let syncedCount = 0;
            for (const call of calls) {
                const externalCallId = String(call.id);
                const callerName = call.customer_name || 'Unknown Caller';
                const phone = call.customer_phone_number || '';
                const durationSecs = call.duration || 0;
                // The CRM uses a string for duration, e.g. "120"
                const durationStr = String(durationSecs);
                const campaign = call.campaign || call.utm_campaign || 'Direct';
                const status = call.answered ? 'Answered' : 'Missed';
                const location = call.customer_city || null;
                const audioUrl = call.recording_player_url || call.recording || null;
                const timestamp = new Date(call.start_time);
                const data = {
                    caller: callerName,
                    phone: phone,
                    duration: durationStr,
                    campaign: campaign,
                    status: status,
                    location: location,
                    audioUrl: audioUrl,
                    timestamp: timestamp,
                    externalCallId: externalCallId,
                };
                const existing = await db_1.default.callLog.findFirst({
                    where: { externalCallId: externalCallId }
                });
                if (existing) {
                    await db_1.default.callLog.update({
                        where: { id: existing.id },
                        data
                    });
                }
                else {
                    await db_1.default.callLog.create({
                        data
                    });
                }
                syncedCount++;
            }
            // Update sync status
            await db_1.default.integrationCredential.update({
                where: { platformName: 'callrail' },
                data: {
                    lastSyncAt: new Date(),
                    lastSuccessfulSyncAt: new Date(),
                    lastError: null
                }
            });
            return { success: true, count: syncedCount };
        }
        catch (error) {
            console.error('Failed to sync CallRail calls:', error.response?.data || error.message);
            await db_1.default.integrationCredential.update({
                where: { platformName: 'callrail' },
                data: {
                    lastSyncAt: new Date(),
                    lastError: error.message
                }
            });
            throw error;
        }
    }
}
exports.CallRailService = CallRailService;
exports.callRailService = new CallRailService();
