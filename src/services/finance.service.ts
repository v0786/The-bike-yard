// Finance service — loan applications.

import { prisma } from "@/lib/prisma"

export async function createFinanceApplication(data: {
  customerId: string
  saleId?: string | null
  lender?: string | null
  loanAmount?: number | null
  downPayment?: number | null
  interestRate?: number | null
  tenureMonths?: number | null
  emiAmount?: number | null
}) {
  return prisma.financeApplication.create({
    data: {
      applicationNumber: `FIN-${Date.now()}`,
      customerId: data.customerId,
      saleId: data.saleId || null,
      lender: data.lender || null,
      loanAmount: data.loanAmount || null,
      downPayment: data.downPayment || null,
      interestRate: data.interestRate || null,
      tenureMonths: data.tenureMonths || null,
      emiAmount: data.emiAmount || null,
      status: "submitted",
      documentsSubmitted: false,
    },
  })
}

export async function getFinanceApplications(filters?: {
  customerId?: string
  saleId?: string
  status?: string
}) {
  return prisma.financeApplication.findMany({
    where: {
      customerId: filters?.customerId || undefined,
      saleId: filters?.saleId || undefined,
      status: filters?.status || undefined,
    },
    include: { customer: true, sale: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateFinanceApplication(
  id: string,
  data: Partial<{
    lender: string | null
    loanAmount: number | null
    downPayment: number | null
    interestRate: number | null
    tenureMonths: number | null
    emiAmount: number | null
    status: string
    documentsSubmitted: boolean
  }>
) {
  return prisma.financeApplication.update({
    where: { id },
    data,
    include: { customer: true, sale: true },
  })
}
