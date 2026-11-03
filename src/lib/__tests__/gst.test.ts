import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// --- GST calculation tests (TESTING.md §2) ---
import { splitGst, isValidGstRate, toPaise, toRupees, formatInr } from "@/lib/currency"

describe("GST calculation (CGST/SGST/IGST split)", () => {
  it("splits intra-state (MH=27) equally between CGST and SGST", () => {
    const result = splitGst(1000, "27", 2800)
    expect(result.cgst).toBe(500)
    expect(result.sgst).toBe(500)
    expect(result.igst).toBe(0)
    expect(result.cgst + result.sgst + result.igst).toBe(1000)
  })

  it("assigns all GST to IGST for inter-state", () => {
    const result = splitGst(1000, "29", 2800)
    expect(result.cgst).toBe(0)
    expect(result.sgst).toBe(0)
    expect(result.igst).toBe(1000)
  })

  it("handles odd GST amounts (sum preserved)", () => {
    const result = splitGst(1001, "27", 2800)
    expect(result.cgst + result.sgst + result.igst).toBe(1001)
    expect(result.cgst).toBe(500)
    expect(result.sgst).toBe(501)
    expect(result.igst).toBe(0)
  })

  it("valid GST rate in basis points", () => {
    expect(isValidGstRate(2800)).toBe(true) // 28.00%
    expect(isValidGstRate(0)).toBe(true)
    expect(isValidGstRate(10000)).toBe(true) // 100.00%
    expect(isValidGstRate(500)).toBe(true) // 5.00%
    expect(isValidGstRate(-1)).toBe(false)
    expect(isValidGstRate(10001)).toBe(false)
    expect(isValidGstRate(28.5)).toBe(false)
  })
})

describe("Money handling (integer paise)", () => {
  it("toPaise converts rupees to paise", () => {
    expect(toPaise(100)).toBe(10000)
    expect(toPaise(99.99)).toBe(9999)
  })
  it("toRupees converts paise to rupees", () => {
    expect(toRupees(10000)).toBe(100)
    expect(toRupees(9999)).toBe(99.99)
  })
  it("formatInr formats currency", () => {
    expect(formatInr(10000)).toContain("100")
    expect(formatInr(0)).toBe("₹0")
  })
})
