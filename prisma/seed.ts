import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const dealership = await prisma.dealership.create({
    data: {
      name: "The Bike Yard",
      address: "Khopat, Thane, Maharashtra, India",
      phone: "080971 72040",
    },
  })

  const roles = await Promise.all([
    prisma.role.create({ data: { name: "Super Admin", dealershipId: dealership.id } }),
    prisma.role.create({ data: { name: "Owner", dealershipId: dealership.id } }),
    prisma.role.create({ data: { name: "Manager", dealershipId: dealership.id } }),
    prisma.role.create({ data: { name: "Sales Exec", dealershipId: dealership.id } }),
    prisma.role.create({ data: { name: "Accountant", dealershipId: dealership.id } }),
    prisma.role.create({ data: { name: "Insurance Staff", dealershipId: dealership.id } }),
    prisma.role.create({ data: { name: "RTO Staff", dealershipId: dealership.id } }),
  ])

  const adminRole = roles.find((r) => r.name === "Super Admin")
  await prisma.user.create({
    data: {
      email: "admin@thebikeyard.local",
      passwordHash: await hash("changed-immediately", 12),
      firstName: "Super",
      lastName: "Admin",
      roleId: adminRole!.id,
      dealershipId: dealership.id,
      isActive: true,
    },
  })

  console.log("Seed complete")
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
