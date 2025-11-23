
import { GoogleGenAI } from "@google/genai";
import { VCProfile, StartupContext } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePersonalizedEmail = async (
    vc: VCProfile,
    context: StartupContext
): Promise<string> => {
    const prompt = `You are an expert fundraising consultant helping a founder craft the perfect cold email to a VC.

**Startup Context:**
- Name: ${context.name}
- Description: ${context.description}
- Stage: ${context.stage}

**Target VC:**
- Name: ${vc.name}
- Type: ${vc.firmType}
- Thesis: ${vc.thesis}
- Notable Portfolio: ${vc.notablePortfolio.join(', ')}
- Why they're a fit: ${vc.matchReason}

**CRITICAL INSTRUCTION - RECIPIENT DETECTION:**
Analyze the "Name" field ("${vc.name}"):
1. **Specific Partner Found** (e.g., "Blume (Karthik Reddy)"): 
   - Address them by First Name (e.g., "Hi Karthik,")
   - Tone: Personal, referencing their specific work/thesis.
2. **Generic Firm Name** (e.g., "Blume Ventures"):
   - Address as "Hi ${vc.name} Team," or "Dear Investment Team,"
   - Tone: Professional, asking to be directed to the right partner.
   - **Action:** Ask them to route this to the partner who handles ${context.stage} ${context.description} startups.

**Task:** Write a personalized cold email that:

1. **Subject Line** (compelling, under 50 characters)
   - Reference their portfolio or thesis
   - Create curiosity without being clickbait

2. **Opening** (1-2 sentences)
   - Show you've done research
   - If specific partner: Mention *their* specific deal or tweet.
   - If generic firm: Mention the *firm's* recent activity.

3. **The Hook** (2-3 sentences)
   - Clearly state what ${context.name} does
   - Why it's relevant to their thesis
   - One compelling traction metric or insight

4. **The Ask** (1-2 sentences)
   - Clear, specific call-to-action
   - If specific partner: "15-min call"
   - If generic firm: "Could you point me to the right partner for this?"

5. **Closing** (1 sentence)
   - Professional but warm
   - Include founder name placeholder: [Your Name]

**CRITICAL RULES:**
- Keep total email under 150 words
- No generic phrases like "I hope this email finds you well"
- No buzzwords or jargon
- Be specific, not vague
- Show, don't tell (use numbers/examples)
- Match their communication style
- Make it sound human, not AI-generated

**Format:**
Subject: [subject line]

[Email body]

Best,
[Your Name]
Founder, ${context.name}
[Your Email]
[Your Phone]

Write the email now.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text || "Unable to generate email at this time.";
    } catch (error) {
        console.error("Email Generation Error", error);
        return "Unable to generate email. Please try again later.";
    }
};
