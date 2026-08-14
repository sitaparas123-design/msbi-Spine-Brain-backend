"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRoutes = vendorRoutes;
const vendors_controller_1 = require("../controllers/vendors.controller");
const vendors_schema_1 = require("../validators/vendors.schema");
const zod_1 = require("zod");
async function vendorRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.get('/', vendors_controller_1.getVendorsHandler);
    server.get('/renewals', vendors_controller_1.getRenewalsHandler);
    server.get('/:id', { schema: { params: zod_1.z.object({ id: zod_1.z.string().uuid() }) } }, vendors_controller_1.getVendorByIdHandler);
    server.post('/', { schema: { body: vendors_schema_1.createVendorSchema } }, vendors_controller_1.createVendorHandler);
    server.get('/:id/contracts', { schema: { params: zod_1.z.object({ id: zod_1.z.string().uuid() }) } }, vendors_controller_1.getContractsHandler);
    server.get('/:id/invoices', { schema: { params: zod_1.z.object({ id: zod_1.z.string().uuid() }) } }, vendors_controller_1.getInvoicesHandler);
}
