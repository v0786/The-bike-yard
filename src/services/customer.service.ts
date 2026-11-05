// Customer service — CRM customer management.
// Uses new schema: fullName instead of firstName/lastName.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function createCustomer(data: {
  fullName: string;
  phone: string;
  email?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  pincode?: string | null;
  panNumber?: string | null;
  aadhaarNumber?: string | null;
}) {
  return prisma.customer.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email ?? null,
      addressLine1: data.addressLine1 ?? '',
      city: data.city ?? 'Thane',
      pincode: data.pincode ?? '400601',
      panNumber: data.panNumber ?? null,
      aadhaarNumber: data.aadhaarNumber ?? null,
    },
  });
}

export async function getCustomers(filters?: { search?: string }) {
  const where: Prisma.CustomerWhereInput = { deletedAt: null };
  if (filters?.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.customer.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      leads: true,
      bookings: true,
      sales: true,
      testRides: true,
      financeApps: true,
      insuranceApps: true,
      rtoApps: true,
      services: true,
    },
  });
}

export async function updateCustomer(
  id: string,
  data: Partial<{
    fullName: string;
    phone: string;
    email: string | null;
    addressLine1: string;
    city: string;
    pincode: string;
    panNumber: string | null;
    aadhaarNumber: string | null;
  }>
) {
  return prisma.customer.update({
    where: { id },
    data,
  });
}

export async function softDeleteCustomer(id: string) {
  return prisma.customer.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
