import prisma from '../plugins/db';
import { CreateReviewRequestInput } from '../validators/reputation.schema';

export class ReputationService {
  async getReviews() {
    return prisma.review.findMany({
      include: {
        clinic: true,
        provider: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async getClinicRatings() {
    return prisma.clinic.findMany({
      include: {
        reviews: {
          select: { rating: true }
        }
      }
    });
  }

  async getProviderRatings() {
    return prisma.provider.findMany({
      include: {
        reviews: {
          select: { rating: true }
        }
      }
    });
  }

  async sendReviewRequest(data: CreateReviewRequestInput) {
    return prisma.reviewRequest.create({
      data: {
        patientName: data.patientName,
        contactInfo: data.contactInfo,
        status: 'PENDING',
      },
    });
  }
}

export const reputationService = new ReputationService();
