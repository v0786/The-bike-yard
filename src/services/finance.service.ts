// Finance service — loan applications.
// Uses new schema: loanAmountPaise, downPaymentPaise, bankPartner, tenureMonths.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function createFinanceApplication(data: {
  customerId: string;
  bikeModel: string;
  loanAmountPaise: number | bigint;
  downPaymentPaise: number | bigint;
  tenureMonths: number;
  cibilBand: string;
  bankPartner?: string | null;
}) {
  return prisma.financeApplication.create({
    data: {
      customerId: data.customerId,
      bikeModel: data.bikeModel,
      loanAmountPaise: BigInt(data.loanAmountPaise),
      downPaymentPaise: BigInt(data.downPaymentPaise),
      tenureMonths: data.tenureMonths,
      cibilBand: data.cibilBand,
      ...(data.bankPartner ? { bankPartner: data.bankPartner } : {}),
      status: 'SUBMITTED',
    },
  });
}

export async function getFinanceApplications(filters?: {
  customerId?: string;
  status?: string;
}) {
  const where: Prisma.FinanceApplicationWhereInput = {};
  if (filters?.customerId) where.customerId = filters.customerId;
  if (filters?.status) where.status = filters.status;

  return prisma.financeApplication.findMany({
    where,
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateFinanceApplication(
  id: string,
  data: Partial<{
    bankPartner: string;
    loanAmountPaise: number | bigint;
    downPaymentPaise: number | bigint;
    tenureMonths: number;
    cibilBand: string;
    status: string;
  }>
) {
  const update: Prisma.FinanceApplicationUncheckedUpdateInput = { ...data };
  if (data.loanAmountPaise !== undefined) update.loanAmountPaise = BigInt(data.loanAmountPaise);
  if (data.downPaymentPaise !== undefined)
    update.downPaymentPaise = BigInt(data.downPaymentPaise);

  return prisma.financeApplication.update({
    where: { id },
    data: update,
    include: { customer: true },
  });
}
