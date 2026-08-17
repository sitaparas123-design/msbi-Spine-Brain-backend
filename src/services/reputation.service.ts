import prisma from '../plugins/db';
import { CreateReviewRequestInput, CreateReviewInput } from '../validators/reputation.schema';

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

  async createReview(data: CreateReviewInput) {
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();
    const name = `${data.firstName.trim()} ${data.lastName.trim()}`;

    // 1. Calculate star rating from the 4 boolean questions (range: 1 to 5 stars)
    let rating = 1;
    if (data.providerAnsweredQuestions) rating++;
    if (data.providerExplainedClearly) rating++;
    if (data.staffHelpful) rating++;
    if (data.wouldRecommend) rating++;

    // 2. Find or create lead
    let lead = await prisma.lead.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    const externalReviewId = `wp_rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          source: 'Share Your Experience Form',
          status: 'New',
          leadPlatform: 'wordpress',
          externalLeadId: externalReviewId
        }
      });
    }

    // 3. Normalize providerId and clinicId (convert empty strings to null)
    const providerId = data.providerId && data.providerId.trim() !== '' ? data.providerId : null;
    const clinicId = data.clinicId && data.clinicId.trim() !== '' ? data.clinicId : null;

    // 4. Create Review
    return prisma.review.create({
      data: {
        platform: 'Website',
        rating: rating,
        comment: data.comment,
        authorName: name,
        date: new Date(),
        clinicId,
        providerId,
        externalReviewId,
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        phone,
        providerAnsweredQuestions: data.providerAnsweredQuestions,
        providerExplainedClearly: data.providerExplainedClearly,
        staffHelpful: data.staffHelpful,
        wouldRecommend: data.wouldRecommend,
      }
    });
  }
}

export const reputationService = new ReputationService();
