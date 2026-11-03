import { describe, it, expect } from "vitest"
import { formatInr, toPaise, toRupees, splitGst, isValidGstRate } from "../currency"

describe("currency", () => {
  describe("formatInr", () => {
    it("formats zero paise", () => {
      expect(formatInr(0)).toBe("₹0")
    })
    it("formats rupees correctly", () => {
      expect(formatInr(10000)).toContain("100")
    })
    it("handles null/undefined", () => {
      expect(formatInr(null)).toBe("₹0")
      expect(formatInr(undefined)).toBe("₹0")
    })
  })

  describe("toPaise", () => {
    it("converts rupees to paise", () => {
      expect(toPaise(100)).toBe(10000)
      expect(toPaise(99.99)).toBe(9999)
    })
  })

  describe("toRupees", () => {
    it("converts paise to rupees", () => {
      expect(toRupees(10000)).toBe(100)
      expect(toRupees(9999)).toBe(99.99)
    })
  })

  describe("splitGst", () => {
    it("splits intra-state (MH) equally between CGST and SGST", () => {
      const result = splitGst(1000, "27", 2800)
      expect(result.cgst).toBe(500)
      expect(result.sgst).toBe(500)
      expect(result.igst).toBe(0)
    })
    it("assigns all GST to IGST for inter-state", () => {
      const result = splitGst(1000, "29", 2800)
      expect(result.cgst).toBe(0)
      expect(result.sgst).toBe(0)
      expect(result.igst).toBe(1000)
    })
    it("preserves total GST amount", () => {
      const gstAmount = 1960000
      const result = splitGst(gstAmount, "27", 2800)
      expect(result.cgst + result.sgst + result.igst).toBe(gstAmount)
    })
  })

  describe("isValidGstRate", () => {
    it("accepts valid basis point rates", () => {
      expect(isValidGstRate(0)).toBe(true)
      expect(isValidGstRate(500)).toBe(true)
      expect(isValidGstRate(2800)).toBe(true)
      expect(isValidGstRate(10000)).toBe(true)
    })
    it("rejects invalid rates", () => {
      expect(isValidGstRate(-1)).toBe(false)
      expect(isValidGstRate(10001)).toBe(false)
      expect(isValidGstRate(28.5)).toBe(false)
    })
  })
})
