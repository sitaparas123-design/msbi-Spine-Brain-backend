"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorsService = exports.VendorsService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
class VendorsService {
    async getAllVendors() {
        return db_1.default.vendor.findMany({
            orderBy: { name: 'asc' }
        });
    }
    async getVendorById(id) {
        return db_1.default.vendor.findUnique({
            where: { id },
            include: {
                contacts: true,
                contracts: true,
                invoices: true,
            },
        });
    }
    async createVendor(data) {
        return db_1.default.vendor.create({
            data: {
                name: data.name,
                category: data.category,
                performanceScore: data.performanceScore,
            },
        });
    }
    async getUpcomingRenewals() {
        // Get contracts renewing in the next 90 days
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
        return db_1.default.contract.findMany({
            where: {
                renewalDate: {
                    lte: ninetyDaysFromNow,
                    gte: new Date()
                }
            },
            include: { vendor: true },
            orderBy: { renewalDate: 'asc' }
        });
    }
    async getVendorContracts(vendorId) {
        return db_1.default.contract.findMany({
            where: { vendorId },
            orderBy: { startDate: 'desc' }
        });
    }
    async getVendorInvoices(vendorId) {
        return db_1.default.invoice.findMany({
            where: { vendorId },
            orderBy: { dueDate: 'desc' }
        });
    }
}
exports.VendorsService = VendorsService;
exports.vendorsService = new VendorsService();
