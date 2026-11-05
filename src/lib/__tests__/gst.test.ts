import { describe, it, expect } from 'vitest';

// --- GST calculation tests (TESTING.md §2) ---
import { splitGst, isValidGstRate, toPaise, toRupees, formatInr } from '@/lib/currency';

describe('GST calculation (CGST/SGST/IGST split)', () => {
  it('splits intra-state (MH=27) equally between CGST and SGST', () => {
    const result = splitGst(100000n, 2800, false);
    expect(result.cgstPaise).toBe(14000n);
    expect(result.sgstPaise).toBe(14000n);
    expect(result.igstPaise).toBe(0n);
    expect(result.totalWithGstPaise).toBe(128000n);
  });

  it('assigns all GST to IGST for inter-state', () => {
    const result = splitGst(100000n, 2800, true);
    expect(result.cgstPaise).toBe(0n);
    expect(result.sgstPaise).toBe(0n);
    expect(result.igstPaise).toBe(28000n);
  });

  it('handles odd GST amounts (sum preserved)', () => {
    const result = splitGst(100100n, 2800, false);
    expect(result.cgstPaise + result.sgstPaise + result.igstPaise).toBe(
      result.gstAmountPaise,
    );
    expect(result.cgstPaise).toBe(14014n);
    expect(result.sgstPaise).toBe(14014n);
    expect(result.igstPaise).toBe(0n);
  });

  it('valid GST rate in basis points', () => {
    expect(isValidGstRate(2800)).toBe(true); // 28.00%
    expect(isValidGstRate(0)).toBe(true);
    expect(isValidGstRate(10000)).toBe(true); // 100.00%
    expect(isValidGstRate(500)).toBe(true); // 5.00%
    expect(isValidGstRate(-1)).toBe(false);
    expect(isValidGstRate(10001)).toBe(false);
    expect(isValidGstRate(28.5)).toBe(false);
  });
});

describe('Money handling (integer paise)', () => {
  it('toPaise converts rupees to paise', () => {
    expect(toPaise(100)).toBe(10000n);
    expect(toPaise(99.99)).toBe(9999n);
  });
  it('toRupees converts paise to rupees', () => {
    expect(toRupees(10000)).toBe(100);
    expect(toRupees(9999)).toBe(99.99);
  });
  it('formatInr formats currency', () => {
    expect(formatInr(10000)).toContain('100');
    expect(formatInr(0)).toBe('₹0');
  });
});
