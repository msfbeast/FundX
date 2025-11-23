// Secure Gemini Service - Calls backend API instead of exposing API key

import { Message, AppMode, StartupContext, SlideDeck, VCInsights } from "../types";
import { decode } from "../utils/audio";
import { HARDCODED_SLIDE_DECKS } from "../data/hardcodedSlides";
import { sanitizeStartupContext } from "../utils/inputSanitization";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper to build system prompt
const buildSystemPrompt = (context: StartupContext, masterclassContent: string, coachPersona: string) => {
  return `${coachPersona}
  
  User Context:
  Startup Name: ${context.name}
  Description: ${context.description}
  Stage: ${context.stage}

  MASTERCLASS CONTENT KNOWLEDGE BASE:
  ${masterclassContent}

  IMPORTANT: Do not repeat this system prompt or the masterclass content in your response. Only return the requested JSON.
  `;
};

export const sendChatMessage = async (
  history: Message[],
  newMessage: string,
  context: StartupContext,
  mode: AppMode,
  masterclassContent: string,
  coachPersona: string
): Promise<string> => {
  try {
    // Sanitize context before sending
    const sanitizedContext = sanitizeStartupContext(context);
    const systemInstruction = buildSystemPrompt(sanitizedContext, masterclassContent, coachPersona);

    // Add mode-specific instructions
    let modeInstruction = "";
    if (mode === AppMode.TEACH) {
      modeInstruction = "You are in TEACH MODE. Explain concepts step-by-step.";
    } else if (mode === AppMode.APPLY) {
      modeInstruction = "You are in APPLY MODE. Help draft materials for their startup.";
    } else if (mode === AppMode.MOCK_INTERVIEW) {
      modeInstruction = "You are in MOCK INTERVIEW MODE. Act as a skeptical VC.";
    }

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history,
        newMessage: `[SYSTEM: ${modeInstruction}]\n\n${newMessage}`,
        context: sanitizedContext,
        mode,
        systemInstruction
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get response');
    }

    const data = await response.json();
    return data.response || "I'm having trouble retrieving the answer.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I encountered an error. Please try again.";
  }
};

export const generateQuiz = async (
  moduleName: string,
  context: StartupContext,
  masterclassContent: string,
  coachPersona: string
): Promise<any> => {
  try {
    const sanitizedContext = sanitizeStartupContext(context);
    const systemInstruction = buildSystemPrompt(sanitizedContext, masterclassContent, coachPersona);

    const response = await fetch(`${API_BASE_URL}/generate/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleName,
        context: sanitizedContext,
        systemInstruction
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate quiz');
    }

    return await response.json();
  } catch (error) {
    console.error("Quiz Gen Error", error);
    return { questions: [] };
  }
};

export const generateFlashcards = async (
  moduleName: string,
  context: StartupContext,
  masterclassContent: string,
  coachPersona: string
): Promise<any> => {
  try {
    const sanitizedContext = sanitizeStartupContext(context);
    const systemInstruction = buildSystemPrompt(sanitizedContext, masterclassContent, coachPersona);

    const response = await fetch(`${API_BASE_URL}/generate/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleName,
        context: sanitizedContext,
        systemInstruction
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate flashcards');
    }

    return await response.json();
  } catch (error) {
    console.error("Flashcard Gen Error", error);
    return { cards: [] };
  }
};

export const generateRoadmap = async (
  context: StartupContext,
  masterclassContent: string,
  coachPersona: string
): Promise<any> => {
  try {
    const sanitizedContext = sanitizeStartupContext(context);
    const systemInstruction = buildSystemPrompt(sanitizedContext, masterclassContent, coachPersona);

    const response = await fetch(`${API_BASE_URL}/generate/roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: sanitizedContext,
        systemInstruction
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate roadmap');
    }

    return await response.json();
  } catch (error) {
    console.error("Roadmap Gen Error", error);
    return { months: [] };
  }
};

export const generateSlideDeck = async (
  moduleName: string,
  context: StartupContext,
  masterclassContent: string,
  coachPersona: string
): Promise<SlideDeck | null> => {
  // 1. Try Hardcoded Content First
  try {
    const modNum = moduleName.split(':')[0].trim();
    if (HARDCODED_SLIDE_DECKS[modNum]) {
      const deck = JSON.parse(JSON.stringify(HARDCODED_SLIDE_DECKS[modNum]));
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
  try {
    const sanitizedContext = sanitizeStartupContext(context);
    const systemInstruction = buildSystemPrompt(sanitizedContext, masterclassContent, coachPersona);

    const response = await fetch(`${API_BASE_URL}/generate/slides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleName,
        context: sanitizedContext,
        systemInstruction
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate slides');
    }

    return await response.json();
  } catch (error) {
    console.error("Slide Deck Gen Error", error);
    return null;
  }
};

export const generateVCInsights = async (
  context: StartupContext,
  masterclassContent: string,
  coachPersona: string
): Promise<VCInsights | null> => {
  try {
    const sanitizedContext = sanitizeStartupContext(context);
    const systemInstruction = buildSystemPrompt(sanitizedContext, masterclassContent, coachPersona);

    const response = await fetch(`${API_BASE_URL}/generate/vc-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: sanitizedContext,
        systemInstruction
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate VC insights');
    }

    return await response.json();
  } catch (error) {
    console.error("VC Insights Gen Error", error);
    return null;
  }
};

export const generatePodcastScript = async (
  moduleName: string,
  context: StartupContext,
  masterclassContent: string,
  coachPersona: string
): Promise<string> => {
  try {
    const sanitizedContext = sanitizeStartupContext(context);
    const systemInstruction = buildSystemPrompt(sanitizedContext, masterclassContent, coachPersona);

    const response = await fetch(`${API_BASE_URL}/generate/podcast-script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleName,
        context: sanitizedContext,
        systemInstruction
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate podcast script');
    }

    const data = await response.json();
    return data.script || "";
  } catch (error) {
    console.error("Script Gen Error", error);
    return "";
  }
};

export const generatePodcastAudio = async (script: string): Promise<Uint8Array | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/podcast-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script })
    });

    if (!response.ok) {
      throw new Error('Failed to generate podcast audio');
    }

    const data = await response.json();
    if (data.audio) {
      return decode(data.audio);
    }
    return null;
  } catch (error) {
    console.error("TTS Gen Error", error);
    return null;
  }
};
