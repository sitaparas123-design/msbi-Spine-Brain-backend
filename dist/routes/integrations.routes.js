"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationsRoutes = integrationsRoutes;
const integrations_controller_1 = require("../controllers/integrations.controller");
const integrations_schema_1 = require("../validators/integrations.schema");
const zod_1 = require("zod");
async function integrationsRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/status', integrations_controller_1.getIntegrationStatusHandler);
    server.post('/sync', {
        schema: {
            body: integrations_schema_1.syncIntegrationSchema,
        },
    }, integrations_controller_1.syncIntegrationHandler);
    server.post('/google-ads/sync', integrations_controller_1.syncGoogleAdsHandler);
    server.post('/meta-ads/sync', integrations_controller_1.syncMetaAdsHandler);
    server.post('/google-business/sync', integrations_controller_1.syncGbpHandler);
    server.post('/callrail/sync', integrations_controller_1.syncCallrailHandler);
    server.post('/hubspot/sync', integrations_controller_1.syncHubspotHandler);
    server.post('/mailchimp/sync', integrations_controller_1.syncMailchimpHandler);
    server.get('/ga4/properties', integrations_controller_1.getGa4PropertiesHandler);
    server.post('/ga4/property', {
        schema: {
            body: zod_1.z.object({ propertyId: zod_1.z.string() })
        }
    }, integrations_controller_1.setGa4PropertyHandler);
    server.get('/gsc/sites', integrations_controller_1.getGscSitesHandler);
    server.post('/gsc/site', {
        schema: {
            body: zod_1.z.object({ siteUrl: zod_1.z.string() })
        }
    }, integrations_controller_1.setGscSiteHandler);
    // WordPress routes
    server.get('/wordpress/health', integrations_controller_1.checkWordPressHealthHandler);
    server.get('/wordpress/posts', integrations_controller_1.getWordPressPostsHandler);
    server.get('/wordpress/pages', integrations_controller_1.getWordPressPagesHandler);
    server.get('/wordpress/media', integrations_controller_1.getWordPressMediaHandler);
    server.get('/wordpress/categories', integrations_controller_1.getWordPressCategoriesHandler);
    server.get('/wordpress/tags', integrations_controller_1.getWordPressTagsHandler);
    server.get('/wordpress/types', integrations_controller_1.getWordPressTypesHandler);
    server.get('/wordpress/taxonomies', integrations_controller_1.getWordPressTaxonomiesHandler);
    server.get('/wordpress/condition-treatments', integrations_controller_1.getWordPressConditionTreatmentsHandler);
}
