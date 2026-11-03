import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const uploadSchema = z.object({
  customerId: z.string().uuid(),
  documentType: z.enum(["customer_id", "finance", "insurance", "rto", "invoice", "receipt", "other"]),
  fileName: z.string().min(1),
  storageKey: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  accessLevel: z.enum(["restricted", "finance", "rto", "insurance", "admin_only"]).default("restricted"),
  uploadedBy: z.string().uuid(),
})

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = uploadSchema.parse(body)

    const document = await prisma.document.create({
      data: {
        customerId: validated.customerId,
        documentType: validated.documentType,
        fileName: validated.fileName,
        storageKey: validated.storageKey,
        mimeType: validated.mimeType,
        sizeBytes: validated.sizeBytes,
        accessLevel: validated.accessLevel,
        uploadedBy: validated.uploadedBy,
      },
    })

    return NextResponse.json({ data: document }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid upload data", details: error.errors } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to upload document" } },
      { status: 500 }
    )
  }
}
