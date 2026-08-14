import { FastifyRequest, FastifyReply } from 'fastify';
import { reputationService } from '../services/reputation.service';
import { CreateReviewRequestInput } from '../validators/reputation.schema';

export const getReviewsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const reviews = await reputationService.getReviews();
  return reply.send({ success: true, data: reviews });
};

export const getClinicRatingsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const clinics = await reputationService.getClinicRatings();
  // Map to calculate average
  const mapped = clinics.map(c => {
    const total = c.reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = c.reviews.length ? (total / c.reviews.length).toFixed(1) : 0;
    return { id: c.id, name: c.name, averageRating: parseFloat(String(avg)), reviewCount: c.reviews.length };
  });
  return reply.send({ success: true, data: mapped });
};

export const getProviderRatingsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const providers = await reputationService.getProviderRatings();
  // Map to calculate average
  const mapped = providers.map(p => {
    const total = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = p.reviews.length ? (total / p.reviews.length).toFixed(1) : 0;
    return { id: p.id, name: p.name, averageRating: parseFloat(String(avg)), reviewCount: p.reviews.length };
  });
  return reply.send({ success: true, data: mapped });
};

export const sendReviewRequestHandler = async (
  request: FastifyRequest<{ Body: CreateReviewRequestInput }>,
  reply: FastifyReply
) => {
  const reviewRequest = await reputationService.sendReviewRequest(request.body);
  return reply.status(201).send({ success: true, data: reviewRequest });
};
