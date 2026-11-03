// AI chatbot service — dealership-grounded responses (stub provider for MVP).
// Per PRD.md §14: no hallucinated prices/stock. Grounded in dealership data only.

import { prisma } from "@/lib/prisma"

interface ChatbotMessage {
  role: "user" | "assistant"
  content: string
}

export async function getKnowledgeSources() {
  return prisma.chatbotKnowledgeSource.findMany({
    where: { isActive: true },
  })
}

export async function getChatbotResponse(
  question: string,
  sessionId: string
): Promise<{ answer: string; source?: string }> {
  const questionLower = question.toLowerCase()

  // Fetch active knowledge sources
  const sources = await prisma.chatbotKnowledgeSource.findMany({
    where: { isActive: true },
  })

  // Simple keyword matching (stub — replace with AI provider in later phase)
  const answer = matchQuestionToKnowledge(questionLower, sources)

  // Log the interaction
  await prisma.chatbotFeedback.create({
    data: {
      sessionId,
      question,
      answer: answer.answer,
    },
  })

  return answer
}

function matchQuestionToKnowledge(
  question: string,
  sources: Array<{ title: string; content: string; sourceType: string }>
): { answer: string; source?: string } {
  // Check for price/stock questions — never invent data
  const priceKeywords = ["price", "cost", "₹", "rupee", "lakh", "thousand"]
  const stockKeywords = ["available", "stock", "in stock", "buy"]

  const asksPrice = priceKeywords.some((k) => question.includes(k))
  const asksStock = stockKeywords.some((k) => question.includes(k))

  // If asking about price/stock and no knowledge source covers it, decline
  if (asksPrice || asksStock) {
    const relevant = sources.find(
      (s) =>
        (s.sourceType === "catalogue" || s.sourceType === "faq") &&
        (s.content.toLowerCase().includes(question.split(" ")[0]) ||
          question.includes(s.title.toLowerCase().split(" ")[0]))
    )
    if (relevant) {
      return { answer: relevant.content, source: relevant.title }
    }
    return {
      answer:
        "I don't have current pricing or stock availability for that bike. Please enquire with our showroom for the latest prices and availability.",
      source: undefined,
    }
  }

  // General knowledge match
  const relevant = sources.find((s) =>
    question.includes(s.title.toLowerCase().split(" ")[0])
  )
  if (relevant) {
    return { answer: relevant.content, source: relevant.title }
  }

  // FAQ match
  const faqMatch = sources.find((s) => s.sourceType === "faq")
  if (faqMatch) {
    return {
      answer:
        "I couldn't find specific information about that. Please contact our showroom at Khopat, Thane for assistance.",
      source: "FAQ",
    }
  }

  return {
    answer:
      "I'm here to help with bike information, variants, pricing estimates, finance, insurance, and service enquiries. How can I assist you?",
    source: undefined,
  }
}

export async function recordFeedback(sessionId: string, question: string, answer: string, helpful: boolean) {
  return prisma.chatbotFeedback.create({
    data: { sessionId, question, answer, helpful },
  })
}
