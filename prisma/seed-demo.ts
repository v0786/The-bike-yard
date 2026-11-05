// Dev-only demo seed: imports the frontend showroom catalogue and sample
// operational records into PostgreSQL so the SPA has real API-backed data.
// NEVER run against production. All names/numbers are fictional test data.
import { PrismaClient, type StockUnitStatus } from '@prisma/client';
import { hash } from 'bcryptjs';
import {
  INITIAL_BIKES,
  INITIAL_STOCK_UNITS,
  INITIAL_CUSTOMERS,
  INITIAL_BOOKINGS,
  INITIAL_SALES,
  INITIAL_PAYMENTS,
  INITIAL_TEST_RIDES,
  INITIAL_LEADS,
  INITIAL_STAFF_TASKS,
  FAQS,
} from '../frontend/src/data/dealershipData';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo@1234';

const STAFF = [
  { name: 'Super Admin', email: 'admin@example.test', role: 'Super Admin' },
  { name: 'Rajesh Gokhale', email: 'rajesh@example.test', role: 'Owner' },
  { name: 'Meera Joshi', email: 'meera@example.test', role: 'Manager' },
  { name: 'Suraj Patil', email: 'suraj@example.test', role: 'Sales Exec' },
  { name: 'Neha Shinde', email: 'neha@example.test', role: 'Sales Exec' },
  { name: 'Kiran Mane', email: 'kiran@example.test', role: 'Accountant' },
  { name: 'Vikram Shinde', email: 'vikram@example.test', role: 'Insurance Staff' },
  { name: 'Anita Rane', email: 'anita@example.test', role: 'RTO Staff' },
];

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  const dealership = await prisma.dealership.upsert({
    where: { code: 'TBY-TEST' },
    update: {},
    create: {
      code: 'TBY-TEST',
      name: 'The Bike Yard',
      addressLine1: 'Shop 4 & 5, Rutu Business Park, Khopat',
      city: 'Thane',
      state: 'Maharashtra',
      pincode: '400601',
      gstin: '27TSTTS0000T1Z9',
      phone: '+91 90000 00000',
      email: 'admin@example.test',
    },
  });

  const roles = await Promise.all(
    ['Super Admin', 'Owner', 'Manager', 'Sales Exec', 'Accountant', 'Insurance Staff', 'RTO Staff'].map(
      (name) =>
        prisma.role.upsert({
          where: { name },
          update: {},
          create: { name, description: `${name} role` },
        })
    )
  );
  const roleByName = new Map(roles.map((r) => [r.name, r]));
  const userByName = new Map<string, string>();

  for (const staff of STAFF) {
    const role = roleByName.get(staff.role);
    if (!role) throw new Error(`Missing role ${staff.role}`);
    const user = await prisma.user.upsert({
      where: { email: staff.email },
      update: {},
      create: {
        name: staff.name,
        email: staff.email,
        passwordHash: await hash(DEMO_PASSWORD, 12),
        roleId: role.id,
        dealershipId: dealership.id,
        isActive: true,
      },
    });
    userByName.set(staff.name, user.id);
  }

  // ---- Catalogue -----------------------------------------------------------
  const bikeToVariant = new Map<string, string>();

  for (const bike of INITIAL_BIKES) {
    const brand = await prisma.brand.upsert({
      where: { name: bike.brand },
      update: {},
      create: { name: bike.brand, slug: slug(bike.brand) },
    });

    const modelSlug = `${slug(bike.brand)}-${slug(bike.model)}`;
    let model = await prisma.model.findUnique({ where: { slug: modelSlug } });
    if (!model) {
      model = await prisma.model.create({
        data: {
          brandId: brand.id,
          name: bike.model,
          slug: modelSlug,
          category: bike.category,
          engineCc: bike.engineCc,
          powerBhp: bike.powerBhp,
          torqueNm: bike.torqueNm,
          mileageKmpl: bike.mileageKmpl,
          kerbWeight: bike.kerbWeightKg,
          fuelCapacity: bike.fuelCapacityL,
          description: bike.description,
          isUsed: Boolean(bike.isUsed),
        },
      });
    }

    let variant = await prisma.variant.findFirst({
      where: { modelId: model.id, name: bike.variant },
    });
    if (!variant) {
      variant = await prisma.variant.create({
        data: {
          modelId: model.id,
          name: bike.variant,
          exShowroomPricePaise: bike.exShowroomPaise,
          rtoTaxPaise: bike.rtoTaxPaise,
          insurancePaise: bike.insurancePaise,
          handlingChargesPaise: bike.handlingPaise,
        },
      });
    }
    bikeToVariant.set(bike.id, variant.id);

    for (const colour of bike.availableColors) {
      const existing = await prisma.colour.findFirst({
        where: { variantId: variant.id, name: colour.name },
      });
      if (!existing) {
        await prisma.colour.create({
          data: {
            variantId: variant.id,
            name: colour.name,
            hexCode: colour.hex,
            imageUrl: colour.image ?? bike.image,
          },
        });
      }
    }
  }

  // ---- Stock units ---------------------------------------------------------
  const unitIdMap = new Map<string, string>();
  for (const unit of INITIAL_STOCK_UNITS) {
    const variantId = bikeToVariant.get(unit.bikeId);
    if (!variantId) continue;
    const created = await prisma.stockUnit.upsert({
      where: { chassisNumber: unit.chassisNumber },
      update: {
        status: unit.status as StockUnitStatus,
        colorName: unit.color,
        location: unit.location,
      },
      create: {
        dealershipId: dealership.id,
        variantId,
        chassisNumber: unit.chassisNumber,
        engineNumber: unit.engineNumber,
        colorName: unit.color,
        purchasePricePaise: unit.purchasePricePaise,
        status: unit.status as StockUnitStatus,
        location: unit.location,
        pdiPassed: unit.pdiPassed,
        inwardDate: new Date(unit.inwardDate),
      },
    });
    unitIdMap.set(unit.id, created.id);
  }

  // ---- Customers -----------------------------------------------------------
  const customerIdMap = new Map<string, string>();
  for (const customer of INITIAL_CUSTOMERS) {
    const created = await prisma.customer.upsert({
      where: { phone: customer.phone },
      update: {},
      create: {
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        addressLine1: customer.address,
        city: customer.city,
        panNumber: customer.panNumber ?? null,
      },
    });
    customerIdMap.set(customer.id, created.id);
  }

  // ---- Bookings ------------------------------------------------------------
  const bookingIdMap = new Map<string, string>();
  for (const booking of INITIAL_BOOKINGS) {
    const customerId = customerIdMap.get(booking.customerId);
    const variantId = bikeToVariant.get(booking.bikeId);
    if (!customerId || !variantId) continue;
    const created = await prisma.booking.upsert({
      where: { bookingNumber: booking.bookingNumber },
      update: {},
      create: {
        dealershipId: dealership.id,
        bookingNumber: booking.bookingNumber,
        customerId,
        variantId,
        colorRequested: booking.color,
        advanceAmountPaise: booking.advanceAmountPaise,
        status: booking.status,
        tentativeDeliveryDate: new Date(booking.tentativeDeliveryDate),
      },
    });
    bookingIdMap.set(booking.id, created.id);
  }

  // ---- Sales ---------------------------------------------------------------
  const saleIdMap = new Map<string, string>();
  for (const sale of INITIAL_SALES) {
    const customerId = customerIdMap.get(sale.customerId);
    const stockUnitId = unitIdMap.get(sale.stockUnitId);
    if (!customerId || !stockUnitId) continue;
    const created = await prisma.sale.upsert({
      where: { saleNumber: sale.invoiceNumber },
      update: {},
      create: {
        dealershipId: dealership.id,
        customerId,
        stockUnitId,
        saleNumber: sale.invoiceNumber,
        exShowroomPaise: sale.exShowroomPaise,
        gstAmountPaise: sale.gstAmountPaise,
        cgstPaise: sale.cgstPaise,
        sgstPaise: sale.sgstPaise,
        igstPaise: sale.igstPaise,
        rtoPaise: sale.rtoPaise,
        insurancePaise: sale.insurancePaise,
        accessoriesPaise: sale.accessoriesPaise,
        totalOnRoadPaise: sale.totalOnRoadPaise,
        advanceCarriedPaise: sale.advanceCarriedPaise,
        amountPaidPaise: sale.amountPaidPaise,
        outstandingPaise: sale.outstandingPaise,
        saleDate: new Date(sale.saleDate),
        status: sale.status,
      },
    });
    saleIdMap.set(sale.id, created.id);
    await prisma.stockUnit.update({
      where: { id: stockUnitId },
      data: { status: 'SOLD' },
    });
  }

  // ---- Payments ------------------------------------------------------------
  for (const payment of INITIAL_PAYMENTS) {
    const bookingId = bookingIdMap.get(payment.referenceId) ?? null;
    const saleId = saleIdMap.get(payment.referenceId) ?? null;
    await prisma.payment.upsert({
      where: { receiptNumber: payment.receiptNumber },
      update: {},
      create: {
        receiptNumber: payment.receiptNumber,
        bookingId,
        saleId,
        amountPaise: payment.amountPaise,
        mode: payment.mode,
        transactionRef: payment.transactionRef,
        receivedBy: payment.receivedBy,
        status: payment.status,
        paymentDate: new Date(payment.paymentDate),
      },
    });
  }

  // ---- Test rides ----------------------------------------------------------
  for (const ride of INITIAL_TEST_RIDES) {
    const existing = await prisma.testRide.findFirst({
      where: {
        phone: ride.customerPhone,
        bikeModel: ride.bikeModel,
        preferredDate: new Date(ride.preferredDate),
      },
    });
    if (!existing) {
      await prisma.testRide.create({
        data: {
          customerName: ride.customerName,
          phone: ride.customerPhone,
          bikeModel: ride.bikeModel,
          preferredDate: new Date(ride.preferredDate),
          preferredTimeSlot: ride.preferredTimeSlot,
          hasValidLicense: ride.hasValidLicense,
          status: ride.status,
          assignedStaff: ride.assignedStaff,
        },
      });
    }
  }

  // ---- Leads ---------------------------------------------------------------
  for (const lead of INITIAL_LEADS) {
    const existing = await prisma.lead.findFirst({
      where: { phone: lead.phone, bikeOfInterest: lead.bikeOfInterest },
    });
    if (!existing) {
      await prisma.lead.create({
        data: {
          customerName: lead.customerName,
          phone: lead.phone,
          bikeOfInterest: lead.bikeOfInterest,
          source: lead.source,
          stage: lead.stage,
          assignedTo: lead.assignedTo,
          notes: lead.notes,
          createdAt: new Date(lead.createdAt),
        },
      });
    }
  }

  // ---- Staff tasks ---------------------------------------------------------
  for (const task of INITIAL_STAFF_TASKS) {
    const assignedTo =
      [...userByName.entries()].find(([name]) => task.assignedTo.includes(name))?.[1] ??
      userByName.get('Super Admin');
    if (!assignedTo) continue;
    const existing = await prisma.staffTask.findFirst({ where: { title: task.title } });
    if (!existing) {
      await prisma.staffTask.create({
        data: {
          title: task.title,
          category: task.category,
          assignedTo,
          dueTime: task.dueTime,
          isCompleted: task.isCompleted,
          priority: task.priority,
        },
      });
    }
  }

  // ---- FAQs & settings -----------------------------------------------------
  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: FAQS.map((faq, index) => ({
        question: faq.q,
        answer: faq.a,
        sortOrder: index,
      })),
    });
  }

  const settings = await prisma.settings.findFirst({ where: { dealershipId: dealership.id } });
  if (!settings) {
    await prisma.settings.create({
      data: {
        dealershipId: dealership.id,
        invoiceTerms: 'Thank you for choosing The Bike Yard. Goods once sold are subject to manufacturer warranty terms.',
      },
    });
  }

  console.log('Demo seed complete.');
  console.log(`Staff login: admin@example.test / ${DEMO_PASSWORD} (dev only)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
