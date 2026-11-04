// Insurance service — insurance applications.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function createInsuranceApplication(data: {
  customerId: string;
  saleId?: string | null;
  provider?: string | null;
  policyType?: string | null;
  premium?: number | null;
}) {
  return prisma.insuranceApplication.create({
    data: {
      applicationNumber: `INS-${Date.now()}`,
      customerId: data.customerId,
      saleId: data.saleId || null,
      provider: data.provider || null,
      policyType: data.policyType || null,
      premiumAmount: data.premium ? BigInt(data.premium) : null,
      status: 'submitted',
      documentsSubmitted: false,
    },
  });
}

export async function getInsuranceApplications(filters?: {
  customerId?: string;
  saleId?: string;
  status?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.customerId) where.customerId = filters.customerId;
  if (filters?.saleId) where.saleId = filters.saleId;
  if (filters?.status) where.status = filters.status;

  return prisma.insuranceApplication.findMany({
    where: where as Prisma.InsuranceApplicationWhereInput,
    include: { customer: true, sale: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateInsuranceApplication(
  id: string,
  data: Partial<{
    provider: string | null;
    policyType: string | null;
    premium: number | null;
    policyNumber: string | null;
    expiryDate: Date | null;
    status: string;
    documentsSubmitted: boolean;
  }>
) {
  return prisma.insuranceApplication.update({
    where: { id },
    data,
    include: { customer: true, sale: true },
  });
}
