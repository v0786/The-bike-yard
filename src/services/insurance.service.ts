// Insurance service — insurance applications.
// Uses new schema: premiumPaise instead of premiumAmount, bikeModel required.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function createInsuranceApplication(data: {
  customerId: string;
  bikeModel: string;
  provider?: string | null;
  policyType?: string | null;
  zeroDepIncluded?: boolean;
  premiumPaise: number | bigint;
}) {
  return prisma.insuranceApplication.create({
    data: {
      customerId: data.customerId,
      bikeModel: data.bikeModel,
      ...(data.provider ? { provider: data.provider } : {}),
      ...(data.policyType ? { policyType: data.policyType } : {}),
      zeroDepIncluded: data.zeroDepIncluded ?? true,
      premiumPaise: BigInt(data.premiumPaise),
      status: 'SUBMITTED',
    },
  });
}

export async function getInsuranceApplications(filters?: {
  customerId?: string;
  status?: string;
}) {
  const where: Prisma.InsuranceApplicationWhereInput = {};
  if (filters?.customerId) where.customerId = filters.customerId;
  if (filters?.status) where.status = filters.status;

  return prisma.insuranceApplication.findMany({
    where,
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateInsuranceApplication(
  id: string,
  data: Partial<{
    provider: string;
    policyType: string;
    zeroDepIncluded: boolean;
    premiumPaise: number | bigint;
    status: string;
  }>
) {
  const update: Prisma.InsuranceApplicationUncheckedUpdateInput = { ...data };
  if (data.premiumPaise !== undefined) update.premiumPaise = BigInt(data.premiumPaise);

  return prisma.insuranceApplication.update({
    where: { id },
    data: update,
    include: { customer: true },
  });
}
