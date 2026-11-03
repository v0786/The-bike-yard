// PDF generation stub per ARCHITECTURE §8
export async function generateInvoicePdf(invoiceId: string) {
  return Buffer.from(`INVOICE-${invoiceId}`);
}
