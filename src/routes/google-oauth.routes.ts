import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { googleOAuthService } from '../services/google.service';
import { integrationsService } from '../services/integrations.service';
import { ga4Service } from '../services/ga4.service';

// Store state tokens in memory (in production, use Redis or DB with expiration)
// Maps state -> { userId, timestamp }
const stateStore = new Map<string, { userId: string; timestamp: number }>();

export default async function googleOAuthRoutes(fastify: FastifyInstance) {
  fastify.get('/google/oauth/start', async (request: FastifyRequest, reply: FastifyReply) => {
    // We assume the user is authenticated, but for this demo route we'll just use a mock user ID if none exists.
    // In a real scenario, you'd extract userId from the JWT token.
    const userId = (request as any).user?.id || 'system-user';
    
    const state = googleOAuthService.generateStateToken();
    stateStore.set(state, { userId, timestamp: Date.now() });
    
    const authUrl = googleOAuthService.getAuthUrl(state);
    
    return reply.redirect(authUrl);
  });

  fastify.get('/google/oauth/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { code?: string; state?: string; error?: string };
    console.log(`[OAUTH CALLBACK] Reached. Query params:`, {
      hasCode: !!query.code,
      hasState: !!query.state,
      error: query.error
    });

    if (query.error) {
      console.error(`[OAUTH CALLBACK] Google returned error: ${query.error}`);
      return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/integrations?error=oauth_denied`);
    }

    if (!query.code || !query.state) {
      console.error(`[OAUTH CALLBACK] Missing authorization code or state token`);
      return reply.status(400).send({ error: 'Missing code or state' });
    }

    // Validate state
    console.log(`[OAUTH CALLBACK] Validating state token: ${query.state}`);
    const stateData = stateStore.get(query.state);
    if (!stateData) {
      console.error(`[OAUTH CALLBACK] Invalid or expired state token`);
      return reply.status(400).send({ error: 'Invalid or expired state token' });
    }
    
    // Optional: check expiration (e.g., 10 minutes)
    if (Date.now() - stateData.timestamp > 10 * 60 * 1000) {
      console.error(`[OAUTH CALLBACK] State token has expired`);
      stateStore.delete(query.state);
      return reply.status(400).send({ error: 'State token expired' });
    }
    
    stateStore.delete(query.state); // Single use
    console.log(`[OAUTH CALLBACK] State token validated successfully.`);

    try {
      console.log(`[OAUTH CALLBACK] Exchanging authorization code for tokens...`);
      const tokens = await googleOAuthService.getTokens(query.code);
      console.log(`[OAUTH CALLBACK] Token exchange successful. Refresh token present:`, !!tokens.refresh_token);
      
      if (tokens.access_token) {
        console.log(`[OAUTH CALLBACK] Saving credentials for platforms "ga4" and "gsc"...`);
        await integrationsService.saveCredentials('ga4', tokens.access_token, tokens.refresh_token || null, undefined);
        await integrationsService.saveCredentials('gsc', tokens.access_token, tokens.refresh_token || null, undefined);
        console.log(`[OAUTH CALLBACK] Credentials saved successfully.`);
        
        return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/integrations?subview=ga4&connected=true`);
      } else {
        console.error(`[OAUTH CALLBACK] No access token returned from Google`);
        return reply.status(400).send({ error: 'No access token returned from Google' });
      }
    } catch (err: any) {
      console.error(`[OAUTH CALLBACK] Token exchange failed: ${err.message}`);
      return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/integrations?error=token_exchange_failed`);
    }
  });

  fastify.get('/google/analytics', async (request: FastifyRequest, reply: FastifyReply) => {
    const { startDate, endDate } = request.query as { startDate?: string; endDate?: string };
    try {
      const overview = await ga4Service.getOverview(startDate || '30daysAgo', endDate || 'today');
      const landingPages = await ga4Service.getLandingPagesReport(startDate || '30daysAgo', endDate || 'today');
      return reply.send({
        success: true,
        data: {
          overview,
          landingPages
        }
      });
    } catch (error: any) {
      fastify.log.error(`GA4 report fetch failed: ${error.message || error}`);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch GA4 report'
      });
    }
  });
}
