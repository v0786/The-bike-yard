// Invoice service — GST invoices with CGST/SGST/IGST split.
// All mutations run in Prisma transactions per DATABASE.md §9.

import { prisma } from '@/lib/prisma';
import { splitGst } from '@/lib/currency';
import type { Prisma } from '@prisma/client';

export async function createInvoice(data: {
  saleId: string;
  type?: string;
  gstRate: number;
  placeOfSupply: string;
  hsnCode?: string | null;
  customerGstin?: string | null;
  createdById: string;
}) {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: { id: data.saleId },
      include: { customer: true },
    });
    if (!sale) throw new Error('Sale not found');

    // Compute GST split (sale.gstAmount is stored as BigInt paise)
    const { cgst, sgst, igst } = splitGst(Number(sale.gstAmount), data.placeOfSupply, data.gstRate);
    const subtotal = sale.finalSellingPrice - sale.gstAmount;
    const total = subtotal + sale.gstAmount;

    // Generate invoice number
    const count = await tx.invoice.count();
    const invoiceNumber = `TBY/${new Date().getFullYear()}/${String(count + 1).padStart(4, '0')}`;

    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        saleId: data.saleId,
        type: data.type || 'tax_invoice',
        subtotal,
        gstAmount: sale.gstAmount,
        cgstAmount: BigInt(cgst),
        sgstAmount: BigInt(sgst),
        igstAmount: BigInt(igst),
        total,
        gstRate: data.gstRate,
        placeOfSupply: data.placeOfSupply,
        hsnCode: data.hsnCode || null,
        gstin: null, // TODO: from dealership settings (owner decision)
        customerGstin: data.customerGstin || null,
        status: 'issued',
        createdBy: data.createdById,
      },
      include: { sale: true },
    });

    return invoice;
  });
}

export async function getInvoices(filters?: { saleId?: string; status?: string }) {
  const where: Record<string, unknown> = {};
  if (filters?.saleId) where.saleId = filters.saleId;
  if (filters?.status) where.status = filters.status;

  return prisma.invoice.findMany({
    where: where as Prisma.InvoiceWhereInput,
    include: { sale: { include: { customer: true } } },
    orderBy: { createdAt: 'desc' } as Prisma.InvoiceOrderByWithRelationInput,
  });
}

export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: { sale: { include: { customer: true, stockUnit: true } } },
  });
}
