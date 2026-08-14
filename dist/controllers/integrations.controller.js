"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMailchimpHandler = exports.syncHubspotHandler = exports.syncCallrailHandler = exports.syncGbpHandler = exports.syncMetaAdsHandler = exports.syncGoogleAdsHandler = exports.setGscSiteHandler = exports.getGscSitesHandler = exports.setGa4PropertyHandler = exports.getGa4PropertiesHandler = exports.getWordPressConditionTreatmentsHandler = exports.getWordPressTaxonomiesHandler = exports.getWordPressTypesHandler = exports.getWordPressTagsHandler = exports.getWordPressCategoriesHandler = exports.getWordPressMediaHandler = exports.getWordPressPagesHandler = exports.getWordPressPostsHandler = exports.checkWordPressHealthHandler = exports.syncIntegrationHandler = exports.getIntegrationStatusHandler = void 0;
const integrations_service_1 = require("../services/integrations.service");
const ga4_service_1 = require("../services/ga4.service");
const gsc_service_1 = require("../services/gsc.service");
const google_ads_service_1 = require("../services/google-ads.service");
const meta_ads_service_1 = require("../services/meta-ads.service");
const google_business_service_1 = require("../services/google-business.service");
const callrail_service_1 = require("../services/callrail.service");
const hubspot_service_1 = require("../services/hubspot.service");
const mailchimp_service_1 = require("../services/mailchimp.service");
const wordpress_service_1 = require("../services/wordpress.service");
const campaigns_service_1 = require("../services/campaigns.service");
const getIntegrationStatusHandler = async (request, reply) => {
    const statuses = await integrations_service_1.integrationsService.getStatus();
    return reply.send({ success: true, data: statuses });
};
exports.getIntegrationStatusHandler = getIntegrationStatusHandler;
const syncIntegrationHandler = async (request, reply) => {
    const result = await integrations_service_1.integrationsService.triggerSync(request.body);
    return reply.send({ success: true, data: result });
};
exports.syncIntegrationHandler = syncIntegrationHandler;
// WordPress integration handlers
const checkWordPressHealthHandler = async (request, reply) => {
    try {
        const result = await integrations_service_1.integrationsService.verifyWordPressHealth();
        return reply.send(result);
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.checkWordPressHealthHandler = checkWordPressHealthHandler;
const getWordPressPostsHandler = async (request, reply) => {
    try {
        const data = await wordpress_service_1.wordpressService.getPosts(request.query);
        return reply.send({ success: true, ...data });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getWordPressPostsHandler = getWordPressPostsHandler;
const getWordPressPagesHandler = async (request, reply) => {
    try {
        const data = await wordpress_service_1.wordpressService.getPages(request.query);
        return reply.send({ success: true, ...data });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getWordPressPagesHandler = getWordPressPagesHandler;
const getWordPressMediaHandler = async (request, reply) => {
    try {
        const data = await wordpress_service_1.wordpressService.getMedia(request.query);
        return reply.send({ success: true, ...data });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getWordPressMediaHandler = getWordPressMediaHandler;
const getWordPressCategoriesHandler = async (request, reply) => {
    try {
        const data = await wordpress_service_1.wordpressService.getCategories(request.query);
        return reply.send({ success: true, ...data });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getWordPressCategoriesHandler = getWordPressCategoriesHandler;
const getWordPressTagsHandler = async (request, reply) => {
    try {
        const data = await wordpress_service_1.wordpressService.getTags(request.query);
        return reply.send({ success: true, ...data });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getWordPressTagsHandler = getWordPressTagsHandler;
const getWordPressTypesHandler = async (request, reply) => {
    try {
        const data = await wordpress_service_1.wordpressService.getTypes();
        return reply.send({ success: true, data });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getWordPressTypesHandler = getWordPressTypesHandler;
const getWordPressTaxonomiesHandler = async (request, reply) => {
    try {
        const data = await wordpress_service_1.wordpressService.getTaxonomies();
        return reply.send({ success: true, data });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getWordPressTaxonomiesHandler = getWordPressTaxonomiesHandler;
const getWordPressConditionTreatmentsHandler = async (request, reply) => {
    try {
        const data = await wordpress_service_1.wordpressService.getConditionTreatments(request.query);
        return reply.send({ success: true, ...data });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getWordPressConditionTreatmentsHandler = getWordPressConditionTreatmentsHandler;
const getGa4PropertiesHandler = async (request, reply) => {
    try {
        const properties = await ga4_service_1.ga4Service.getProperties();
        return reply.send({ success: true, data: properties });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getGa4PropertiesHandler = getGa4PropertiesHandler;
const setGa4PropertyHandler = async (request, reply) => {
    try {
        await ga4_service_1.ga4Service.setPropertyId(request.body.propertyId);
        return reply.send({ success: true });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.setGa4PropertyHandler = setGa4PropertyHandler;
const getGscSitesHandler = async (request, reply) => {
    try {
        const sites = await gsc_service_1.gscService.getSites();
        return reply.send({ success: true, data: sites });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.getGscSitesHandler = getGscSitesHandler;
const setGscSiteHandler = async (request, reply) => {
    try {
        await gsc_service_1.gscService.setSiteUrl(request.body.siteUrl);
        return reply.send({ success: true });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.setGscSiteHandler = setGscSiteHandler;
const syncGoogleAdsHandler = async (request, reply) => {
    try {
        const campaigns = await google_ads_service_1.googleAdsService.listCampaigns();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const endDate = new Date();
        const metrics = await google_ads_service_1.googleAdsService.getCampaignMetricsByDateRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
        await campaigns_service_1.campaignsService.upsertExternalCampaigns(campaigns, metrics);
        return reply.send({ success: true, message: 'Google Ads synced successfully' });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.syncGoogleAdsHandler = syncGoogleAdsHandler;
const syncMetaAdsHandler = async (request, reply) => {
    try {
        const campaigns = await meta_ads_service_1.metaAdsService.listCampaigns();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const endDate = new Date();
        const metrics = await meta_ads_service_1.metaAdsService.getCampaignMetricsByDateRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
        await campaigns_service_1.campaignsService.upsertExternalCampaigns(campaigns, metrics);
        return reply.send({ success: true, message: 'Meta Ads synced successfully' });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.syncMetaAdsHandler = syncMetaAdsHandler;
const syncGbpHandler = async (request, reply) => {
    try {
        await google_business_service_1.googleBusinessService.syncReviews();
        return reply.send({ success: true, message: 'GBP synced successfully' });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.syncGbpHandler = syncGbpHandler;
const syncCallrailHandler = async (request, reply) => {
    try {
        await callrail_service_1.callRailService.syncCalls();
        return reply.send({ success: true, message: 'CallRail synced successfully' });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.syncCallrailHandler = syncCallrailHandler;
const syncHubspotHandler = async (request, reply) => {
    try {
        await hubspot_service_1.hubspotService.syncLeads();
        return reply.send({ success: true, message: 'HubSpot synced successfully' });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.syncHubspotHandler = syncHubspotHandler;
const syncMailchimpHandler = async (request, reply) => {
    try {
        await mailchimp_service_1.mailchimpService.syncCampaigns();
        return reply.send({ success: true, message: 'Mailchimp synced successfully' });
    }
    catch (err) {
        return reply.status(500).send({ success: false, error: err.message });
    }
};
exports.syncMailchimpHandler = syncMailchimpHandler;
