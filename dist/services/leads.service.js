"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsService = exports.LeadsService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
class LeadsService {
    async createLead(data) {
        // 1. Create the lead in the database
        const lead = await db_1.default.lead.create({
            data: {
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                condition: data.condition || null,
                source: data.source || 'Website Contact Form',
                status: 'New',
            },
        });
        // 2. Also increment the analytics snapshot for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const snapshot = await db_1.default.analyticsSnapshot.findFirst({
            where: { date: today }
        });
        if (snapshot) {
            await db_1.default.analyticsSnapshot.update({
                where: { id: snapshot.id },
                data: {
                    leads: { increment: 1 },
                    formSubmissions: { increment: 1 }
                }
            });
        }
        else {
            await db_1.default.analyticsSnapshot.create({
                data: {
                    date: today,
                    leads: 1,
                    formSubmissions: 1,
                }
            });
        }
        return lead;
    }
    async getLeads() {
        return db_1.default.lead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
}
exports.LeadsService = LeadsService;
exports.leadsService = new LeadsService();
