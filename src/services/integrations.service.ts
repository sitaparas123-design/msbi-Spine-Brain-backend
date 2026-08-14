import prisma from '../plugins/db';
import { SyncIntegrationInput } from '../validators/integrations.schema';
import { encryptCredential, decryptCredential } from '../utils/crypto';
import { wordpressService } from './wordpress.service';

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

export class IntegrationsService {
  async getStatus() {
    const credentials = await prisma.integrationCredential.findMany({
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
    const statuses = await Promise.all(KNOWN_PROVIDERS.map(async provider => {
      const dbRecord = dbMap.get(provider);
      
      let isConnected = !!(dbRecord && dbRecord.isActive && (dbRecord.accessToken || dbRecord.apiKey));
      let status = 'not_connected';

      if (provider === 'wordpress') {
        isConnected = !!(dbRecord && dbRecord.isActive);
        if (isConnected) {
          status = dbRecord?.lastError ? 'error' : 'connected';
        } else {
          status = 'not_connected';
        }
      } else if (isConnected) {
        if (dbRecord?.lastError) {
          status = 'error';
        } else {
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
    const isHealthy = await wordpressService.healthCheck();
    if (isHealthy) {
      await prisma.integrationCredential.upsert({
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
    } else {
      await prisma.integrationCredential.upsert({
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
  async saveCredentials(platformName: string, accessToken: string | null, refreshToken?: string | null, apiKey?: string | null) {
    const encryptedAccess = encryptCredential(accessToken);
    const encryptedRefresh = encryptCredential(refreshToken);
    const encryptedApi = encryptCredential(apiKey);
    
    return prisma.integrationCredential.upsert({
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
  async getSecureCredentials(platformName: string) {
    const record = await prisma.integrationCredential.findUnique({
      where: { platformName }
    });
    
    if (!record || !record.isActive) return null;
    
    return {
      accessToken: decryptCredential(record.accessToken),
      refreshToken: decryptCredential(record.refreshToken),
      apiKey: decryptCredential(record.apiKey),
      config: record.config as any
    };
  }

  async triggerSync(data: SyncIntegrationInput) {
    // In a real app, this would queue a job to fetch data from the external API
    return {
      message: `Manual sync triggered for ${data.platformName}.`,
      status: 'IN_PROGRESS',
    };
  }
}

export const integrationsService = new IntegrationsService();
