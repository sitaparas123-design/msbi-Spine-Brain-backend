"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reputationService = exports.ReputationService = void 0;
const db_1 = __importDefault(require("../plugins/db"));
class ReputationService {
    async getReviews() {
        return db_1.default.review.findMany({
            include: {
                clinic: true,
                provider: true,
            },
            orderBy: { date: 'desc' },
        });
    }
    async getClinicRatings() {
        return db_1.default.clinic.findMany({
            include: {
                reviews: {
                    select: { rating: true }
                }
            }
        });
    }
    async getProviderRatings() {
        return db_1.default.provider.findMany({
            include: {
                reviews: {
                    select: { rating: true }
                }
            }
        });
    }
    async sendReviewRequest(data) {
        return db_1.default.reviewRequest.create({
            data: {
                patientName: data.patientName,
                contactInfo: data.contactInfo,
                status: 'PENDING',
            },
        });
    }
}
exports.ReputationService = ReputationService;
exports.reputationService = new ReputationService();
