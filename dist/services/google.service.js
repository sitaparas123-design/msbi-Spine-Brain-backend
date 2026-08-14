"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOAuthService = exports.GoogleOAuthService = void 0;
const googleapis_1 = require("googleapis");
const crypto_1 = require("crypto");
const SCOPES = [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/adwords'
];
class GoogleOAuthService {
    getClient() {
        return new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    }
    getAuthUrl(state) {
        const oauth2Client = this.getClient();
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: SCOPES,
            state, // Secure random state passed in from the router
        });
    }
    async getTokens(code) {
        const oauth2Client = this.getClient();
        const { tokens } = await oauth2Client.getToken(code);
        return tokens;
    }
    /**
     * Retrieves an authenticated client based on decrypted DB credentials.
     * Also returns whether the token was refreshed, so the caller can save the new token if needed.
     */
    async getAuthenticatedClient(accessToken, refreshToken) {
        const oauth2Client = this.getClient();
        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken || undefined,
        });
        let wasRefreshed = false;
        let newTokens = null;
        oauth2Client.on('tokens', (tokens) => {
            wasRefreshed = true;
            newTokens = tokens;
        });
        // We don't manually force refresh here unless it fails. The googleapis library handles auto-refresh
        // when a request is made, triggering the 'tokens' event. We can return the client directly.
        return {
            client: oauth2Client,
            onTokens: (callback) => {
                oauth2Client.on('tokens', callback);
            }
        };
    }
    generateStateToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
}
exports.GoogleOAuthService = GoogleOAuthService;
exports.googleOAuthService = new GoogleOAuthService();
