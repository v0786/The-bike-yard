import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireRole, authErrorResponse } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await requireRole(["Manager", "Super Admin", "Owner", "Accountant"])

  try {
    const invoices = await prisma.invoice.findMany({
      include: { sale: { include: { customer: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: invoices })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch invoices" } },
      { status: 500 }
    )
  }
}
