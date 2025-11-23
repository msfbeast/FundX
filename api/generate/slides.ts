import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const cleanJson = (text: string): string => {
  if (!text) return "{}";
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').replace(/^```/, '').trim();
  const firstOpen = cleaned.indexOf('{');
  const lastClose = cleaned.lastIndexOf('}');
  if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
    cleaned = cleaned.substring(firstOpen, lastClose + 1);
  }
  return cleaned;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, context, systemInstruction } = req.body;

    if (!topic || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `Generate presentation slides for: ${topic}.
    Return JSON with 'slides' array.
    Each slide: 'title', 'content' (array of bullet points).
    Create 8-10 slides.
    Based on masterclass content.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const data = JSON.parse(cleanJson(response));
    
    res.json(data);
  } catch (error: any) {
    console.error('Slides generation error:', error);
    res.status(500).json({ error: 'Failed to generate slides', details: error.message });
  }
}
