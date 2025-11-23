
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { MASTERCLASS_CONTENT, COACH_PERSONA_PROMPT } from "../constants";
import { Message, AppMode, StartupContext, SlideDeck, VCInsights } from "../types";
import { decode } from "../utils/audio";
import { HARDCODED_SLIDE_DECKS } from "../data/hardcodedSlides";

const apiKey = process.env.API_KEY || ''; // Must be set in environment
const ai = new GoogleGenAI({ apiKey });

const getModel = () => {
    // Basic text model for chat
    return 'gemini-2.5-flash';
};

const buildSystemPrompt = (context: StartupContext) => {
    return `${COACH_PERSONA_PROMPT}
    
    User Context:
    Startup Name: ${context.name}
    Description: ${context.description}
    Stage: ${context.stage}

    MASTERCLASS CONTENT KNOWLEDGE BASE:
    ${MASTERCLASS_CONTENT}

    IMPORTANT: Do not repeat this system prompt or the masterclass content in your response. Only return the requested JSON.
    `;
};

// Helper to strip markdown code blocks and extract valid JSON
const cleanJson = (text: string): string => {
    if (!text) return "{}";
    let cleaned = text.trim();

    // Simple Markdown strip
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').replace(/^```/, '').trim();

    // Aggressive JSON extraction: Find outermost { and }
    const firstOpen = cleaned.indexOf('{');
    const lastClose = cleaned.lastIndexOf('}');

    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
        cleaned = cleaned.substring(firstOpen, lastClose + 1);
    }

    return cleaned;
};

