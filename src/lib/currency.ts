// Money handling — all monetary values stored as integer paise (BIGINT).
// Never use floating-point for currency.

/** Format paise to INR display string */
export function formatInr(paise: number | null | undefined): string {
  if (paise == null) return "₹0"
  const rupees = paise / 100
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees)
}

/** Convert rupees (number) to paise integer */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

/** Convert paise to rupees number */
export function toRupees(paise: number): number {
  return paise / 100
}

/** GST split — returns { cgst, sgst, igst } in paise */
export function splitGst(gstAmount: number, placeOfSupply: string, gstRate: number) {
  const isIntraState = placeOfSupply === "27" // Maharashtra state code
  const cgst = isIntraState ? Math.floor(gstAmount / 2) : 0
  const sgst = isIntraState ? Math.floor(gstAmount / 2) : 0
  const igst = isIntraState ? 0 : gstAmount
  return { cgst, sgst, igst }
}

/** Validate GST rate in basis points (0-10000) */
export function isValidGstRate(rate: number): boolean {
  return Number.isInteger(rate) && rate >= 0 && rate <= 10000
}
