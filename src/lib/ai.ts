// AI provider abstraction per ARCHITECTURE §29
export interface AIProvider {
  answer(question: string, context: string[]): Promise<string>
}
export class StubAIProvider implements AIProvider {
  async answer(question: string) {
    return "I don't have that information. Please contact our showroom."
  }
}
export const ai: AIProvider = new StubAIProvider()
