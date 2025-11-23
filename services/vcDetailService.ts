
import { GoogleGenAI } from "@google/genai";
import { VCProfile } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDetailedVCInfo = async (vcProfile: VCProfile): Promise<string> => {
   const prompt = `You are a venture capital research analyst. Provide comprehensive, detailed information about this investor:

    VC/Investor Name: ${vcProfile.name}
    Type: ${vcProfile.firmType}
    Thesis: ${vcProfile.thesis}
    
    Please research and provide a detailed report covering:
    
    1. **Background & History** (2-3 paragraphs)
       - When was the firm founded?
       - Who are the founding partners?
       - Evolution and growth of the firm
    
    2. **Investment Strategy** (2-3 paragraphs)
       - Detailed investment thesis
       - Sectors and stages they focus on
       - Geographic preferences
       - Typical check sizes and ownership targets
    
    3. **Portfolio Highlights** (2-3 paragraphs)
       - Notable successful investments
       - Unicorns or exits in their portfolio
       - Recent investments (last 12 months)
       - Portfolio company support and value-add
    
    4. **Team & Partners - CRITICAL** (2-3 paragraphs)
       - Key decision makers
       - **Identify the specific partner who leads investments in this sector** (based on the thesis: ${vcProfile.thesis})
       - Partner backgrounds and expertise
       - If the VC Name provided is generic (e.g. "Sequoia"), explicitly identify WHO to pitch to.
    
    5. **How to Approach Them** (1-2 paragraphs)
       - Best way to get an introduction
       - What they look for in pitches
       - Red flags to avoid
       - Typical deal timeline
    
    6. **Recent Activity & News** (1-2 paragraphs)
       - Latest fund raises
       - Recent announcements
       - Market positioning
    
    Format the response in clean markdown with proper headings (##) and bullet points where appropriate.
    Include specific numbers, dates, and company names wherever possible.
    Make it comprehensive but readable - aim for 800-1000 words.
    
    If you don't have complete information, use your knowledge to provide the most accurate and helpful insights possible.
    Focus on actionable intelligence that would help a founder decide if this is the right investor for them.`;

   try {
      const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: prompt,
         config: {
            tools: [{ googleSearch: {} }] // Enable search for latest info
         }
      });

      return response.text || "Unable to fetch detailed information at this time.";
   } catch (error) {
      console.error("Detailed VC Info Error", error);
      return "Unable to fetch detailed information. Please try again later.";
   }
};
