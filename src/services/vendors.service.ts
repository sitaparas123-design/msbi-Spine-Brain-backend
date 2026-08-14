import prisma from '../plugins/db';
import { CreateVendorInput } from '../validators/vendors.schema';

export class VendorsService {
  async getAllVendors() {
    return prisma.vendor.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async getVendorById(id: string) {
    return prisma.vendor.findUnique({
      where: { id },
      include: {
        contacts: true,
        contracts: true,
        invoices: true,
      },
    });
  }

  async createVendor(data: CreateVendorInput) {
    return prisma.vendor.create({
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

    return prisma.contract.findMany({
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

  async getVendorContracts(vendorId: string) {
    return prisma.contract.findMany({
      where: { vendorId },
      orderBy: { startDate: 'desc' }
    });
  }

  async getVendorInvoices(vendorId: string) {
    return prisma.invoice.findMany({
      where: { vendorId },
      orderBy: { dueDate: 'desc' }
    });
  }
}

export const vendorsService = new VendorsService();
