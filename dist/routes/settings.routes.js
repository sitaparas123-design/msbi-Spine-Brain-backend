"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsRoutes = settingsRoutes;
const settings_controller_1 = require("../controllers/settings.controller");
const settings_schema_1 = require("../validators/settings.schema");
async function settingsRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/organization', settings_controller_1.getOrganizationHandler);
    server.put('/organization', { schema: { body: settings_schema_1.updateOrganizationSchema } }, settings_controller_1.updateOrganizationHandler);
    server.get('/clinics', settings_controller_1.getClinicsHandler);
    server.get('/providers', settings_controller_1.getProvidersHandler);
}
