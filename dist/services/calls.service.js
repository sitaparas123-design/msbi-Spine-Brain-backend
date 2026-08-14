"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callsService = exports.CallsService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
class CallsService {
    async createCall(data) {
        const callLog = await db_1.default.callLog.create({
            data: {
                caller: data.caller,
                phone: data.phone,
                duration: data.duration,
                campaign: data.campaign,
                status: data.status || 'Missed',
                location: data.location,
                audioUrl: data.audioUrl,
            },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const snapshot = await db_1.default.analyticsSnapshot.findFirst({
            where: { date: today }
        });
        if (snapshot) {
            await db_1.default.analyticsSnapshot.update({
                where: { id: snapshot.id },
                data: {
                    calls: { increment: 1 }
                }
            });
        }
        else {
            await db_1.default.analyticsSnapshot.create({
                data: {
                    date: today,
                    calls: 1,
                }
            });
        }
        return callLog;
    }
    async getCalls() {
        return db_1.default.callLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 50,
        });
    }
}
exports.CallsService = CallsService;
exports.callsService = new CallsService();
