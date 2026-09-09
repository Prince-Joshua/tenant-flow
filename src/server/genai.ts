import { GoogleGenerativeAI } from '@google/generative-ai';
import type { DocumentTone, DocumentLength } from '@tenantflow/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const toneMap: Record<DocumentTone, string> = {
  professional: 'formal and professional',
  casual: 'friendly and conversational',
  persuasive: 'compelling and persuasive',
  technical: 'precise and technical',
};

export const lengthMap: Record<DocumentLength, string> = {
  short: 'approximately 150 words',
  medium: 'approximately 400 words',
  long: 'approximately 800 words',
};

export function buildPrompt(prompt: string, tone?: string, length?: string): string {
  const toneText = toneMap[tone as DocumentTone] || toneMap.professional;
  const lengthText = lengthMap[length as DocumentLength] || lengthMap.medium;
  return `You are an expert content writer. Write a ${toneText} piece of content. The content should be ${lengthText} long. Topic: ${prompt}. Rules: Do not include a title. Write in well structured paragraphs. Do not use markdown. Start immediately.`;
}

export async function generateContent(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
