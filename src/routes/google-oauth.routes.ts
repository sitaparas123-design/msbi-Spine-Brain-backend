import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { googleOAuthService } from '../services/google.service';
import { integrationsService } from '../services/integrations.service';

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
    const { code, state, error } = request.query as { code?: string; state?: string; error?: string };

    if (error) {
      fastify.log.error(`Google OAuth error: ${error}`);
      return reply.redirect('/integrations?error=oauth_denied');
    }

    if (!code || !state) {
      return reply.status(400).send({ error: 'Missing code or state' });
    }

    // Validate state
    const stateData = stateStore.get(state);
    if (!stateData) {
      return reply.status(400).send({ error: 'Invalid or expired state token' });
    }
    
    // Optional: check expiration (e.g., 10 minutes)
    if (Date.now() - stateData.timestamp > 10 * 60 * 1000) {
      stateStore.delete(state);
      return reply.status(400).send({ error: 'State token expired' });
    }
    
    stateStore.delete(state); // Single use

    try {
      const tokens = await googleOAuthService.getTokens(code);
      
      // Save tokens for GA4 and GSC using the integrations service
      // We'll map the Google tokens to both `ga4` and `gsc` platforms in our DB,
      // or we could just save it under `google` and have both services use it.
      // Let's save under `ga4` and `gsc` so they can be independently connected/configured.
      
      if (tokens.access_token) {
        await integrationsService.saveCredentials('ga4', tokens.access_token, tokens.refresh_token || null, undefined);
        await integrationsService.saveCredentials('gsc', tokens.access_token, tokens.refresh_token || null, undefined);
        
        // At this point, we just saved the tokens. The frontend should now fetch properties.
        return reply.redirect('/integrations?subview=ga4&connected=true');
      } else {
        return reply.status(400).send({ error: 'No access token returned from Google' });
      }
    } catch (err: any) {
      fastify.log.error(`Google OAuth token exchange failed: ${err.message}`);
      return reply.redirect('/integrations?error=token_exchange_failed');
    }
  });
}
