import { NextResponse } from "next/server"
import { z } from "zod"
import { getChatbotResponse } from "@/services/chatbot.service"
import { requireAuth, requireRole, authErrorResponse } from "@/lib/api-auth"

const chatbotSchema = z.object({
  question: z.string().min(1, "Question is required"),
  sessionId: z.string().min(1, "Session ID is required"),
})

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const user = await requireAuth()

  try {
    const body = await request.json()
    const validated = chatbotSchema.parse(body)

    const response = await getChatbotResponse(
      validated.question,
      validated.sessionId
    )

    return NextResponse.json({ data: response })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid request", details: error.errors } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to get chatbot response" } },
      { status: 500 }
    )
  }
}
