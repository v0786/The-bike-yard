import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

const hasDb = !!process.env.DATABASE_URL;

describe('Integration Tests - API Routes', () => {
  if (!hasDb) {
    it('Skipped: No DATABASE_URL available for integration tests', () => {
      expect(true).toBe(true);
    });
  } else {
    beforeAll(async () => {
      // Prisma client is already initialized via @/lib/prisma singleton
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    it('Prisma client can connect and query StockUnit', async () => {
      const count = await prisma.stockUnit.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('Prisma client can query User', async () => {
      const count = await prisma.user.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('Prisma client can query Sale', async () => {
      const count = await prisma.sale.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('Prisma client can query Payment', async () => {
      const count = await prisma.payment.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('Prisma client can query Invoice', async () => {
      const count = await prisma.invoice.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('Prisma client can query Refund', async () => {
      const count = await prisma.refund.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('Prisma client can query ServiceRequest', async () => {
      const count = await prisma.serviceRequest.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('Prisma client can query FinanceApplication', async () => {
      const count = await prisma.financeApplication.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('Prisma client can query InsuranceApplication', async () => {
      const count = await prisma.insuranceApplication.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('Prisma client can query RTOApplication', async () => {
      const count = await prisma.rTOApplication.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  }
});
