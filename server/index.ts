import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, Modality } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 AI requests per windowMs
  message: 'Too many AI generation requests, please try again later.'
});

app.use('/api/', generalLimiter);

// Initialize Gemini AI (server-side only)
const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.error('⚠️  GEMINI_API_KEY not found in environment variables');
}
const ai = new GoogleGenAI({ apiKey });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper to clean JSON from AI responses
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

// Chat endpoint
app.post('/api/chat', aiLimiter, async (req, res) => {
  try {
    const { history, newMessage, context, mode, systemInstruction } = req.body;

    if (!newMessage || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map((m: any) => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: newMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ response: response.text || "I'm having trouble retrieving the answer." });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

// Quiz generation endpoint
app.post('/api/generate/quiz', aiLimiter, async (req, res) => {
  try {
    const { moduleName, context, systemInstruction } = req.body;

    if (!moduleName || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Generate a quiz for ${moduleName}. 
    Return a JSON object with a 'questions' array. 
    Each question object must have: 'question' (string), 'options' (array of strings), 'correctAnswerIndex' (number), 'explanation' (string).
    Create 5 questions.
    Ensure questions are strictly based on the provided Masterclass Content.
    Keep explanations concise and under 30 words.
    Do NOT include markdown formatting. Return raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(cleanJson(response.text || "{}"));
    res.json(data);
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
});

// Flashcards generation endpoint
app.post('/api/generate/flashcards', aiLimiter, async (req, res) => {
  try {
    const { moduleName, context, systemInstruction } = req.body;

    if (!moduleName || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Generate 10 flashcards for ${moduleName}.
    Return a JSON object with a 'cards' array.
    Each card must have: 'front' (term or concept question), 'back' (definition or answer).
    Strictly based on Masterclass Content.
    Keep it concise.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(cleanJson(response.text || "{}"));
    res.json(data);
  } catch (error: any) {
    console.error('Flashcards generation error:', error);
    res.status(500).json({ error: 'Failed to generate flashcards', details: error.message });
  }
});

// Roadmap generation endpoint
app.post('/api/generate/roadmap', aiLimiter, async (req, res) => {
  try {
    const { context, systemInstruction } = req.body;

    if (!context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Generate a 90-Day Fundraising Roadmap for this startup.
    Return a JSON object with a 'months' array.
    There should be exactly 3 months.
    Each month must have: 'monthNumber' (1-3), 'title' (e.g. Foundation), 'focus' (string summary), and 'weeks' array.
    Each week must have: 'weekNumber' (1-4), 'theme' (short string), 'tasks' (array of strings).
    Tasks must be actionable and derived from the Masterclass content.
    Tailor tasks to the startup context: ${context.name} (${context.stage}).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            months: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  monthNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  weeks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        weekNumber: { type: Type.INTEGER },
                        theme: { type: Type.STRING },
                        tasks: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(cleanJson(response.text || "{}"));
    res.json(data);
  } catch (error: any) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap', details: error.message });
  }
});

// Slide deck generation endpoint
app.post('/api/generate/slides', aiLimiter, async (req, res) => {
  try {
    const { moduleName, context, systemInstruction } = req.body;

    if (!moduleName || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Create a 5-7 slide educational deck for Module: "${moduleName}".
    Target Audience: Founder of "${context.name}" (${context.stage} stage).
    
    Structure the response as a JSON object with a 'slides' array.
    Each slide must have:
    - title: Brief slide title
    - bullets: 3-5 key learning points (strings).
    - tutorNotes: A friendly paragraph explaining the slide.
    - detailedExplanation: A 150-word detailed explanation.
    - practicalExample: A specific example for "${context.name}".
    - visualType: One of "PROCESS", "COMPARISON", "STATISTIC", or "NONE".
    - visualData: Object containing data for the visual.
    
    Make content educational and derived from the Masterclass.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(cleanJson(response.text || "null"));
    res.json(data);
  } catch (error: any) {
    console.error('Slides generation error:', error);
    res.status(500).json({ error: 'Failed to generate slides', details: error.message });
  }
});

// VC Insights generation endpoint
app.post('/api/generate/vc-insights', aiLimiter, async (req, res) => {
  try {
    const { context, systemInstruction } = req.body;

    if (!context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    const jsonText = cleanJson(response.text || "{}");
    let data: any = { trends: [], investors: [] };
    
    try {
      data = JSON.parse(jsonText);
      // Fallback for contacts
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
});

// Podcast script generation endpoint
app.post('/api/generate/podcast-script', aiLimiter, async (req, res) => {
  try {
    const { moduleName, context, systemInstruction } = req.body;

    if (!moduleName || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Write a comprehensive 8-10 minute podcast script about ${moduleName}.
    
    Characters:
    - Coach (Host): Enthusiastic, curious, asks insightful questions.
    - Expert (VC): Experienced venture capitalist with deep knowledge.
    
    Format:
    Coach: [text]
    VC: [text]
    
    Make it conversational and engaging with real examples.
    Apply concepts specifically to "${context.name}" (${context.description}).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction }
    });

    res.json({ script: response.text || "" });
  } catch (error: any) {
    console.error('Podcast script generation error:', error);
    res.status(500).json({ error: 'Failed to generate podcast script', details: error.message });
  }
});

// Podcast audio generation endpoint
app.post('/api/generate/podcast-audio', aiLimiter, async (req, res) => {
  try {
    const { script } = req.body;

    if (!script) {
      return res.status(400).json({ error: 'Missing script' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: script }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              { speaker: 'Coach', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
              { speaker: 'VC', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
            ]
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      res.json({ audio: base64Audio });
    } else {
      res.status(500).json({ error: 'No audio generated' });
    }
  } catch (error: any) {
    console.error('Podcast audio generation error:', error);
    res.status(500).json({ error: 'Failed to generate podcast audio', details: error.message });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`🔒 API Key: ${apiKey ? '✅ Loaded' : '❌ Missing'}`);
});
