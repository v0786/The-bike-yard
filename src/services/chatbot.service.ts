// AI chatbot service — dealership-grounded responses (stub provider for MVP).
// Per PRD.md §14: no hallucinated prices/stock. Grounded in dealership data only.

import { prisma } from '@/lib/prisma';

export async function getKnowledgeSources() {
  return prisma.chatbotKnowledgeSource.findMany({
    where: { isGround: true },
  });
}

export async function getChatbotResponse(
  question: string,
  _sessionId: string
): Promise<{ answer: string; source?: string }> {
  const questionLower = question.toLowerCase();

  // Fetch active knowledge sources
  const sources = await prisma.chatbotKnowledgeSource.findMany({
    where: { isGround: true },
  });

  // Simple keyword matching (stub — replace with AI provider in later phase)
  const answer = matchQuestionToKnowledge(questionLower, sources);

  // Log the interaction for later quality review
  await prisma.chatbotFeedback.create({
    data: {
      query: question,
      response: answer.answer,
      isHelpful: false,
    },
  });

  return answer;
}

function matchQuestionToKnowledge(
  question: string,
  sources: Array<{ topic: string; content: string }>
): { answer: string; source?: string } {
  // Check for price/stock questions — never invent data
  const priceKeywords = ['price', 'cost', '₹', 'rupee', 'lakh', 'thousand'];
  const stockKeywords = ['available', 'stock', 'in stock', 'buy'];

  const asksPrice = priceKeywords.some((k) => question.includes(k));
  const asksStock = stockKeywords.some((k) => question.includes(k));

  // If asking about price/stock and no knowledge source covers it, decline
  if (asksPrice || asksStock) {
    const relevant = sources.find(
      (s) =>
        (s.topic === 'catalogue' || s.topic === 'faq') &&
        s.content.toLowerCase().includes(question.split(' ')[0] || '')
    );
    if (relevant) {
      return { answer: relevant.content, source: relevant.topic };
    }
    return {
      answer:
        "I don't have current pricing or stock availability for that bike. Please enquire with our showroom for the latest prices and availability.",
    };
  }

  // General knowledge match on topic
  const relevant = sources.find((s) => question.includes(s.topic.toLowerCase()));
  if (relevant) {
    return { answer: relevant.content, source: relevant.topic };
  }

  // FAQ match
  const faqMatch = sources.find((s) => s.topic === 'faq');
  if (faqMatch) {
    return {
      answer:
        "I couldn't find specific information about that. Please contact our showroom for assistance.",
      source: 'faq',
    };
  }

  return {
    answer:
      "I'm here to help with bike information, variants, pricing estimates, finance, insurance, and service enquiries. How can I assist you?",
  };
}

export async function recordFeedback(question: string, answer: string, helpful: boolean) {
  return prisma.chatbotFeedback.create({
    data: { query: question, response: answer, isHelpful: helpful },
  });
}
