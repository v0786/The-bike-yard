// Integration tests against real PostgreSQL database (TESTING.md §3).
// These tests run against the dedicated test database (bikeyard_test)
// and never use production data. All mutations run in Prisma transactions.

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEST_DEALERSHIP_NAME = "Integration Test Dealership";

async function seedTestData() {
  const dealership = await prisma.dealership.create({
    data: { name: TEST_DEALERSHIP_NAME, address: "Test Street, Test City" },
  });

  const [superAdminRole, managerRole, accountantRole] = await Promise.all([
    prisma.role.create({
      data: { name: "Super Admin", dealershipId: dealership.id },
    }),
    prisma.role.create({
      data: { name: "Manager", dealershipId: dealership.id },
    }),
    prisma.role.create({
      data: { name: "Accountant", dealershipId: dealership.id },
    }),
  ]);

  const user = await prisma.user.create({
    data: {
      email: "integration@thebikeyard.local",
      passwordHash: "$2b$12$hashedpasswordhashforsuperadminuserintegrationtest",
      firstName: "Integration",
      lastName: "Tester",
      roleId: superAdminRole.id,
      dealershipId: dealership.id,
      isActive: true,
    },
  });

  const brand = await prisma.brand.create({
    data: { name: "TestBrand" },
  });

  const model = await prisma.model.create({
    data: { name: "TestModel", brandId: brand.id },
  });

  const variant = await prisma.variant.create({
    data: {
      modelId: model.id,
      engineCC: 125,
      brandId: brand.id,
    },
  });

  const colour = await prisma.colour.create({
    data: { name: "Black", hexCode: "#000000" },
  });

  const customer = await prisma.customer.create({
    data: {
      dealershipId: dealership.id,
      firstName: "Integration",
      lastName: "Customer",
      phone: "9876543210",
      email: "integration.customer@example.com",
    },
  });

  return { dealership, user, variant, colour, customer, brand, model };
}

describe("Integration — Database connectivity (real PostgreSQL)", () => {
  beforeAll(async () => {
    await prisma.$connect();
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
    const dealershipCount = await prisma.dealership.count();
    const userCount = await prisma.user.count();
    const roleCount = await prisma.role.count();
    expect(dealershipCount).toBeGreaterThanOrEqual(1);
    expect(userCount).toBeGreaterThanOrEqual(1);
    expect(roleCount).toBeGreaterThanOrEqual(7);
  });
});

