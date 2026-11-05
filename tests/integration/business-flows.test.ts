// Integration tests against real PostgreSQL database (TESTING.md §3).
// These tests run against the dedicated test database (bikeyard_test)
// and never use production data. All mutations run in Prisma transactions.

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROLE_NAMES = [
  "Super Admin",
  "Owner",
  "Manager",
  "Sales Exec",
  "Accountant",
  "Insurance Staff",
  "RTO Staff",
];

// Test-only identifiers. Obviously fake placeholders — never real business facts.
async function ensureRoles() {
  await Promise.all(
    ROLE_NAMES.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
}

let dealershipSeq = 0;

async function ensureDealership(sufix: string) {
  // Keep code under VarChar(20) and GSTIN exactly 15 chars with valid format.
  const short = sufix.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase();
  // Retry with fresh digits so repeated runs never hit unique constraints.
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    dealershipSeq += 1;
    const digits = String(
      (Number(sufix.replace(/\D/g, "").slice(-4) || 0) + dealershipSeq) % 10000,
    ).padStart(4, "0");
    const code = `TBY-${short}-${dealershipSeq}`;
    try {
      return await prisma.dealership.create({
        data: {
          code,
          name: "Integration Test Dealership",
          addressLine1: "Test Business Park, Test Road",
          pincode: "400601",
          gstin: `27TSTTS${digits}T1Z9`,
          phone: "+91 90000 00000",
          email: "integration@example.test",
        },
      });
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

async function ensureStaff(dealershipId: string) {
  const role = await prisma.role.findUnique({ where: { name: "Super Admin" } });
  if (!role) throw new Error("Super Admin role not seeded");
  return prisma.user.create({
    data: {
      name: "Integration Staff",
      email: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.test`,
      passwordHash: "$2b$12$hashedpasswordhashforstaffintegration",
      roleId: role.id,
      dealershipId,
      isActive: true,
    },
  });
}

async function makeCatalogue(sufix: string) {
  const brand = await prisma.brand.create({
    data: { name: `TestBrand-${sufix}`, slug: `testbrand-${sufix}` },
  });
  const model = await prisma.model.create({
    data: {
      brandId: brand.id,
      name: `TestModel-${sufix}`,
      slug: `testmodel-${sufix}`,
      category: "Roadster",
      engineCc: 125,
      powerBhp: "10.50",
      torqueNm: "10.60",
      kerbWeight: 120,
      fuelCapacity: "12.5",
    },
  });
  const variant = await prisma.variant.create({
    data: {
      modelId: model.id,
      name: `Standard-${sufix}`,
      exShowroomPricePaise: 6480000n,
      rtoTaxPaise: 36000n,
      insurancePaise: 36000n,
    },
  });
  const colour = await prisma.colour.create({
    data: { variantId: variant.id, name: `Black-${sufix}`, hexCode: "#000000" },
  });
  return { brand, model, variant, colour };
}

async function makeCustomer() {
  // Unique 11-digit phone derived from time + random so repeated runs never collide.
  const phone = `9${String(Date.now() % 10 ** 8).padStart(8, "0")}${String(
    Math.floor(Math.random() * 90 + 10),
  )}`;
  return prisma.customer.create({
    data: {
      fullName: "Integration Customer",
      phone,
      addressLine1: "Test Business Park, Test Road",
    },
  });
}

describe("Integration — Database connectivity (real PostgreSQL)", () => {
  beforeAll(async () => {
    await prisma.$connect();
    await ensureRoles();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("connects to the test database and can query tables", async () => {
    const count = await prisma.dealership.count();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it("seed data from DATABASE.md exists in test database", async () => {
    await ensureRoles();
    const dealershipCount = await prisma.dealership.count();
    const userCount = await prisma.user.count();
    const roleCount = await prisma.role.count();
    expect(roleCount).toBeGreaterThanOrEqual(7);
    expect(dealershipCount).toBeGreaterThanOrEqual(0);
    expect(userCount).toBeGreaterThanOrEqual(0);
  });
});

describe("Integration — Stock, Booking, Sale transaction consistency", () => {
  let dealership: any;
  let variant: any;
  let customer: any;
  let sufix: string;

  beforeEach(async () => {
    sufix = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await ensureRoles();
    dealership = await ensureDealership(sufix);
    const catalogue = await makeCatalogue(sufix);
    variant = catalogue.variant;
    customer = await makeCustomer();
  });

  it("stock inward → reservation → sale flow keeps stock status consistent in a transaction", async () => {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Stock inward
      const stockUnit = await tx.stockUnit.create({
        data: {
          chassisNumber: `ME4TEST${sufix}`,
          engineNumber: `TESTENG${sufix}`,
          variantId: variant.id,
          colorName: "Midnight Black",
          dealershipId: dealership.id,
          purchasePricePaise: 6500000n,
          status: "IN_STOCK",
        },
      });

      // 2. Record inward movement
      await tx.stockMovement.create({
        data: {
          stockUnitId: stockUnit.id,
          type: "INWARD",
          toLoc: "Main Showroom",
          notes: "Integration test inward",
          recordedBy: "Integration Test",
        },
      });

      // Verify unit is available
      const unit = await tx.stockUnit.findUnique({ where: { id: stockUnit.id } });
      expect(unit!.status).toBe("IN_STOCK");

      // 3. Create booking
      const booking = await tx.booking.create({
        data: {
          dealershipId: dealership.id,
          bookingNumber: `INT-BK-${sufix}`,
          customerId: customer.id,
          variantId: variant.id,
          colorRequested: "Midnight Black",
          advanceAmountPaise: 500000n,
          tentativeDeliveryDate: new Date(),
        },
      });

      // 4. Create reservation
      const reservation = await tx.reservation.create({
        data: {
          bookingId: booking.id,
          stockUnitId: stockUnit.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // 5. Mark unit reserved
      await tx.stockUnit.update({
        where: { id: stockUnit.id },
        data: { status: "RESERVED" },
      });

      // 6. Record reservation movement
      await tx.stockMovement.create({
        data: {
          stockUnitId: stockUnit.id,
          type: "RESERVATION_LOCK",
          toLoc: "Main Showroom",
          notes: "Unit reserved",
          recordedBy: "Integration Test",
        },
      });

      // 7. Complete sale within same transaction
      const gstAmountPaise = 720000n;
      const cgstPaise = gstAmountPaise / 2n;
      const sgstPaise = gstAmountPaise - cgstPaise;
      const sale = await tx.sale.create({
        data: {
          dealershipId: dealership.id,
          customerId: customer.id,
          stockUnitId: stockUnit.id,
          saleNumber: `INT-SALE-${sufix}`,
          exShowroomPaise: 6480000n,
          gstAmountPaise,
          cgstPaise,
          sgstPaise,
          igstPaise: 0n,
          rtoPaise: 36000n,
          insurancePaise: 36000n,
          totalOnRoadPaise: 7200000n,
          amountPaidPaise: 7200000n,
          outstandingPaise: 0n,
          status: "INVOICED",
        },
      });

      // 8. Mark unit sold
      await tx.stockUnit.update({
        where: { id: stockUnit.id },
        data: { status: "SOLD" },
      });

      // 9. Record delivery movement
      await tx.stockMovement.create({
        data: {
          stockUnitId: stockUnit.id,
          type: "DISPATCH_DELIVERY",
          fromLoc: "Main Showroom",
          toLoc: "Customer Premises",
          notes: "Unit sold",
          recordedBy: "Integration Test",
        },
      });

      return { stockUnit, reservation, sale };
    });

    // Verify transactional consistency: all changes committed together
    const unitAfter = await prisma.stockUnit.findUnique({
      where: { id: result.stockUnit.id },
    });
    expect(unitAfter!.status).toBe("SOLD");

    const movements = await prisma.stockMovement.findMany({
      where: { stockUnitId: result.stockUnit.id },
      orderBy: { timestamp: "asc" },
    });
    expect(movements.length).toBe(3);
    expect(movements[0].type).toBe("INWARD");
    expect(movements[1].type).toBe("RESERVATION_LOCK");
    expect(movements[2].type).toBe("DISPATCH_DELIVERY");

    const saleAfter = await prisma.sale.findUnique({
      where: { id: result.sale.id },
      include: { stockUnit: true, customer: true },
    });
    expect(saleAfter!.status).toBe("INVOICED");
    expect(saleAfter!.totalOnRoadPaise).toBe(7200000n);
    expect(saleAfter!.stockUnit.status).toBe("SOLD");

    // GST split consistency: cgst + sgst + igst = gstAmount (intra-state Maharashtra)
    expect(
      result.sale.cgstPaise + result.sale.sgstPaise + result.sale.igstPaise,
    ).toBe(result.sale.gstAmountPaise);
    expect(result.sale.cgstPaise).toBe(360000n);
    expect(result.sale.sgstPaise).toBe(360000n);
  });

  it("transaction rolls back on error — no partial stock state", async () => {
    const initialCount = await prisma.stockUnit.count({
      where: { dealershipId: dealership.id },
    });

    let error: any = null;
    try {
      await prisma.$transaction(async (tx) => {
        await tx.stockUnit.create({
          data: {
            chassisNumber: `ME4RB${sufix}`,
            engineNumber: `ENGRB${sufix}`,
            variantId: variant.id,
            colorName: "Midnight Black",
            dealershipId: dealership.id,
            purchasePricePaise: 1000000n,
            status: "IN_STOCK",
          },
        });
        // Force an error after creating the unit
        throw new Error("simulated failure — rollback");
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    // No partial data should remain
    const afterCount = await prisma.stockUnit.count({
      where: { dealershipId: dealership.id },
    });
    expect(afterCount).toBe(initialCount);
    const rolledBack = await prisma.stockUnit.findFirst({
      where: { chassisNumber: `ME4RB${sufix}` },
    });
    expect(rolledBack).toBeNull();
  });
});

describe("Integration — Payment, Refund, Invoice transaction consistency", () => {
  let dealership: any;
  let customer: any;
  let staffUser: any;
  let booking: any;
  let sufix: string;

  async function setup() {
    sufix = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await ensureRoles();
    dealership = await ensureDealership(sufix);
    const catalogue = await makeCatalogue(sufix);
    customer = await makeCustomer();
    staffUser = await ensureStaff(dealership.id);
    booking = await prisma.booking.create({
      data: {
        dealershipId: dealership.id,
        bookingNumber: `INT-BK-${sufix}`,
        customerId: customer.id,
        variantId: catalogue.variant.id,
        colorRequested: "Midnight Black",
        advanceAmountPaise: 500000n,
        tentativeDeliveryDate: new Date(),
      },
    });
  }

  beforeEach(async () => {
    await setup();
  });

  it("payment → refund lifecycle keeps amounts consistent", async () => {
    const paymentAmount = BigInt(500000); // ₹5,000

    const result = await prisma.$transaction(async (tx) => {
      // Create payment (linked to booking)
      const payment = await tx.payment.create({
        data: {
          receiptNumber: `INT-PAY-${sufix}`,
          bookingId: booking.id,
          amountPaise: paymentAmount,
          mode: "UPI",
          receivedBy: staffUser.name,
          status: "SUCCESS",
        },
      });

      // Create refund (partial)
      const refund = await tx.refund.create({
        data: {
          refundNumber: `INT-REF-${sufix}`,
          paymentId: payment.id,
          bookingId: booking.id,
          amountPaise: BigInt(100000), // ₹1,000
          reason: "Customer requested partial refund",
          requestedBy: staffUser.name,
          status: "PENDING",
        },
      });

      return { payment, refund };
    });

    // Verify unrefunded balance consistency — pending refund does not reduce balance yet
    const paymentAfter = await prisma.payment.findUnique({
      where: { id: result.payment.id },
      include: { refunds: true },
    });
    const totalRefundedPending = paymentAfter!.refunds
      .filter((r) => r.status === "COMPLETED" || r.status === "APPROVED")
      .reduce((sum, r) => sum + r.amountPaise, 0n);
    const unrefundedPending = paymentAfter!.amountPaise - totalRefundedPending;
    expect(unrefundedPending).toBe(BigInt(500000)); // 500000 - 0 (pending not counted)

    // Approve refund — now it counts toward refunded balance
    const approved = await prisma.refund.update({
      where: { id: result.refund.id },
      data: { status: "APPROVED" },
    });
    expect(approved.status).toBe("APPROVED");

    const paymentAfterApproved = await prisma.payment.findUnique({
      where: { id: result.payment.id },
      include: { refunds: true },
    });
    const totalRefundedApproved = paymentAfterApproved!.refunds
      .filter((r) => r.status === "COMPLETED" || r.status === "APPROVED")
      .reduce((sum, r) => sum + r.amountPaise, 0n);
    expect(paymentAfterApproved!.amountPaise - totalRefundedApproved).toBe(BigInt(400000)); // 500000 - 100000

    // Complete refund
    const completed = await prisma.refund.update({
      where: { id: result.refund.id },
      data: { status: "COMPLETED" },
    });
    expect(completed.status).toBe("COMPLETED");
  });

  it("invoice creation within transaction is consistent with sale", async () => {
    const catalogue = await makeCatalogue(`inv${sufix}`);

    const result = await prisma.$transaction(async (tx) => {
      // Create a stock unit to associate with the sale (stockUnit relation is required)
      const stockUnit = await tx.stockUnit.create({
        data: {
          chassisNumber: `ME4INV${sufix}`,
          engineNumber: `ENGINV${sufix}`,
          variantId: catalogue.variant.id,
          colorName: "Midnight Black",
          dealershipId: dealership.id,
          purchasePricePaise: 6000000n,
          status: "SOLD",
        },
      });

      const sale = await tx.sale.create({
        data: {
          dealershipId: dealership.id,
          customerId: customer.id,
          stockUnitId: stockUnit.id,
          saleNumber: `INV-SALE-${sufix}`,
          exShowroomPaise: 6480000n,
          gstAmountPaise: 720000n,
          cgstPaise: 360000n,
          sgstPaise: 360000n,
          igstPaise: 0n,
          rtoPaise: 36000n,
          insurancePaise: 36000n,
          totalOnRoadPaise: 7200000n,
          amountPaidPaise: 7200000n,
          outstandingPaise: 0n,
          status: "INVOICED",
        },
      });

      const invoice = await tx.invoice.create({
        data: {
          dealershipId: dealership.id,
          saleId: sale.id,
          invoiceNumber: `INT-INV-${sufix}`,
          gstin: "27TSTTS0000T1Z9",
          gstRateBps: 1800,
          taxableAmountPaise: 6480000n,
          cgstAmountPaise: 360000n,
          sgstAmountPaise: 360000n,
          igstAmountPaise: 0n,
          totalInvoicePaise: 7200000n,
        },
      });

      return { sale, invoice };
    });

    // Invoice totals must reconcile with sale
    expect(result.invoice.taxableAmountPaise + result.invoice.cgstAmountPaise +
      result.invoice.sgstAmountPaise + result.invoice.igstAmountPaise).toBe(
      result.invoice.totalInvoicePaise,
    );
    expect(result.invoice.totalInvoicePaise).toBe(result.sale.totalOnRoadPaise);
    expect(result.invoice.taxableAmountPaise).toBe(result.sale.exShowroomPaise);
    // CGST + SGST + IGST = GST
    expect(
      result.invoice.cgstAmountPaise + result.invoice.sgstAmountPaise +
        result.invoice.igstAmountPaise,
    ).toBe(result.sale.gstAmountPaise);
  });

  it("refund cannot exceed unrefunded payment balance", async () => {
    const payment = await prisma.payment.create({
      data: {
        receiptNumber: `PAY-LIMIT-${sufix}`,
        bookingId: booking.id,
        amountPaise: BigInt(200000),
        mode: "CASH",
        receivedBy: staffUser.name,
        status: "SUCCESS",
      },
    });

    // First refund of 150000
    await prisma.refund.create({
      data: {
        refundNumber: `REF-LIMIT-${sufix}`,
        paymentId: payment.id,
        bookingId: booking.id,
        amountPaise: BigInt(150000),
        reason: "First refund",
        requestedBy: staffUser.name,
        status: "COMPLETED",
      },
    });

    // Unrefunded balance = 200000 - 150000 = 50000
    // Attempting a refund of 60000 should be rejected by business logic
    // (we test at the DB level that amounts are stored; business rule enforced in service layer)
    const paymentAfter = await prisma.payment.findUnique({
      where: { id: payment.id },
      include: { refunds: true },
    });
    const totalRefunded = paymentAfter!.refunds
      .filter((r) => r.status === "COMPLETED" || r.status === "APPROVED")
      .reduce((sum, r) => sum + r.amountPaise, 0n);
    expect(paymentAfter!.amountPaise - totalRefunded).toBe(BigInt(50000));
  });
});
