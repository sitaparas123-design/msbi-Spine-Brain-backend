"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReviewRequestHandler = exports.getProviderRatingsHandler = exports.getClinicRatingsHandler = exports.getReviewsHandler = void 0;
const reputation_service_1 = require("../services/reputation.service");
const getReviewsHandler = async (request, reply) => {
    const reviews = await reputation_service_1.reputationService.getReviews();
    return reply.send({ success: true, data: reviews });
};
exports.getReviewsHandler = getReviewsHandler;
const getClinicRatingsHandler = async (request, reply) => {
    const clinics = await reputation_service_1.reputationService.getClinicRatings();
    // Map to calculate average
    const mapped = clinics.map(c => {
        const total = c.reviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = c.reviews.length ? (total / c.reviews.length).toFixed(1) : 0;
        return { id: c.id, name: c.name, averageRating: parseFloat(String(avg)), reviewCount: c.reviews.length };
    });
    return reply.send({ success: true, data: mapped });
};
exports.getClinicRatingsHandler = getClinicRatingsHandler;
const getProviderRatingsHandler = async (request, reply) => {
    const providers = await reputation_service_1.reputationService.getProviderRatings();
    // Map to calculate average
    const mapped = providers.map(p => {
        const total = p.reviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = p.reviews.length ? (total / p.reviews.length).toFixed(1) : 0;
        return { id: p.id, name: p.name, averageRating: parseFloat(String(avg)), reviewCount: p.reviews.length };
    });
    return reply.send({ success: true, data: mapped });
};
exports.getProviderRatingsHandler = getProviderRatingsHandler;
const sendReviewRequestHandler = async (request, reply) => {
    const reviewRequest = await reputation_service_1.reputationService.sendReviewRequest(request.body);
    return reply.status(201).send({ success: true, data: reviewRequest });
};
exports.sendReviewRequestHandler = sendReviewRequestHandler;