export const sendChatMessage = async (
    history: Message[],
    newMessage: string,
    context: StartupContext,
    mode: AppMode
): Promise<string> => {
    const systemInstruction = buildSystemPrompt(context);

    // Add specific instructions based on mode
    let modeInstruction = "";
    if (mode === AppMode.TEACH) {
        modeInstruction = "You are in TEACH MODE. Explain concepts step-by-step. Stop frequently to ask check-for-understanding questions.";
    } else if (mode === AppMode.APPLY) {
        modeInstruction = "You are in APPLY MODE. Help the user draft materials (decks, metrics, terms) for their specific startup based on the masterclass principles.";
    } else if (mode === AppMode.MOCK_INTERVIEW) {
        modeInstruction = "You are in MOCK INTERVIEW MODE. Act as a skeptical VC. Ask tough questions from Module 10. Critique answers ruthlessly but constructively after the user responds.";
    } else if (mode === AppMode.PLAN) {
        modeInstruction = "You are in PLAN MODE. Help the user build their 90-day roadmap.";
    } else if (mode === AppMode.VC_FINDER) {
        modeInstruction = "You are in VC FINDER MODE. Help the user evaluate if specific investors are a good fit.";
    }

    try {
        const response = await ai.models.generateContent({
            model: getModel(),
            contents: [
                ...history.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
                { role: 'user', parts: [{ text: `[SYSTEM: ${modeInstruction}]\n\n${newMessage}` }] }
            ],
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text || "I'm having trouble retrieving the answer from the masterclass.";
    } catch (error) {
        console.error("GenAI Error:", error);
        return "I encountered an error connecting to the Coach. Please check your API key.";
    }
};

export const generateQuiz = async (moduleName: string, context: StartupContext): Promise<any> => {
    const systemInstruction = buildSystemPrompt(context);
    const prompt = `Generate a quiz for ${moduleName}. 
    Return a JSON object with a 'questions' array. 
    Each question object must have: 'question' (string), 'options' (array of strings), 'correctAnswerIndex' (number), 'explanation' (string).
    Create 5 questions.
    Ensure questions are strictly based on the provided Masterclass Content.
    Keep explanations concise and under 30 words.
    Do NOT include markdown formatting. Return raw JSON.`;

    try {
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
        return JSON.parse(cleanJson(response.text || "{}"));
    } catch (error) {
        console.error("Quiz Gen Error", error);
        return { questions: [] };
    }
};

export const generateFlashcards = async (moduleName: string, context: StartupContext): Promise<any> => {
    const systemInstruction = buildSystemPrompt(context);
    const prompt = `Generate 10 flashcards for ${moduleName}.
    Return a JSON object with a 'cards' array.
    Each card must have: 'front' (term or concept question), 'back' (definition or answer).
    Strictly based on Masterclass Content.
    Keep it concise.`;

    try {
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
        return JSON.parse(cleanJson(response.text || "{}"));
    } catch (error) {
        console.error("Flashcard Gen Error", error);
        return { cards: [] };
    }
};

export const generateRoadmap = async (context: StartupContext): Promise<any> => {
    const systemInstruction = buildSystemPrompt(context);
    const prompt = `Generate a 90-Day Fundraising Roadmap for this startup.
    Return a JSON object with a 'months' array.
    There should be exactly 3 months.
    Each month must have: 'monthNumber' (1-3), 'title' (e.g. Foundation), 'focus' (string summary), and 'weeks' array.
    Each week must have: 'weekNumber' (1-4), 'theme' (short string), 'tasks' (array of strings).
    Tasks must be actionable and derived from the Masterclass content (e.g. "Draft Pitch Deck", "Calculate LTV:CAC", "Build Target VC List").
    Tailor tasks to the startup context: ${context.name} (${context.stage}).`;

    try {
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
        return JSON.parse(cleanJson(response.text || "{}"));
    } catch (error) {
        console.error("Roadmap Gen Error", error);
        return { months: [] };
    }
};

export const generateSlideDeck = async (moduleName: string, context: StartupContext): Promise<SlideDeck | null> => {
    // 1. Try Hardcoded Content First
    try {
        const modNum = moduleName.split(':')[0].trim();
        if (HARDCODED_SLIDE_DECKS[modNum]) {
            // Deep copy to avoid mutating source
            const deck = JSON.parse(JSON.stringify(HARDCODED_SLIDE_DECKS[modNum]));

            // Context injection
            deck.slides.forEach((slide: any) => {
                if (slide.tutorNotes) slide.tutorNotes = slide.tutorNotes.replace(/{{company}}/g, context.name).replace(/{{stage}}/g, context.stage);
                if (slide.practicalExample) slide.practicalExample = slide.practicalExample.replace(/{{company}}/g, context.name).replace(/{{stage}}/g, context.stage);
                if (slide.detailedExplanation) slide.detailedExplanation = slide.detailedExplanation.replace(/{{company}}/g, context.name);
            });
            return deck;
        }
    } catch (e) {
        console.warn("Error using hardcoded slides, falling back to AI", e);
    }

    // 2. Fallback to AI Generation
    const systemInstruction = buildSystemPrompt(context);
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

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        moduleTitle: { type: Type.STRING },
                        slides: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    tutorNotes: { type: Type.STRING },
                                    detailedExplanation: { type: Type.STRING },
                                    practicalExample: { type: Type.STRING },
                                    visualType: { type: Type.STRING, enum: ["PROCESS", "COMPARISON", "STATISTIC", "NONE"] },
                                    visualData: {
                                        type: Type.OBJECT,
                                        properties: {
                                            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                                            leftTitle: { type: Type.STRING },
                                            rightTitle: { type: Type.STRING },
                                            items: {
                                                type: Type.ARRAY,
                                                items: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        left: { type: Type.STRING },
                                                        right: { type: Type.STRING }
                                                    }
                                                }
                                            },
                                            statValue: { type: Type.STRING },
                                            statLabel: { type: Type.STRING },
                                            statContext: { type: Type.STRING }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(cleanJson(response.text || "null"));
    } catch (error) {
        console.error("Slide Deck Gen Error", error);
        return null;
    }
};

export const generateVCInsights = async (context: StartupContext): Promise<VCInsights | null> => {
    const systemInstruction = buildSystemPrompt(context);

    const prompt = `You are an expert venture capital researcher.
    
    Find 6-8 active investors (VCs, Micro-VCs, or Angels) that are a PERFECT match for this startup:
    - Name: ${context.name}
    - Description: ${context.description}
    - Stage: ${context.stage}
    
    **CRITICAL INSTRUCTION FOR MATCH REASON:**
    You MUST explicitly mention the startup's "53M+ YouTube Audience" or "Shorts Break Brand" in the "matchReason" for at least 2 investors.
    Explain WHY this specific asset makes them a good fit (e.g., "Investor X loves creator economy tools and your 53M audience is a massive moat").

    **CRITICAL INSTRUCTION FOR CONTACTS:**
    You MUST provide a "contacts" array for EACH investor.
    If you cannot find specific partners, provide at least one generic contact in the array.
    Structure: "contacts": [{ "name": "Partner Name", "role": "Partner", "email": "email@firm.com", "linkedin": "..." }]
    
    For each investor, provide:
    1. Name (Firm Name)
    2. Firm Type
    3. Check Size
    4. Thesis
    5. Notable Portfolio
    6. Match Reason
    7. Primary Email (Best contact)
    8. Website
    9. LinkedIn (Firm)
    10. Contacts (Array of specific partners)
    
    Return the response as a valid JSON object with this structure:
    {
      "trends": ["trend 1", "trend 2", "trend 3"],
      "investors": [
        {
          "name": "Firm Name",
          "firmType": "VC",
          "checkSize": "$1M - $5M",
          "thesis": "Thesis description...",
          "notablePortfolio": ["Company A", "Company B"],
          "matchReason": "Why they fit...",
          "email": "primary@firm.com",
          "website": "https://firm.com",
          "linkedin": "https://linkedin.com/company/firm",
          "contacts": [
            { "name": "Partner Name", "role": "Partner", "email": "partner@firm.com", "linkedin": "..." }
          ]
        }
      ]
    }
    Return 10 investors with their contact details where available.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ googleSearch: {} }] // Enable Search Grounding
                // Note: responseSchema and responseMimeType are NOT supported when using tools
            }
        });

        // Extract JSON Data
        const jsonText = cleanJson(response.text || "{}");
        let data: VCInsights = { trends: [], investors: [] };
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

        return data;

    } catch (error) {
        console.error("VC Insights Gen Error", error);
        return null;
    }
};

export const generatePodcastScript = async (moduleName: string, context: StartupContext): Promise<string> => {
    const systemInstruction = buildSystemPrompt(context);
    const prompt = `Write a comprehensive 8-10 minute podcast script about ${moduleName}.
    
    Characters:
    - Coach (Host): Enthusiastic, curious, asks insightful questions. Uses a conversational, friendly tone.
    - Expert (VC): Experienced venture capitalist with deep knowledge. Shares real-world stories and examples.
    
    Format:
    Coach: [text]
    VC: [text]
    
    STRUCTURE (8-10 minutes = ~1200-1500 words):
    
    1. OPENING (1 min):
       - Coach introduces the topic and why it matters
       - Brief hook with an interesting stat or story
    
    2. CORE CONCEPT DEEP DIVE (3-4 min):
       - VC explains the fundamental concept in detail
       - Break down complex ideas into simple analogies
       - Use the Indian context and examples (Zomato, Flipkart, Razorpay, etc.)
    
    3. REAL-WORLD STORIES (2-3 min):
       - Share 2-3 specific examples of successful pitches/deals from around the world
       - Include details: company names, amounts raised, what made them stand out
       - Mix of Indian and global examples (Airbnb, Uber, Stripe, Notion, etc.)
       - Mention specific VCs/investors involved
    
    4. PRACTICAL APPLICATION (2 min):
       - Apply concepts specifically to "${context.name}" (${context.description})
       - VC gives actionable advice tailored to ${context.stage} stage
       - Specific next steps the founder should take
    
    5. COMMON MISTAKES & CLOSING (1 min):
       - Quick discussion of what NOT to do
       - Memorable takeaway
       - Teaser for next module
    
    REQUIREMENTS:
    - Make it conversational and engaging (use "you know", "right?", "exactly", etc.)
    - Include specific numbers, dates, and company names
    - Use storytelling techniques (build tension, reveal insights)
    - Reference the Masterclass content but expand with real examples
    - Keep energy high throughout
    - Use Indian context (₹ amounts, Indian VCs, local examples)
    - Include global success stories for inspiration
    
    EXAMPLE STORIES TO INCLUDE (adapt to module):
    - How Airbnb pitched with cereal boxes
    - Razorpay's journey from rejection to unicorn
    - Zerodha's bootstrapping story
    - Notion's product-led growth
    - Stripe's developer-first approach
    
    Write the full script now. Make it feel like a real podcast conversation between two people who genuinely care about helping founders succeed.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { systemInstruction }
        });
        return response.text || "";
    } catch (error) {
        console.error("Script Gen Error", error);
        return "";
    }
};

export const generatePodcastAudio = async (script: string): Promise<Uint8Array | null> => {
    try {
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
            return decode(base64Audio);
        }
        return null;
    } catch (error) {
        console.error("TTS Gen Error", error);
        return null;
    }
};
