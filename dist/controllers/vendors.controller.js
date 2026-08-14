"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoicesHandler = exports.getContractsHandler = exports.getRenewalsHandler = exports.createVendorHandler = exports.getVendorByIdHandler = exports.getVendorsHandler = void 0;
const vendors_service_1 = require("../services/vendors.service");
const getVendorsHandler = async (request, reply) => {
    const vendors = await vendors_service_1.vendorsService.getAllVendors();
    return reply.send({ success: true, data: vendors });
};
exports.getVendorsHandler = getVendorsHandler;
const getVendorByIdHandler = async (request, reply) => {
    const vendor = await vendors_service_1.vendorsService.getVendorById(request.params.id);
    if (!vendor) {
        return reply.status(404).send({ success: false, message: 'Vendor not found' });
    }
    return reply.send({ success: true, data: vendor });
};
exports.getVendorByIdHandler = getVendorByIdHandler;
const createVendorHandler = async (request, reply) => {
    const vendor = await vendors_service_1.vendorsService.createVendor(request.body);
    return reply.status(201).send({ success: true, data: vendor });
};
exports.createVendorHandler = createVendorHandler;
const getRenewalsHandler = async (request, reply) => {
    const renewals = await vendors_service_1.vendorsService.getUpcomingRenewals();
    return reply.send({ success: true, data: renewals });
};
exports.getRenewalsHandler = getRenewalsHandler;
const getContractsHandler = async (request, reply) => {
    const contracts = await vendors_service_1.vendorsService.getVendorContracts(request.params.id);
    return reply.send({ success: true, data: contracts });
};
exports.getContractsHandler = getContractsHandler;
const getInvoicesHandler = async (request, reply) => {
    const invoices = await vendors_service_1.vendorsService.getVendorInvoices(request.params.id);
    return reply.send({ success: true, data: invoices });
};
exports.getInvoicesHandler = getInvoicesHandler;
