// RTO service — registration applications.

import { prisma } from "@/lib/prisma"

export async function createRTOApplication(data: {
  customerId: string
  saleId?: string | null
  vehicleClass?: string | null
}) {
  return prisma.rTOApplication.create({
    data: {
      applicationNumber: `RTO-${Date.now()}`,
      customerId: data.customerId,
      saleId: data.saleId || null,
      vehicleClass: data.vehicleClass || null,
      registrationNumber: null,
      status: "submitted",
      documentsSubmitted: false,
    },
  })
}

export async function getRTOApplications(filters?: {
  customerId?: string
  saleId?: string
  status?: string
}) {
  return prisma.rTOApplication.findMany({
    where: {
      customerId: filters?.customerId || undefined,
      saleId: filters?.saleId || undefined,
      status: filters?.status || undefined,
    },
    include: { customer: true, sale: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateRTOApplication(
  id: string,
  data: Partial<{
    vehicleClass: string | null
    registrationNumber: string | null
    status: string
    documentsSubmitted: boolean
  }>
) {
  return prisma.rTOApplication.update({
    where: { id },
    data,
    include: { customer: true, sale: true },
  })
}
