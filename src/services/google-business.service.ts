import axios from 'axios';
import prisma from '../plugins/db';
import { integrationsService } from './integrations.service';

export class GoogleBusinessService {
  private getApiVersion(): string {
    return 'v1'; // My Business Business Information API uses v1, Business Profile Performance uses v1
  }

  private async getClientInfo() {
    const creds = await integrationsService.getSecureCredentials('google-business');
    if (!creds || !creds.accessToken) return null;
    return {
      accessToken: creds.accessToken,
      config: creds.config || {}
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const client = await this.getClientInfo();
      if (!client) return false;

      // Validate token by fetching accessible accounts
      const url = `https://mybusinessaccountmanagement.googleapis.com/v1/accounts`;
      await axios.get(url, {
        headers: { 'Authorization': `Bearer ${client.accessToken}` }
      });
      return true;
    } catch (error: any) {
      console.error('Google Business healthCheck failed:', error.response?.data || error.message);
      return false;
    }
  }

  async getAccessibleLocations() {
    const client = await this.getClientInfo();
    if (!client) throw new Error('Google Business Profile not connected');

    try {
      // 1. Get Accounts
      const accountsUrl = `https://mybusinessaccountmanagement.googleapis.com/v1/accounts`;
      const accountsRes = await axios.get(accountsUrl, {
        headers: { 'Authorization': `Bearer ${client.accessToken}` }
      });
      
      const accounts = accountsRes.data.accounts || [];
      if (accounts.length === 0) return [];
      
      // 2. For the primary account, get locations
      // For simplicity, we fetch locations for the first accessible account.
      const primaryAccount = accounts[0].name; // format: accounts/{accountId}
      const locationsUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/${primaryAccount}/locations?readMask=name,title`;
      
      const locationsRes = await axios.get(locationsUrl, {
        headers: { 'Authorization': `Bearer ${client.accessToken}` }
      });

      return (locationsRes.data.locations || []).map((loc: any) => ({
        id: loc.name, // e.g. locations/{locationId}
        name: loc.title
      }));
    } catch (error: any) {
      console.error('Failed to fetch accessible GBP locations:', error.response?.data || error.message);
      throw error;
    }
  }

  async syncReviews() {
    const client = await this.getClientInfo();
    if (!client || !client.config.locationId) {
      throw new Error('Google Business Profile not configured. Missing locationId.');
    }

    const locationId = client.config.locationId; // should be 'locations/{locationId}' or 'accounts/123/locations/456'
    
    const url = `https://mybusiness.googleapis.com/v4/${locationId}/reviews`;

    try {
      const res = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${client.accessToken}` }
      });

      const reviews = res.data.reviews || [];

      let syncedCount = 0;

      // Upsert reviews into DB
      for (const rev of reviews) {
        const externalReviewId = rev.reviewId;
        const ratingNum = rev.starRating === 'FIVE' ? 5 : rev.starRating === 'FOUR' ? 4 : rev.starRating === 'THREE' ? 3 : rev.starRating === 'TWO' ? 2 : 1;
        const authorName = rev.reviewer?.displayName || 'Google User';
        const date = new Date(rev.createTime);
        const comment = rev.comment || '';
        const reply = rev.reviewReply?.comment || null;

        const data: any = {
          platform: 'Google',
          rating: ratingNum,
          comment: comment,
          authorName: authorName,
          date: date,
          externalReviewId: externalReviewId,
        };

        const existing = await prisma.review.findFirst({
          where: { platform: 'Google', externalReviewId: externalReviewId } as any
        });

        if (existing) {
          await prisma.review.update({
            where: { id: existing.id },
            data
          });
        } else {
          await prisma.review.create({
            data
          });
        }
        syncedCount++;
      }

      // Update sync status
      await prisma.integrationCredential.update({
        where: { platformName: 'google-business' },
        data: {
          lastSyncAt: new Date(),
          lastSuccessfulSyncAt: new Date(),
          lastError: null
        }
      });

      return { success: true, count: syncedCount };

    } catch (error: any) {
      console.error('Failed to sync GBP reviews:', error.response?.data || error.message);
      await prisma.integrationCredential.update({
        where: { platformName: 'google-business' },
        data: {
          lastSyncAt: new Date(),
          lastError: error.message
        }
      });
      throw error;
    }
  }
}

export const googleBusinessService = new GoogleBusinessService();
