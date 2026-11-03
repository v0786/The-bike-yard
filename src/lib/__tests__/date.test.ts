import { describe, it, expect } from "vitest"
import { formatDisplayDate, parseDisplayDate, startOfDayUtc, endOfDayUtc, toKolkataString } from "../date"

describe("date", () => {
  describe("formatDisplayDate", () => {
    it("formats date as DD/MM/YYYY", () => {
      const d = new Date(Date.UTC(2026, 10, 3, 10, 0, 0))
      expect(formatDisplayDate(d)).toBe("03/11/2026")
    })
  })

  describe("parseDisplayDate", () => {
    it("parses DD/MM/YYYY to Date", () => {
      const d = parseDisplayDate("03/11/2026")
      expect(d).not.toBeNull()
      expect(d!.getUTCDate()).toBe(3)
      expect(d!.getUTCMonth()).toBe(10)
      expect(d!.getUTCFullYear()).toBe(2026)
    })
    it("returns null for invalid input", () => {
      expect(parseDisplayDate("invalid")).toBeNull()
    })
  })

  describe("startOfDayUtc / endOfDayUtc", () => {
    it("returns start of day in UTC", () => {
      const d = new Date(Date.UTC(2026, 10, 3, 15, 30, 45))
      const start = startOfDayUtc(d)
      expect(start.getUTCHours()).toBe(0)
      expect(start.getUTCMinutes()).toBe(0)
      expect(start.getUTCSeconds()).toBe(0)
    })
    it("returns end of day in UTC", () => {
      const d = new Date(Date.UTC(2026, 10, 3, 15, 30, 45))
      const end = endOfDayUtc(d)
      expect(end.getUTCHours()).toBe(23)
      expect(end.getUTCMinutes()).toBe(59)
    })
  })

  describe("toKolkataString", () => {
    it("converts UTC to Kolkata time (+05:30)", () => {
      const d = new Date(Date.UTC(2026, 10, 3, 4, 30, 0)) // 04:30 UTC
      const result = toKolkataString(d)
      expect(result).toContain("10:00") // 10:00 IST
      expect(result).toMatch(/\+05:30$/)
    })
  })
})
