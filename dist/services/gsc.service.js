"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gscService = exports.GSCService = void 0;
const googleapis_1 = require("googleapis");
const google_service_1 = require("./google.service");
const integrations_service_1 = require("./integrations.service");
class GSCService {
    async getClient() {
        const creds = await integrations_service_1.integrationsService.getSecureCredentials('gsc');
        if (!creds?.accessToken) {
            throw new Error('GSC not connected');
        }
        const { client, onTokens } = await google_service_1.googleOAuthService.getAuthenticatedClient(creds.accessToken, creds.refreshToken);
        onTokens(async (tokens) => {
            if (tokens.access_token) {
                const newRefreshToken = tokens.refresh_token || creds.refreshToken;
                await integrations_service_1.integrationsService.saveCredentials('gsc', tokens.access_token, newRefreshToken, creds.config);
            }
        });
        return client;
    }
    async getSites() {
        const client = await this.getClient();
        const searchconsole = googleapis_1.google.searchconsole({ version: 'v1', auth: client });
        const response = await searchconsole.sites.list();
        return response.data.siteEntry || [];
    }
    async healthCheck() {
        try {
            const creds = await integrations_service_1.integrationsService.getSecureCredentials('gsc');
            if (!creds?.accessToken)
                return false;
            const config = creds.config;
            if (!config?.siteUrl)
                return false;
            const client = await this.getClient();
            const searchconsole = googleapis_1.google.searchconsole({ version: 'v1', auth: client });
            // Basic health check to see if we can access the selected site
            await searchconsole.sites.get({ siteUrl: config.siteUrl });
            return true;
        }
        catch (error) {
            console.error('GSC Health Check Failed:', error);
            return false;
        }
    }
    async setSiteUrl(siteUrl) {
        const creds = await integrations_service_1.integrationsService.getSecureCredentials('gsc');
        if (!creds?.accessToken)
            throw new Error('Not connected');
        const config = creds.config || {};
        config.siteUrl = siteUrl;
        await integrations_service_1.integrationsService.saveCredentials('gsc', creds.accessToken, creds.refreshToken || null, config);
    }
    async runQuery(startDate = '30daysAgo', endDate = 'today', dimensions = ['query']) {
        const creds = await integrations_service_1.integrationsService.getSecureCredentials('gsc');
        if (!creds?.accessToken)
            return null;
        const config = creds.config;
        if (!config?.siteUrl)
            return null;
        const client = await this.getClient();
        const searchconsole = googleapis_1.google.searchconsole({ version: 'v1', auth: client });
        // GSC requires explicit YYYY-MM-DD formatting.
        // If startDate is generic like '30daysAgo', we parse it.
        let start = startDate;
        let end = endDate;
        if (startDate === '30daysAgo') {
            const d = new Date();
            d.setDate(d.getDate() - 30);
            start = d.toISOString().split('T')[0];
        }
        if (endDate === 'today') {
            end = new Date().toISOString().split('T')[0];
        }
        try {
            const response = await searchconsole.searchanalytics.query({
                siteUrl: config.siteUrl,
                requestBody: {
                    startDate: start,
                    endDate: end,
                    dimensions
                }
            });
            return response.data.rows || [];
        }
        catch (error) {
            console.error('GSC runQuery error:', error);
            return null;
        }
    }
}
exports.GSCService = GSCService;
exports.gscService = new GSCService();
