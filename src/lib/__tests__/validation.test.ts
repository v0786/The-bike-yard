import { describe, it, expect } from 'vitest';

// --- Validation schema tests (TESTING.md §11) ---
import {
  stockUnitCreateSchema,
  paymentCreateSchema,
  enquiryCreateSchema,
  chassisNumberSchema,
  engineNumberSchema,
  moneySchema,
  gstRateSchema,
} from '@/lib/validations';

describe('Zod validation schemas', () => {
  describe('chassisNumberSchema', () => {
    it('accepts valid chassis number', () => {
      expect(chassisNumberSchema.parse('ME4JC654K98765432')).toBe('ME4JC654K98765432');
    });
    it('rejects empty', () => {
      expect(() => chassisNumberSchema.parse('')).toThrow();
    });
    it('rejects over 50 chars', () => {
      expect(() => chassisNumberSchema.parse('a'.repeat(51))).toThrow();
    });
  });

  describe('engineNumberSchema', () => {
    it('accepts valid engine number', () => {
      expect(engineNumberSchema.parse('JC65E98765432')).toBe('JC65E98765432');
    });
  });

  describe('moneySchema', () => {
    it('accepts positive integer paise', () => {
      expect(moneySchema.parse(10000)).toBe(10000);
    });
    it('rejects negative', () => {
      expect(() => moneySchema.parse(-1)).toThrow();
    });
    it('rejects float', () => {
      expect(() => moneySchema.parse(10.5)).toThrow();
    });
  });

  describe('gstRateSchema', () => {
    it('accepts valid basis points', () => {
      expect(gstRateSchema.parse(2800)).toBe(2800);
      expect(gstRateSchema.parse(0)).toBe(0);
      expect(gstRateSchema.parse(10000)).toBe(10000);
    });
    it('rejects out of range', () => {
      expect(() => gstRateSchema.parse(10001)).toThrow();
      expect(() => gstRateSchema.parse(-1)).toThrow();
    });
    it('rejects non-integer', () => {
      expect(() => gstRateSchema.parse(28.5)).toThrow();
    });
  });

  describe('stockUnitCreateSchema', () => {
    const valid = {
      chassisNumber: 'ME4JC654K98765432',
      engineNumber: 'JC65E98765432',
      variantId: '88888888-4444-4444-8444-888888888888',
      colorName: 'Midnight Black',
      purchasePricePaise: 6500000,
      inwardDate: '2026-01-15T10:00:00.000Z',
      status: 'IN_STOCK' as const,
    };
    it('accepts valid stock unit', () => {
      expect(stockUnitCreateSchema.parse(valid)).toMatchObject(valid);
    });
    it('rejects missing chassisNumber', () => {
      expect(() => stockUnitCreateSchema.parse({ ...valid, chassisNumber: '' })).toThrow();
    });
    it('rejects invalid status', () => {
      expect(() =>
        stockUnitCreateSchema.parse({ ...valid, status: 'DELIVERY' }),
      ).toThrow();
    });
  });

  describe('paymentCreateSchema', () => {
    const valid = {
      receiptNumber: 'PAY-001',
      amountPaise: 500000,
      mode: 'upi' as const,
      receivedBy: 'Suraj Patil',
    };
    it('accepts valid payment', () => {
      expect(paymentCreateSchema.parse(valid)).toEqual(valid);
    });
    it('rejects invalid method', () => {
      expect(() => paymentCreateSchema.parse({ ...valid, mode: 'cash_app' })).toThrow();
    });
  });

  describe('enquiryCreateSchema', () => {
    const valid = {
      name: 'Rahul Sharma',
      phone: '9876543210',
      message: 'Interested in Hero Splendor',
    };
    it('accepts valid enquiry', () => {
      expect(enquiryCreateSchema.parse(valid)).toEqual(valid);
    });
    it('rejects short phone', () => {
      expect(() => enquiryCreateSchema.parse({ ...valid, phone: '123' })).toThrow();
    });
  });
});
