import axios from 'axios';
import { integrationsService } from './integrations.service';

export class GoogleAdsService {
  private getApiVersion(): string {
    return process.env.GOOGLE_ADS_API_VERSION || 'v25';
  }

  private getDeveloperToken(): string {
    return process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '';
  }

  private async getClientInfo() {
    const creds = await integrationsService.getSecureCredentials('google-ads');
    if (!creds || !creds.accessToken || !creds.config?.customerId) return null;
    
    return {
      accessToken: creds.accessToken,
      customerId: creds.config.customerId,
      loginCustomerId: creds.config.loginCustomerId,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const client = await this.getClientInfo();
      if (!client) return false;

      // Make a lightweight call to verify access to the customer account
      const url = `https://googleads.googleapis.com/${this.getApiVersion()}/customers/${client.customerId}`;
      
      const headers: any = {
        'Authorization': `Bearer ${client.accessToken}`,
        'developer-token': this.getDeveloperToken(),
      };
      
      if (client.loginCustomerId) {
        headers['login-customer-id'] = client.loginCustomerId;
      }

      await axios.get(url, { headers });
      return true;
    } catch (error: any) {
      console.error('Google Ads healthCheck failed:', error.response?.data || error.message);
      return false;
    }
  }

  async listCampaigns() {
    const client = await this.getClientInfo();
    if (!client) throw new Error('Google Ads not connected or missing configuration');

    const url = `https://googleads.googleapis.com/${this.getApiVersion()}/customers/${client.customerId}/googleAds:search`;
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.start_date,
        campaign.end_date
      FROM campaign
      WHERE campaign.status != 'REMOVED'
    `;

    const headers: any = {
      'Authorization': `Bearer ${client.accessToken}`,
      'developer-token': this.getDeveloperToken(),
      'Content-Type': 'application/json'
    };

    if (client.loginCustomerId) {
      headers['login-customer-id'] = client.loginCustomerId;
    }

    try {
      const res = await axios.post(url, { query }, { headers });
      
      return (res.data.results || []).map((row: any) => ({
        platform: 'google_ads',
        externalId: String(row.campaign.id),
        name: row.campaign.name,
        status: row.campaign.status,
        startDate: row.campaign.startDate,
        endDate: row.campaign.endDate,
      }));
    } catch (error: any) {
      console.error('Google Ads listCampaigns failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getCampaignMetricsByDateRange(startDate: string, endDate: string) {
    const client = await this.getClientInfo();
    if (!client) throw new Error('Google Ads not connected or missing configuration');

    const url = `https://googleads.googleapis.com/${this.getApiVersion()}/customers/${client.customerId}/googleAds:search`;
    
    // Group metrics by campaign id and date
    const query = `
      SELECT
        campaign.id,
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
    `;

    const headers: any = {
      'Authorization': `Bearer ${client.accessToken}`,
      'developer-token': this.getDeveloperToken(),
      'Content-Type': 'application/json'
    };

    if (client.loginCustomerId) {
      headers['login-customer-id'] = client.loginCustomerId;
    }

    try {
      const res = await axios.post(url, { query }, { headers });
      
      return (res.data.results || []).map((row: any) => {
        return {
          externalId: String(row.campaign.id),
          date: row.segments.date,
          impressions: parseInt(row.metrics.impressions || '0', 10),
          clicks: parseInt(row.metrics.clicks || '0', 10),
          // Convert cost_micros to standard currency
          spend: parseFloat(row.metrics.costMicros || '0') / 1_000_000,
          conversions: row.metrics.conversions ? parseFloat(row.metrics.conversions) : null,
          conversionValue: row.metrics.conversionsValue ? parseFloat(row.metrics.conversionsValue) : null,
          currencyCode: 'USD', // Standardizing for this example, could be dynamically fetched via customer fields
        };
      });
    } catch (error: any) {
      console.error('Google Ads metrics failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

export const googleAdsService = new GoogleAdsService();
