"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsService = exports.SettingsService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
class SettingsService {
    async getOrganization() {
        return db_1.default.organization.findFirst();
    }
    async updateOrganization(data) {
        const org = await db_1.default.organization.findFirst();
        if (!org) {
            return db_1.default.organization.create({
                data: {
                    name: data.name || 'Default Org',
                    timezone: data.timezone,
                    currency: data.currency,
                },
            });
        }
        return db_1.default.organization.update({
            where: { id: org.id },
            data,
        });
    }
    async getClinics() {
        return db_1.default.clinic.findMany();
    }
    async getProviders() {
        return db_1.default.provider.findMany({
            include: { clinic: true }
        });
    }
}
exports.SettingsService = SettingsService;
exports.settingsService = new SettingsService();
