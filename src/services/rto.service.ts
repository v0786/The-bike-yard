// RTO service — registration applications.
// Uses new schema: rTOApplication model.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function createRTOApplication(data: {
  customerId: string;
  rtoLocation?: string | null;
  chassisNumber: string;
  engineNumber: string;
  applicationNum?: string | null;
}) {
  return prisma.rTOApplication.create({
    data: {
      customerId: data.customerId,
      ...(data.rtoLocation ? { rtoLocation: data.rtoLocation } : {}),
      chassisNumber: data.chassisNumber,
      engineNumber: data.engineNumber,
      applicationNum: data.applicationNum ?? null,
      status: 'SUBMITTED',
    },
  });
}

export async function getRTOApplications(filters?: {
  customerId?: string;
  status?: string;
}) {
  const where: Prisma.RTOApplicationWhereInput = {};
  if (filters?.customerId) where.customerId = filters.customerId;
  if (filters?.status) where.status = filters.status;

  return prisma.rTOApplication.findMany({
    where,
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateRTOApplication(
  id: string,
  data: Partial<{
    rtoLocation: string;
    hsrpStatus: string;
    applicationNum: string;
    status: string;
  }>
) {
  return prisma.rTOApplication.update({
    where: { id },
    data,
    include: { customer: true },
  });
}
