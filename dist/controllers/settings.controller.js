"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvidersHandler = exports.getClinicsHandler = exports.updateOrganizationHandler = exports.getOrganizationHandler = void 0;
const settings_service_1 = require("../services/settings.service");
const getOrganizationHandler = async (request, reply) => {
    const org = await settings_service_1.settingsService.getOrganization();
    return reply.send({ success: true, data: org });
};
exports.getOrganizationHandler = getOrganizationHandler;
const updateOrganizationHandler = async (request, reply) => {
    const org = await settings_service_1.settingsService.updateOrganization(request.body);
    return reply.send({ success: true, data: org });
};
exports.updateOrganizationHandler = updateOrganizationHandler;
const getClinicsHandler = async (request, reply) => {
    const clinics = await settings_service_1.settingsService.getClinics();
    return reply.send({ success: true, data: clinics });
};
exports.getClinicsHandler = getClinicsHandler;
const getProvidersHandler = async (request, reply) => {
    const providers = await settings_service_1.settingsService.getProviders();
    return reply.send({ success: true, data: providers });
};
exports.getProvidersHandler = getProvidersHandler;
