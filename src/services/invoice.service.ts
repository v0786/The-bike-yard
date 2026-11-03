// Invoice service — GST invoices with CGST/SGST/IGST split.

import { prisma } from "@/lib/prisma"
import { splitGst } from "@/lib/currency"

export async function createInvoice(data: {
  saleId: string
  type?: string
  gstRate: number
  placeOfSupply: string
  hsnCode?: string | null
  customerGstin?: string | null
  createdById: string
}) {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: { id: data.saleId },
      include: { customer: true },
    })
    if (!sale) throw new Error("Sale not found")

    // Compute GST split
    const { cgst, sgst, igst } = splitGst(sale.gstAmount, data.placeOfSupply, data.gstRate)
    const subtotal = sale.finalSellingPrice - sale.gstAmount
    const total = subtotal + sale.gstAmount

    // Generate invoice number
    const count = await tx.invoice.count()
    const invoiceNumber = `TBY/${new Date().getFullYear()}/${String(count + 1).padStart(4, "0")}`

    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        saleId: data.saleId,
        type: data.type || "tax_invoice",
        subtotal,
        gstAmount: sale.gstAmount,
        cgstAmount: cgst,
        sgstAmount: sgst,
        igstAmount: igst,
        total,
        gstRate: data.gstRate,
        placeOfSupply: data.placeOfSupply,
        hsnCode: data.hsnCode || null,
        gstin: null, // TODO: from dealership settings
        customerGstin: data.customerGstin || null,
        status: "issued",
        createdById: data.createdById,
      },
      include: { sale: true },
    })

    return invoice
  })
}

export async function getInvoices(filters?: { saleId?: string; status?: string }) {
  return prisma.invoice.findMany({
    where: {
      saleId: filters?.saleId || undefined,
      status: filters?.status || undefined,
    },
    include: { sale: { include: { customer: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: { sale: { include: { customer: true, stockUnit: true } } },
  })
}
