"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = googleOAuthRoutes;
const google_service_1 = require("../services/google.service");
const integrations_service_1 = require("../services/integrations.service");
// Store state tokens in memory (in production, use Redis or DB with expiration)
// Maps state -> { userId, timestamp }
const stateStore = new Map();
async function googleOAuthRoutes(fastify) {
    fastify.get('/google/oauth/start', async (request, reply) => {
        // We assume the user is authenticated, but for this demo route we'll just use a mock user ID if none exists.
        // In a real scenario, you'd extract userId from the JWT token.
        const userId = request.user?.id || 'system-user';
        const state = google_service_1.googleOAuthService.generateStateToken();
        stateStore.set(state, { userId, timestamp: Date.now() });
        const authUrl = google_service_1.googleOAuthService.getAuthUrl(state);
        return reply.redirect(authUrl);
    });
    fastify.get('/google/oauth/callback', async (request, reply) => {
        const { code, state, error } = request.query;
        if (error) {
            fastify.log.error(`Google OAuth error: ${error}`);
            return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/integrations?error=oauth_denied`);
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
            const tokens = await google_service_1.googleOAuthService.getTokens(code);
            // Save tokens for GA4 and GSC using the integrations service
            // We'll map the Google tokens to both `ga4` and `gsc` platforms in our DB,
            // or we could just save it under `google` and have both services use it.
            // Let's save under `ga4` and `gsc` so they can be independently connected/configured.
            if (tokens.access_token) {
                await integrations_service_1.integrationsService.saveCredentials('ga4', tokens.access_token, tokens.refresh_token || null, undefined);
                await integrations_service_1.integrationsService.saveCredentials('gsc', tokens.access_token, tokens.refresh_token || null, undefined);
                // At this point, we just saved the tokens. The frontend should now fetch properties.
                return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/integrations?subview=ga4&connected=true`);
            }
            else {
                return reply.status(400).send({ error: 'No access token returned from Google' });
            }
        }
        catch (err) {
            fastify.log.error(`Google OAuth token exchange failed: ${err.message}`);
            return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/integrations?error=token_exchange_failed`);
        }
    });
}
