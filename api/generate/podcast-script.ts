import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const { moduleName, context, systemInstruction } = req.body;

    if (!moduleName || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction
    });

    const prompt = `Generate a podcast script for ${moduleName}.
    Create an engaging conversation between two hosts discussing the key concepts.
    Make it conversational, informative, and engaging.
    Length: 3-5 minutes when spoken.
    Based strictly on the masterclass content provided.`;

    const result = await model.generateContent(prompt);
    const script = result.response.text();
    
    res.json({ script });
  } catch (error: any) {
    console.error('Podcast script generation error:', error);
    res.status(500).json({ error: 'Failed to generate podcast script', details: error.message });
  }
}