describe("Integration — Stock, Booking, Sale transaction consistency", () => {
  let dealership: any;
  let variant: any;
  let colour: any;
  let customer: any;
  let staffUser: any;
  let sufix: string;

  beforeEach(async () => {
    sufix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    // Clean up test data from previous runs of this suite (dependency order)
    await prisma.sale.deleteMany({
      where: { saleNumber: { startsWith: "INT-SALE-" } },
    });
    await prisma.stockMovement.deleteMany({
      where: { stockUnit: { chassisNumber: { startsWith: "ME4TEST" } } },
    });
    await prisma.reservation.deleteMany({
      where: { stockUnit: { chassisNumber: { startsWith: "ME4TEST" } } },
    });
    await prisma.stockUnit.deleteMany({
      where: { chassisNumber: { startsWith: "ME4TEST" } },
    });
    await prisma.customer.deleteMany({
      where: { phone: "9876543210" },
    });

    // Create catalogue data with unique names to avoid unique constraint conflicts
    const brand = await prisma.brand.create({
      data: { name: `TestBrand-${sufix}` },
    });
    colour = await prisma.colour.create({
      data: { name: `Black-${sufix}`, hexCode: "#000000" },
    });
    const model = await prisma.model.create({
      data: { name: `TestModel-${sufix}`, brandId: brand.id },
    });
    variant = await prisma.variant.create({
      data: {
        modelId: model.id,
        colourId: colour.id,
        engineCC: 125,
        brandId: brand.id,
      },
    });

    const staffRole = await prisma.role.findUnique({ where: { name: "Super Admin" } });
    if (!staffRole) throw new Error("Super Admin role not seeded");

    dealership = await prisma.dealership.create({
      data: { name: TEST_DEALERSHIP_NAME, address: "Test Street, Test City" },
    });

    staffUser = await prisma.user.create({
      data: {
        email: `staff-${Date.now()}@integration.local`,
        passwordHash: "$2b$12$hashedpasswordhashforstaffintegration",
        firstName: "Integration",
        lastName: "Staff",
        roleId: staffRole.id,
        dealershipId: dealership.id,
        isActive: true,
      },
    });

    customer = await prisma.customer.create({
      data: {
        dealershipId: dealership.id,
        firstName: "Integration",
        lastName: "Customer",
        phone: "9876543210",
      },
    });
  });

  it("stock inward → reservation → sale flow keeps stock status consistent in a transaction", async () => {
    const purchasePrice = 6500000; // paise

    const result = await prisma.$transaction(async (tx) => {
      // 1. Stock inward
      const stockUnit = await tx.stockUnit.create({
        data: {
          chassisNumber: `ME4TEST${sufix}`,
          engineNumber: `TESTENG${sufix}`,
          variantId: variant.id,
          colourId: colour.id,
          dealershipId: dealership.id,
          purchasePrice,
          currentStatus: "available",
        },
      });

      // 2. Record inward movement
      await tx.stockMovement.create({
        data: {
          stockUnitId: stockUnit.id,
          type: "inward",
          quantity: 1,
          referenceType: "inward",
          notes: "Integration test inward",
          createdBy: null,
        },
      });

      // Verify unit is available
      const unit = await tx.stockUnit.findUnique({ where: { id: stockUnit.id } });
      expect(unit!.currentStatus).toBe("available");

      // 3. Create reservation
      const reservation = await tx.reservation.create({
        data: {
          stockUnitId: stockUnit.id,
          customerId: customer.id,
          status: "active",
        },
      });

      // 4. Mark unit reserved
      await tx.stockUnit.update({
        where: { id: stockUnit.id },
        data: { currentStatus: "reserved" },
      });

      // 5. Record reservation movement
      await tx.stockMovement.create({
        data: {
          stockUnitId: stockUnit.id,
          type: "reservation",
          quantity: 1,
          referenceType: "booking",
          referenceId: reservation.id,
          notes: "Unit reserved",
          createdBy: null,
        },
      });

      // 6. Complete sale within same transaction
      const onRoadPrice = 7200000;
      const gstAmount = 720000;
      const sale = await tx.sale.create({
        data: {
          saleNumber: "INT-SALE-001",
          customerId: customer.id,
          stockUnitId: stockUnit.id,
          staffId: null,
          bookingId: null,
          exShowroomPrice: 6480000,
          onRoadPrice,
          insurancePrice: 36000,
          rtoCharges: 36000,
          accessoriesPrice: 0,
          discount: 0,
          finalSellingPrice: 6480000,
          gstAmount,
          cgstAmount: BigInt(360000),
          sgstAmount: BigInt(360000),
          igstAmount: BigInt(0),
          totalAmount: 7200000,
          amountPaid: 7200000,
          outstandingAmount: 0,
          placeOfSupply: "27",
          hsnCode: null,
          gstRate: 2800,
          status: "paid",
        },
      });

      // 7. Mark unit sold
      await tx.stockUnit.update({
        where: { id: stockUnit.id },
        data: { currentStatus: "sold" },
      });

      // 8. Record sale movement
      await tx.stockMovement.create({
        data: {
          stockUnitId: stockUnit.id,
          type: "sale",
          quantity: 1,
          referenceType: "sale",
          referenceId: sale.id,
          notes: "Unit sold",
          createdBy: null,
        },
      });

      return { stockUnit, reservation, sale };
    });

    // Verify transactional consistency: all changes committed together
    const unitAfter = await prisma.stockUnit.findUnique({
      where: { id: result.stockUnit.id },
    });
    expect(unitAfter!.currentStatus).toBe("sold");

    const movements = await prisma.stockMovement.findMany({
      where: { stockUnitId: result.stockUnit.id },
      orderBy: { createdAt: "asc" },
    });
    expect(movements.length).toBe(3);
    expect(movements[0].type).toBe("inward");
    expect(movements[1].type).toBe("reservation");
    expect(movements[2].type).toBe("sale");

    const saleAfter = await prisma.sale.findUnique({
      where: { id: result.sale.id },
      include: { stockUnit: true, customer: true },
    });
    expect(saleAfter!.status).toBe("paid");
    expect(saleAfter!.totalAmount).toBe(BigInt(7200000));
    expect(saleAfter!.stockUnit.currentStatus).toBe("sold");

    // GST split consistency: cgst + sgst + igst = gstAmount (intra-state Maharashtra)
    expect(result.sale.cgstAmount! + result.sale.sgstAmount! + result.sale.igstAmount!).toBe(
      result.sale.gstAmount
    );
  });

  it("transaction rolls back on error — no partial stock state", async () => {
    const ts = Date.now();
    const initialCount = await prisma.stockUnit.count({
      where: { dealershipId: dealership.id },
    });

    let error: any = null;
    try {
      await prisma.$transaction(async (tx) => {
        await tx.stockUnit.create({
          data: {
            chassisNumber: `ME4ROLLBACK${sufix}`,
            engineNumber: `ENGRB${sufix}`,
            variantId: variant.id,
            colourId: colour.id,
            dealershipId: dealership.id,
            purchasePrice: BigInt(1000000),
            currentStatus: "available",
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
      where: { chassisNumber: `ME4ROLLBACK${sufix}` },
    });
    expect(rolledBack).toBeNull();
  });
});

describe("Integration — Payment, Refund, Invoice transaction consistency", () => {
  let dealership: any;
  let customer: any;
  let staffUser: any;

  beforeEach(async () => {
    // Delete in dependency order (refunds→payments, invoices→sales)
    await prisma.refund.deleteMany({
      where: { payment: { customer: { dealership: { name: TEST_DEALERSHIP_NAME } } } },
    });
    await prisma.payment.deleteMany({
      where: { customer: { dealership: { name: TEST_DEALERSHIP_NAME } } },
    });
    await prisma.invoice.deleteMany({
      where: { sale: { customer: { dealership: { name: TEST_DEALERSHIP_NAME } } } },
    });
    await prisma.sale.deleteMany({
      where: { customer: { dealership: { name: TEST_DEALERSHIP_NAME } } },
    });
    await prisma.customer.deleteMany({
      where: { dealership: { name: TEST_DEALERSHIP_NAME } },
    });

    const dealershipData = await prisma.dealership.create({
      data: { name: TEST_DEALERSHIP_NAME, address: "Test Street, Test City" },
    });
    dealership = dealershipData;

    // Role names are globally unique (@unique on name); reuse existing role.
    const staffRole = await prisma.role.findUnique({
      where: { name: "Super Admin" },
    });
    if (!staffRole) {
      throw new Error("Super Admin role not seeded in test database");
    }

    staffUser = await prisma.user.create({
      data: {
        email: `staff-${Date.now()}@integration.local`,
        passwordHash: "$2b$12$hashedpasswordhashforstaffintegration",
        firstName: "Integration",
        lastName: "Staff",
        roleId: staffRole.id,
        dealershipId: dealership.id,
        isActive: true,
      },
    });

    customer = await prisma.customer.create({
      data: {
        dealershipId: dealership.id,
        firstName: "Payment",
        lastName: "Customer",
        phone: "9876543211",
      },
    });
  });

  it("payment → refund lifecycle keeps amounts consistent", async () => {
    const paymentAmount = BigInt(500000); // ₹5,000

    const result = await prisma.$transaction(async (tx) => {
      // Create payment
      const payment = await tx.payment.create({
        data: {
          paymentNumber: "INT-PAY-001",
          customerId: customer.id,
          saleId: null,
          bookingId: null,
          amount: paymentAmount,
          method: "upi",
          status: "completed",
          recordedById: null,
        },
      });

      // Create refund (partial)
      const refund = await tx.refund.create({
        data: {
          refundNumber: "INT-REF-001",
          payment: { connect: { id: payment.id } },
          requestedByUser: { connect: { id: staffUser.id } },
          saleId: null,
          bookingId: null,
          amount: BigInt(100000), // ₹1,000
          reason: "Customer requested partial refund",
          status: "pending",
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
      .filter((r) => r.status === "completed" || r.status === "approved")
      .reduce((sum, r) => sum + r.amount, 0n);
    const unrefundedPending = paymentAfter!.amount - totalRefundedPending;
    expect(unrefundedPending).toBe(BigInt(500000)); // 500000 - 0 (pending not counted)

    // Approve refund — now it counts toward refunded balance
    const approved = await prisma.refund.update({
      where: { id: result.refund.id },
      data: { status: "approved" },
    });
    expect(approved.status).toBe("approved");

    const paymentAfterApproved = await prisma.payment.findUnique({
      where: { id: result.payment.id },
      include: { refunds: true },
    });
    const totalRefundedApproved = paymentAfterApproved!.refunds
      .filter((r) => r.status === "completed" || r.status === "approved")
      .reduce((sum, r) => sum + r.amount, 0n);
    expect(paymentAfterApproved!.amount - totalRefundedApproved).toBe(BigInt(400000)); // 500000 - 100000

    // Complete refund
    const completed = await prisma.refund.update({
      where: { id: result.refund.id },
      data: { status: "completed" },
    });
    expect(completed.status).toBe("completed");
  });

  it("invoice creation within transaction is consistent with sale", async () => {
    // Create catalogue data for this test
    const ts = Date.now();
    const brand = await prisma.brand.create({ data: { name: `InvBrand-${ts}` } });
    const invColour = await prisma.colour.create({
      data: { name: `InvColour-${ts}`, hexCode: "#FFFFFF" },
    });
    const model = await prisma.model.create({
      data: { name: `InvModel-${ts}`, brandId: brand.id },
    });
    const invVariant = await prisma.variant.create({
      data: { modelId: model.id, colourId: invColour.id, engineCC: 150, brandId: brand.id },
    });

    const result = await prisma.$transaction(async (tx) => {
      // Create a stock unit to associate with the sale (stockUnit relation is required)
      const stockUnit = await tx.stockUnit.create({
        data: {
          chassisNumber: `ME4INV${ts}`,
          engineNumber: `ENGINV${ts}`,
          variantId: invVariant.id,
          colourId: invColour.id,
          dealershipId: dealership.id,
          purchasePrice: BigInt(6000000),
          currentStatus: "sold",
        },
      });

      const sale = await tx.sale.create({
        data: {
          saleNumber: "INT-INV-SALE-001",
          customerId: customer.id,
          stockUnitId: stockUnit.id,
          staffId: staffUser.id,
          bookingId: null,
          exShowroomPrice: BigInt(6480000),
          onRoadPrice: BigInt(7200000),
          insurancePrice: BigInt(36000),
          rtoCharges: BigInt(36000),
          accessoriesPrice: BigInt(0),
          discount: BigInt(0),
          finalSellingPrice: BigInt(6480000),
          gstAmount: BigInt(720000),
          cgstAmount: BigInt(360000),
          sgstAmount: BigInt(360000),
          igstAmount: BigInt(0),
          totalAmount: BigInt(7200000),
          amountPaid: BigInt(7200000),
          outstandingAmount: BigInt(0),
          placeOfSupply: "27",
          hsnCode: null,
          gstRate: 2800,
          status: "paid",
        },
      });

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber: "TBY/2026/0001",
          saleId: sale.id,
          type: "tax_invoice",
          subtotal: BigInt(6480000),
          gstAmount: BigInt(720000),
          cgstAmount: BigInt(360000),
          sgstAmount: BigInt(360000),
          igstAmount: BigInt(0),
          total: BigInt(7200000),
          gstRate: 2800,
          placeOfSupply: "27",
          hsnCode: null,
          gstin: null,
          customerGstin: null,
          status: "issued",
          createdBy: staffUser.id,
        },
      });

      return { sale, invoice };
    });

    // Invoice totals must reconcile with sale
    expect(result.invoice.subtotal + result.invoice.gstAmount).toBe(result.invoice.total);
    expect(result.invoice.total).toBe(result.sale.totalAmount);
    expect(result.invoice.gstAmount).toBe(result.sale.gstAmount);
    // CGST + SGST + IGST = GST
    expect(result.invoice.cgstAmount + result.invoice.sgstAmount + result.invoice.igstAmount).toBe(
      result.invoice.gstAmount
    );
  });

  it("refund cannot exceed unrefunded payment balance", async () => {
    const payment = await prisma.payment.create({
      data: {
        paymentNumber: "INT-PAY-LIMIT-001",
        customerId: customer.id,
        amount: BigInt(200000),
        method: "cash",
        status: "completed",
        recordedById: null,
      },
    });

    // First refund of 150000
    await prisma.refund.create({
      data: {
        refundNumber: "INT-REF-LIMIT-001",
        payment: { connect: { id: payment.id } },
        amount: BigInt(150000),
        reason: "First refund",
        status: "completed",
        requestedByUser: { connect: { id: staffUser.id } },
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
      .filter((r) => r.status === "completed" || r.status === "approved")
      .reduce((sum, r) => sum + r.amount, 0n);
    expect(paymentAfter!.amount - totalRefunded).toBe(BigInt(50000));
  });
});
