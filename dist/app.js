"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = require("./routes/auth.routes");
const dashboard_routes_1 = require("./routes/dashboard.routes");
const users_routes_1 = require("./routes/users.routes");
const campaigns_routes_1 = require("./routes/campaigns.routes");
const budget_routes_1 = require("./routes/budget.routes");
const vendors_routes_1 = require("./routes/vendors.routes");
const analytics_routes_1 = require("./routes/analytics.routes");
const reputation_routes_1 = require("./routes/reputation.routes");
const settings_routes_1 = require("./routes/settings.routes");
const reports_routes_1 = require("./routes/reports.routes");
const integrations_routes_1 = require("./routes/integrations.routes");
const leads_routes_1 = require("./routes/leads.routes");
const calls_routes_1 = require("./routes/calls.routes");
const form_submissions_routes_1 = require("./routes/form-submissions.routes");
const rbac_routes_1 = __importDefault(require("./routes/rbac.routes"));
const google_oauth_routes_1 = __importDefault(require("./routes/google-oauth.routes"));
const webhooks_routes_1 = require("./routes/webhooks.routes");
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const buildApp = () => {
    const app = (0, fastify_1.default)({
        logger: false, // Custom logger will be used in server.ts
        ignoreTrailingSlash: true
    });
    // Setup Zod compiler for validation
    app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    // Global Error Handler
    app.setErrorHandler(error_middleware_1.errorHandler);
    // Register Core Plugins
    app.register(cors_1.default, {
        origin: '*', // Adjust for production
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });
    app.register(rate_limit_1.default, {
        global: false // We will apply it specifically on the routes we want
    });
    // API Status Route
    app.get('/api/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
    // Register Domain Modules (Phase 1, 2, 3 & 4)
    app.register(auth_routes_1.authRoutes, { prefix: '/api/v1/auth' });
    app.register(dashboard_routes_1.dashboardRoutes, { prefix: '/api/v1/dashboard' });
    app.register(users_routes_1.userRoutes, { prefix: '/api/v1/users' });
    app.register(campaigns_routes_1.campaignRoutes, { prefix: '/api/v1/campaigns' });
    app.register(budget_routes_1.budgetRoutes, { prefix: '/api/v1/budget' });
    app.register(vendors_routes_1.vendorRoutes, { prefix: '/api/v1/vendors' });
    app.register(analytics_routes_1.analyticsRoutes, { prefix: '/api/v1/analytics' });
    app.register(reputation_routes_1.reputationRoutes, { prefix: '/api/v1/reputation' });
    app.register(settings_routes_1.settingsRoutes, { prefix: '/api/v1/settings' });
    app.register(reports_routes_1.reportsRoutes, { prefix: '/api/v1/reports' });
    app.register(integrations_routes_1.integrationsRoutes, { prefix: '/api/v1/integrations' });
    app.register(leads_routes_1.leadsRoutes, { prefix: '/api/v1/leads' });
    app.register(calls_routes_1.callsRoutes, { prefix: '/api/v1/calls' });
    app.register(form_submissions_routes_1.formSubmissionsRoutes, { prefix: '/api/v1/form-submissions' });
    app.register(rbac_routes_1.default, { prefix: '/api/v1/roles' });
    app.register(google_oauth_routes_1.default, { prefix: '/api/v1/integrations' });
    app.register(webhooks_routes_1.webhooksRoutes, { prefix: '/api/v1/webhooks' });
    return app;
};
exports.buildApp = buildApp;
