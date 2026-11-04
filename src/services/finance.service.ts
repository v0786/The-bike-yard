// Finance service — loan applications.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function createFinanceApplication(data: {
  customerId: string;
  saleId?: string | null;
  financeType?: string | null;
  lender?: string | null;
  loanAmount?: number | null;
  downPayment?: number | null;
  interestRate?: number | null;
  tenureMonths?: number | null;
  emiAmount?: number | null;
}) {
  return prisma.financeApplication.create({
    data: {
      applicationNumber: `FIN-${Date.now()}`,
      customerId: data.customerId,
      saleId: data.saleId || null,
      financeType: data.financeType || 'loan',
      amountRequested: BigInt(data.loanAmount || 0),
      interestRate: data.interestRate || 0,
      tenureMonths: data.tenureMonths || 0,
      emiAmount: BigInt(data.emiAmount || 0),
      status: 'submitted',
      documentsSubmitted: false,
    },
  });
}

export async function getFinanceApplications(filters?: {
  customerId?: string;
  saleId?: string;
  status?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.customerId) where.customerId = filters.customerId;
  if (filters?.saleId) where.saleId = filters.saleId;
  if (filters?.status) where.status = filters.status;

  return prisma.financeApplication.findMany({
    where: where as Prisma.FinanceApplicationWhereInput,
    include: { customer: true, sale: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateFinanceApplication(
  id: string,
  data: Partial<{
    lender: string | null;
    loanAmount: number | null;
    downPayment: number | null;
    interestRate: number | null;
    tenureMonths: number | null;
    emiAmount: number | null;
    status: string;
    documentsSubmitted: boolean;
  }>
) {
  return prisma.financeApplication.update({
    where: { id },
    data: data as Prisma.FinanceApplicationUncheckedUpdateInput,
    include: { customer: true, sale: true },
  });
}
