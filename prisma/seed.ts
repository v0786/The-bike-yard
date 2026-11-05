import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// TEST-ONLY identifiers. These are obviously fake placeholders for local
// development and must never be treated as real business facts.
// Replace with the dealership's real registered details before production.
const TEST_DEALERSHIP = {
  code: "TBY-TEST",
  name: "The Bike Yard",
  addressLine1: "Test Business Park, Test Road",
  city: "Thane",
  state: "Maharashtra",
  pincode: "400601",
  gstin: "27TSTTS0000T1Z9",
  phone: "+91 90000 00000",
  email: "admin@example.test",
};

async function main() {
  const dealership = await prisma.dealership.upsert({
    where: { code: TEST_DEALERSHIP.code },
    update: {},
    create: TEST_DEALERSHIP,
  });

  const roleNames = [
    "Super Admin",
    "Owner",
    "Manager",
    "Sales Exec",
    "Accountant",
    "Insurance Staff",
    "RTO Staff",
  ];

  const roles = await Promise.all(
    roleNames.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} role` },
      }),
    ),
  );

  const adminRole = roles.find((r) => r.name === "Super Admin");
  if (!adminRole) throw new Error("Super Admin role was not seeded");

  await prisma.user.upsert({
    where: { email: "admin@example.test" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@example.test",
      passwordHash: await hash("changed-immediately", 12),
      roleId: adminRole.id,
      dealershipId: dealership.id,
      isActive: true,
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
