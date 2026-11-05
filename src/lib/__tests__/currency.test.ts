import { describe, it, expect } from 'vitest';
import { formatInr, toPaise, toRupees, splitGst, isValidGstRate } from '../currency';

describe('currency', () => {
  describe('formatInr', () => {
    it('formats zero paise', () => {
      expect(formatInr(0)).toBe('₹0');
    });
    it('formats rupees correctly', () => {
      expect(formatInr(10000)).toContain('100');
    });
    it('handles null/undefined', () => {
      expect(formatInr(null)).toBe('₹0');
      expect(formatInr(undefined)).toBe('₹0');
    });
  });

  describe('toPaise', () => {
    it('converts rupees to paise', () => {
      expect(toPaise(100)).toBe(10000n);
      expect(toPaise(99.99)).toBe(9999n);
    });
    it('converts comma-formatted rupee strings', () => {
      expect(toPaise('1,49,900')).toBe(14990000n);
    });
  });

  describe('toRupees', () => {
    it('converts paise to rupees', () => {
      expect(toRupees(10000)).toBe(100);
      expect(toRupees(9999)).toBe(99.99);
    });
  });

  describe('splitGst', () => {
    const TAXABLE = 100000n; // ₹1,000

    it('splits intra-state (MH) equally between CGST and SGST', () => {
      const result = splitGst(TAXABLE, 2800, false);
      expect(result.gstAmountPaise).toBe(28000n);
      expect(result.cgstPaise).toBe(14000n);
      expect(result.sgstPaise).toBe(14000n);
      expect(result.igstPaise).toBe(0n);
      expect(result.totalWithGstPaise).toBe(128000n);
    });
    it('assigns all GST to IGST for inter-state', () => {
      const result = splitGst(TAXABLE, 2800, true);
      expect(result.cgstPaise).toBe(0n);
      expect(result.sgstPaise).toBe(0n);
      expect(result.igstPaise).toBe(28000n);
    });
    it('preserves total GST amount', () => {
      const result = splitGst(7000000n, 2800, false);
      expect(result.cgstPaise + result.sgstPaise + result.igstPaise).toBe(
        result.gstAmountPaise,
      );
    });
  });

  describe('isValidGstRate', () => {
    it('accepts valid basis point rates', () => {
      expect(isValidGstRate(0)).toBe(true);
      expect(isValidGstRate(500)).toBe(true);
      expect(isValidGstRate(2800)).toBe(true);
      expect(isValidGstRate(10000)).toBe(true);
    });
    it('rejects invalid rates', () => {
      expect(isValidGstRate(-1)).toBe(false);
      expect(isValidGstRate(10001)).toBe(false);
      expect(isValidGstRate(28.5)).toBe(false);
    });
  });
});
