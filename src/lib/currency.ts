// Money handling — all monetary values stored as integer paise (BIGINT).
// Never use floating-point for currency.

/** Format paise to INR display string */
export function formatInr(paise: number | bigint | null | undefined): string {
  if (paise == null) return '₹0';
  const rupees = Number(paise) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/** Convert rupees (number or comma-formatted string) to paise integer (bigint) */
export function toPaise(rupees: number | string): bigint {
  const numeric = typeof rupees === 'string' ? Number(rupees.replace(/,/g, '')) : rupees;
  if (!Number.isFinite(numeric)) {
    throw new Error(`Invalid rupee amount: ${rupees}`);
  }
  return BigInt(Math.round(numeric * 100));
}

/** Convert paise to rupees number */
export function toRupees(paise: number | bigint): number {
  return Number(paise) / 100;
}

/**
 * GST split from a taxable amount in paise.
 * Returns the GST amount plus its CGST/SGST (intra-state) or IGST (inter-state) split.
 * All amounts are BigInt paise.
 */
export function splitGst(
  taxablePaise: number | bigint,
  gstRateBps: number,
  isInterState: boolean,
) {
  const taxable = BigInt(taxablePaise);
  const gstAmountPaise = (taxable * BigInt(gstRateBps)) / 10000n;
  const cgstPaise = isInterState ? 0n : gstAmountPaise / 2n;
  const sgstPaise = isInterState ? 0n : gstAmountPaise - cgstPaise;
  const igstPaise = isInterState ? gstAmountPaise : 0n;

  return {
    taxablePaise: taxable,
    gstRateBps,
    gstAmountPaise,
    cgstPaise,
    sgstPaise,
    igstPaise,
    totalWithGstPaise: taxable + gstAmountPaise,
  };
}

/** Validate GST rate in basis points (0-10000) */
export function isValidGstRate(rate: number): boolean {
  return Number.isInteger(rate) && rate >= 0 && rate <= 10000;
}

/** Format paise to INR with exact 2 decimal places (e.g., ₹2,14,000.00) */
export function formatInrExact(paise: number | bigint): string {
  const rupees = Number(paise) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}
