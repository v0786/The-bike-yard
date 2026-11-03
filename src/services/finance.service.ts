// Finance service — loan applications.

import { prisma } from '@/lib/prisma';

export async function createFinanceApplication(data: {
  customerId: string;
  saleId?: string | null;
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
      amountRequested: data.loanAmount || 0,
      interestRate: data.interestRate || 0,
      tenureMonths: data.tenureMonths || 0,
      emiAmount: data.emiAmount || 0,
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
  return prisma.financeApplication.findMany({
      where: {
        ...(filters?.customerId && { customerId: filters.customerId }),
        ...(filters?.saleId && { saleId: filters.saleId }),
        ...(filters?.status && { status: filters.status }),
      },
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
