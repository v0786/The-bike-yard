import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const ROLES = [
  'Super Admin',
  'Owner',
  'Manager',
  'Sales Exec',
  'Accountant',
  'Insurance Staff',
  'RTO Staff',
];

// Fictional, clearly-marked development seed data. Never production data.
async function main() {
  for (const name of ROLES) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'Super Admin' } });

  const dealership = await prisma.dealership.upsert({
    where: { code: 'TBY-THANE-01' },
    update: {},
    create: {
      code: 'TBY-THANE-01',
      name: 'The Bike Yard (Demo Seed)',
      addressLine1: 'Khopat, Thane (W)',
      pincode: '400601',
      gstin: '27AABCT9981K1ZT',
      phone: '+91 00000 00000',
      email: 'demo-seed@example.test',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.test' },
    update: {},
    create: {
      dealershipId: dealership.id,
      name: 'Demo Super Admin',
      email: 'admin@example.test',
      passwordHash: await hash('ChangeMe-DemoOnly-123', 12),
      roleId: superAdminRole.id,
      isActive: true,
    },
  });

  console.log('Seed complete (demo roles + dealership + admin).');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
