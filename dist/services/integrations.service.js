"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationsService = exports.IntegrationsService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
const crypto_1 = require("../utils/crypto");
const wordpress_service_1 = require("./wordpress.service");
// The expected baseline of providers the frontend can connect to
const KNOWN_PROVIDERS = [
    'ga4',
    'google-ads',
    'meta-ads',
    'gsc',
    'looker',
    'callrail',
    'hubspot',
    'mailchimp',
    'google-business',
    'custom-api',
    'wordpress'
];
class IntegrationsService {
    async getStatus() {
        const credentials = await db_1.default.integrationCredential.findMany({
            select: {
                platformName: true,
                isActive: true,
                lastSyncAt: true,
                lastSuccessfulSyncAt: true,
                lastError: true,
                updatedAt: true,
                accessToken: true,
                apiKey: true,
                config: true
            },
        });
        const dbMap = new Map(credentials.map(c => [c.platformName, c]));
        // Construct a normalized list for the frontend
        const statuses = await Promise.all(KNOWN_PROVIDERS.map(async (provider) => {
            const dbRecord = dbMap.get(provider);
            let isConnected = !!(dbRecord && dbRecord.isActive && (dbRecord.accessToken || dbRecord.apiKey));
            let status = 'not_connected';
            if (provider === 'wordpress') {
                isConnected = !!(dbRecord && dbRecord.isActive);
                if (isConnected) {
                    status = dbRecord?.lastError ? 'error' : 'connected';
                }
                else {
                    status = 'not_connected';
                }
            }
            else if (isConnected) {
                if (dbRecord?.lastError) {
                    status = 'error';
                }
                else {
                    status = 'connected';
                }
            }
            return {
                id: provider,
                connected: isConnected,
                status,
                lastSyncAt: dbRecord?.lastSyncAt || null,
                lastSuccessfulSyncAt: dbRecord?.lastSuccessfulSyncAt || null,
                lastError: dbRecord?.lastError || null,
                updatedAt: dbRecord?.updatedAt || null,
                config: dbRecord?.config || null
            };
        }));
        return statuses;
    }
    async verifyWordPressHealth() {
        const isHealthy = await wordpress_service_1.wordpressService.healthCheck();
        if (isHealthy) {
            await db_1.default.integrationCredential.upsert({
                where: { platformName: 'wordpress' },
                update: {
                    isActive: true,
                    lastSuccessfulSyncAt: new Date(),
                    lastSyncAt: new Date(),
                    lastError: null,
                    config: { baseUrl: 'https://midwestspine.net' }
                },
                create: {
                    platformName: 'wordpress',
                    isActive: true,
                    lastSuccessfulSyncAt: new Date(),
                    lastSyncAt: new Date(),
                    config: { baseUrl: 'https://midwestspine.net' }
                }
            });
            return { success: true };
        }
        else {
            await db_1.default.integrationCredential.upsert({
                where: { platformName: 'wordpress' },
                update: {
                    lastSyncAt: new Date(),
                    lastError: 'WordPress health check failed'
                },
                create: {
                    platformName: 'wordpress',
                    isActive: false,
                    lastSyncAt: new Date(),
                    lastError: 'WordPress health check failed'
                }
            });
            return { success: false, error: 'WordPress health check failed' };
        }
    }
    /**
     * Internal method to safely save credentials
     */
    async saveCredentials(platformName, accessToken, refreshToken, apiKey) {
        const encryptedAccess = (0, crypto_1.encryptCredential)(accessToken);
        const encryptedRefresh = (0, crypto_1.encryptCredential)(refreshToken);
        const encryptedApi = (0, crypto_1.encryptCredential)(apiKey);
        return db_1.default.integrationCredential.upsert({
            where: { platformName },
            update: {
                accessToken: encryptedAccess,
                refreshToken: encryptedRefresh,
                apiKey: encryptedApi,
                isActive: true
            },
            create: {
                platformName,
                accessToken: encryptedAccess,
                refreshToken: encryptedRefresh,
                apiKey: encryptedApi,
                isActive: true
            }
        });
    }
    /**
     * Internal method to retrieve credentials securely for API calls
     */
    async getSecureCredentials(platformName) {
        const record = await db_1.default.integrationCredential.findUnique({
            where: { platformName }
        });
        if (!record || !record.isActive)
            return null;
        return {
            accessToken: (0, crypto_1.decryptCredential)(record.accessToken),
            refreshToken: (0, crypto_1.decryptCredential)(record.refreshToken),
            apiKey: (0, crypto_1.decryptCredential)(record.apiKey),
            config: record.config
        };
    }
    async triggerSync(data) {
        // In a real app, this would queue a job to fetch data from the external API
        return {
            message: `Manual sync triggered for ${data.platformName}.`,
            status: 'IN_PROGRESS',
        };
    }
}
exports.IntegrationsService = IntegrationsService;
exports.integrationsService = new IntegrationsService();
