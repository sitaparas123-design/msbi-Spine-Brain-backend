import { google } from 'googleapis';
import { googleOAuthService } from './google.service';
import { integrationsService } from './integrations.service';

export class GA4Service {
  private async getClient() {
    const creds = await integrationsService.getSecureCredentials('ga4');
    if (!creds?.accessToken) {
      throw new Error('GA4 not connected');
    }
    const { client, onTokens } = await googleOAuthService.getAuthenticatedClient(creds.accessToken, creds.refreshToken);
    
    onTokens(async (tokens) => {
      // If we got new tokens, persist them
      if (tokens.access_token) {
        // Keep the old refresh token if a new one wasn't provided
        const newRefreshToken = tokens.refresh_token || creds.refreshToken;
        await integrationsService.saveCredentials('ga4', tokens.access_token, newRefreshToken, creds.config);
      }
    });

    return client;
  }

  async getProperties() {
    const client = await this.getClient();
    const adminApi = google.analyticsadmin({ version: 'v1beta', auth: client });
    const response = await adminApi.accountSummaries.list();
    return response.data.accountSummaries || [];
  }

  async healthCheck() {
    try {
      const creds = await integrationsService.getSecureCredentials('ga4');
      if (!creds?.accessToken) return false;
      
      const config = creds.config as any;
      if (!config?.propertyId) return false; // Configuration Required

      const client = await this.getClient();
      const adminApi = google.analyticsadmin({ version: 'v1beta', auth: client });
      
      // Basic health check to see if we can access the selected property
      await adminApi.properties.get({ name: `properties/${config.propertyId}` });
      return true;
    } catch (error) {
      console.error('GA4 Health Check Failed:', error);
      return false;
    }
  }

  async setPropertyId(propertyId: string) {
    const creds = await integrationsService.getSecureCredentials('ga4');
    if (!creds?.accessToken) throw new Error('Not connected');
    
    const config = creds.config as any || {};
    config.propertyId = propertyId;
    
    // We pass the existing access token and refresh token, but update the config
    await integrationsService.saveCredentials('ga4', creds.accessToken, creds.refreshToken || null, config);
  }

  async runReport(dimensions: string[], metrics: string[], startDate = '30daysAgo', endDate = 'today') {
    const creds = await integrationsService.getSecureCredentials('ga4');
    if (!creds?.accessToken) return null;
    
    const config = creds.config as any;
    if (!config?.propertyId) return null;

    const client = await this.getClient();
    const dataApi = google.analyticsdata({ version: 'v1beta', auth: client });
    
    try {
      const response = await dataApi.properties.runReport({
        property: `properties/${config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: dimensions.map(d => ({ name: d })),
          metrics: metrics.map(m => ({ name: m }))
        }
      });
      return response.data;
    } catch (error) {
      console.error('GA4 runReport error:', error);
      return null;
    }
  }

  async getOverview(startDate = '30daysAgo', endDate = 'today') {
    const data = await this.runReport([], ['totalUsers', 'activeUsers', 'newUsers', 'sessions', 'screenPageViews', 'engagedSessions'], startDate, endDate);
    if (!data || !data.rows || data.rows.length === 0) return null;
    
    const metrics = data.rows[0].metricValues;
    return {
      totalUsers: parseInt(metrics?.[0]?.value || '0', 10),
      activeUsers: parseInt(metrics?.[1]?.value || '0', 10),
      newUsers: parseInt(metrics?.[2]?.value || '0', 10),
      sessions: parseInt(metrics?.[3]?.value || '0', 10),
      screenPageViews: parseInt(metrics?.[4]?.value || '0', 10),
      engagedSessions: parseInt(metrics?.[5]?.value || '0', 10),
    };
  }
}

export const ga4Service = new GA4Service();
