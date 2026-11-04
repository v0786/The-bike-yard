// RTO service — registration applications.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function createRTOApplication(data: {
  customerId: string;
  saleId?: string | null;
  vehicleClass?: string | null;
}) {
  return prisma.rTOApplication.create({
    data: {
      applicationNumber: `RTO-${Date.now()}`,
      customerId: data.customerId,
      saleId: data.saleId || null,
      vehicleClass: data.vehicleClass || null,
      registrationNumber: null,
      status: 'submitted',
      documentsSubmitted: false,
    },
  });
}

export async function getRTOApplications(filters?: {
  customerId?: string;
  saleId?: string;
  status?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.customerId) where.customerId = filters.customerId;
  if (filters?.saleId) where.saleId = filters.saleId;
  if (filters?.status) where.status = filters.status;

  return prisma.rTOApplication.findMany({
    where: where as Prisma.RTOApplicationWhereInput,
    include: { customer: true, sale: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateRTOApplication(
  id: string,
  data: Partial<{
    vehicleClass: string | null;
    registrationNumber: string | null;
    status: string;
    documentsSubmitted: boolean;
  }>
) {
  return prisma.rTOApplication.update({
    where: { id },
    data,
    include: { customer: true, sale: true },
  });
}
