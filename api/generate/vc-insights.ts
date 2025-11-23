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
    const { context, systemInstruction } = req.body;

    if (!context) {
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

    const prompt = `You are an expert venture capital researcher.
    
    Find 6-8 active investors (VCs, Micro-VCs, or Angels) that are a PERFECT match for this startup:
    - Name: ${context.name}
    - Description: ${context.description}
    - Stage: ${context.stage}
    
    For each investor, provide:
    1. Name (Firm Name)
    2. Firm Type
    3. Check Size
    4. Thesis
    5. Notable Portfolio
    6. Match Reason
    7. Primary Email
    8. Website
    9. LinkedIn
    10. Contacts (Array of partners)
    
    Return as valid JSON with structure:
    {
      "trends": ["trend 1", "trend 2"],
      "investors": [...]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonText = cleanJson(response);
    
    let data: any = { trends: [], investors: [] };
    
    try {
      data = JSON.parse(jsonText);
      if (data.investors) {
        data.investors = data.investors.map((inv: any) => ({
          ...inv,
          contacts: (inv.contacts && inv.contacts.length > 0)
            ? inv.contacts
            : [{
                name: "Partner Team",
                role: "Investment Team",
                email: inv.email || "hello@fund.com",
                linkedin: inv.linkedin
              }]
        }));
      }
    } catch (e) {
      console.warn("Failed to parse VC Insights JSON", e);
    }

    res.json(data);
  } catch (error: any) {
    console.error('VC Insights generation error:', error);
    res.status(500).json({ error: 'Failed to generate VC insights', details: error.message });
  }
}
