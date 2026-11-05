// Invoice service — GST invoices with CGST/SGST/IGST split.
// Uses new schema: gstAmountPaise, cgstAmountPaise, sgstAmountPaise, igstAmountPaise,
// taxableAmountPaise, totalInvoicePaise, gstRateBps.

import { prisma } from '@/lib/prisma';
import { splitGst } from '@/lib/currency';
import type { Prisma } from '@prisma/client';

export async function createInvoice(data: {
  saleId: string;
  dealershipId: string;
  gstRateBps?: number;
  placeOfSupply?: string;
  gstin?: string | null;
  customerGstin?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: { id: data.saleId },
      include: { customer: true },
    });
    if (!sale) throw new Error('Sale not found');

    const dealership = await tx.dealership.findUnique({
      where: { id: data.dealershipId },
    });
    if (!dealership) throw new Error('Dealership not found');

    // Compute GST split (sale.gstAmountPaise is stored as BigInt paise)
    const gstRate = data.gstRateBps ?? 1800;
    const taxableAmount = sale.totalOnRoadPaise - sale.gstAmountPaise;
    const split = splitGst(taxableAmount, gstRate, false);

    // Generate invoice number from the dealership prefix
    const count = await tx.invoice.count();
    const invoiceNumber = `${dealership.invoicePrefix}${String(count + 1).padStart(4, '0')}`;

    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        saleId: data.saleId,
        dealershipId: data.dealershipId,
        gstin: data.gstin ?? dealership.gstin,
        customerGstin: data.customerGstin ?? null,
        placeOfSupply: data.placeOfSupply ?? `${dealership.stateCode}-${dealership.state}`,
        gstRateBps: gstRate,
        taxableAmountPaise: split.taxablePaise,
        cgstAmountPaise: split.cgstPaise,
        sgstAmountPaise: split.sgstPaise,
        igstAmountPaise: split.igstPaise,
        totalInvoicePaise: split.totalWithGstPaise,
      },
    });

    return invoice;
  });
}

export async function getInvoices(filters?: { saleId?: string; status?: string }) {
  const where: Prisma.InvoiceWhereInput = {};
  if (filters?.saleId) where.saleId = filters.saleId;

  return prisma.invoice.findMany({
    where,
    include: { sale: { include: { customer: true } } },
    orderBy: { issuedAt: 'desc' },
  });
}

export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: { sale: { include: { customer: true } } },
  });
}
