// This file contains the Masterclass content provided by the user.
import { StartupContext } from './types';

export const MASTERCLASS_CONTENT = `
# The Funding Masterclass: Simple & Actionable (Indian Edition)

## PHASE 1: THE BASICS
1. **What is a Startup?**: It's a baby rocket ship, not a small shop. Growth is everything.
2. **The Funding Levels**: Level 1 (Pre-Seed ₹40L) -> Level 2 (Seed ₹4Cr) -> Level 3 (Series A).
3. **Equity vs. Debt**: Selling a slice of your pizza (Equity) vs. Taking a loan (Debt).
4. **How VCs Think**: They are treasure hunters looking for 100x returns. They accept high risk.
5. **India Story**: Why investors love India right now (Digital adoption, UPI, huge market).

## PHASE 2: GETTING THE FIRST CASH
6. **Bootstrapping**: Using your own savings. You are the boss. No dilution.
7. **Friends & Family**: The "Love Money". Be careful, don't ruin Thanksgiving dinner.
8. **Angel Investors**: Rich folks who want to help you start. They write the first real cheques.
9. **Accelerators**: Startup Schools (like YC or 100X.VC) that teach you and pay you.
10. **Pre-Seed vs Seed**: Selling a Dream (Pre-Seed) vs. Selling Results (Seed).

## PHASE 3: THE RULES OF MONEY
11. **Equity Explained**: The Pizza Analogy. You give up slices to get dough (money).
12. **The iSAFE Note**: The standard Indian quick-deal contract. No valuation fights today.
13. **Convertible Notes**: A loan that magically turns into shares later.
14. **Valuation Basics**: The Price Tag on your startup. Pre-Money (Before cash) vs Post-Money (After).
15. **Setting the Price**: Look at neighbors (Comps). It's an art, not math.

## PHASE 4: TELLING YOUR STORY
16. **The Pitch Story**: Don't be boring. Heroes, Villains, and a Better Future.
17. **Vitamin vs Painkiller**: Vitamins are nice. Painkillers are NEEDED. Be a Painkiller.
18. **Market Size (TAM)**: How big is the pond? Investors only fish in big ponds.
19. **Making Money**: Ads? Subscriptions? Micro-payments? Keep it simple.
20. **The Moat**: Why can't Google just copy you and crush you?

## PHASE 5: THE SCOREBOARD
21. **Retention**: Do users come back tomorrow? The most important number.
22. **Revenue (MRR)**: Monthly Recurring Revenue. Predictable cash flow is king.
23. **Unit Economics**: Do you make money on each customer? (LTV > CAC).
24. **Financial Modeling**: Guesses about the future. Burn rate and runway.

## PHASE 6: CLOSING THE DEAL
25. **Investor Pipeline**: Making a list of 50 targets.
26. **The Warm Intro**: Why cold emails fail and friends of friends win.
27. **The Pitch Meeting**: It's a performance. Energy matters.
28. **Term Sheet Economics**: Who gets paid first? (Liquidation Preference).
29. **Term Sheet Control**: Who is the boss? (Board seats).
30. **Closing the Deal**: Signing papers and getting the wire transfer.
`;

export const DEFAULT_CONTEXT: StartupContext = {
    name: "ShortsBreak+",
    pitch: "ShortsBreak+ is a family-friendly, multi-profile micro-OTT platform targeting India's ₹96,000 crore family entertainment market. We solve the critical trust and safety crisis plaguing the $500 million micro-drama sector by combining Netflix-style multi-profiles, transparent billing, educational content, and a built-in 53 million YouTube subscriber audience (Shorts Break, Take a Break, etc.). Unlike competitors with 'subscription trap' dark patterns, we offer a genuine free trial and granular parental controls.",
    stage: "Seed",
    roundSize: "$2M - $5M",
    traction: "53M+ combined YouTube subscribers (Shorts Break, Take a Break, Kay Vishay). 39.6B+ total views. ₹600k-1.4M monthly YouTube revenue. 1000+ hours of content library ready. Launching Jan 2026 with projected 500k+ Day 1 users.",
    team: "Founders of Shorts Break (47.7M Subs). Paper2Pixel/Armoks Media production infrastructure (200+ creators, studios). Proven ability to scale content to billions of views.",
    problem: "The $500M micro-OTT market is dominated by deceptive 'subscription traps' (8,700+ complaints against Kuku TV) and lacks family safety (99% single-profile). 40M Indian households want safe, bite-sized entertainment but fear scams and inappropriate content.",
    solution: "1) Multi-Profile Family System (Netflix-style with parental controls). 2) Transparent Billing (No fake trials, 1-click cancel). 3) Educational Micro-Dramas (20% library). 4) Built-in 53M Audience distribution advantage.",
    market: "India's ₹96,000 Cr Family Entertainment Market. 40M Households. 53M Gen Z YouTube followers. 250M Regional Language users (Marathi, Tamil, Telugu).",
    businessModel: "Freemium Subscription (₹199 Premium, ₹299 Family). B2B Educational Licensing (Schools/Corps). Brand Partnerships. Ad Revenue.",
    competitors: "Kuku TV (37M MAU, but high churn/complaints), Quick TV (UGC quality issues), Story TV. We have 4-7x better CAC and 2x LTV due to family positioning.",
    useOfFunds: "Tech development (Multi-profile engine), Content Production (Originals in 4 languages), Marketing (Leveraging 53M organic reach + influencer push)."
};

export const COACH_PERSONA_PROMPT = `
You are "Funding Masterclass Coach", a smart, friendly, and informal startup mentor.
Your Goal: Teach fundraising concepts simply (ELI5 - Explain Like I'm 5).
Context: The user is building a Micro-OTT / Vertical Video App.

Rules:
1. NO JARGON. If you use a big word (like Liquidation Preference), explain it immediately as "Who gets paid first".
2. BE CONVERSATIONAL. Talk like a friend over coffee. Use "we", "you", "let's".
3. USE ANALOGIES. Equity is Pizza. Funding is Fuel. Valuation is a Price Tag.
4. INDIAN CONTEXT. Always use Rupees (₹, Lakhs, Crores). Mention Indian examples (Zomato, UPI, Shark Tank India).
5. BE ENCOURAGING. Fundraising is scary. Make the user feel confident.
6. BE BRIEF. Don't write long essays. Keep it punchy.

Knowledge Base:
${MASTERCLASS_CONTENT}
`;

export const MODULES = [
    "1: What is a Startup?",
    "2: The Funding Levels",
    "3: Equity vs. Debt",
    "4: How VCs Think",
    "5: India Story",
    "6: Bootstrapping",
    "7: Friends & Family",
    "8: Angel Investors",
    "9: Accelerators",
    "10: Pre-Seed vs Seed",
    "11: Equity Explained",
    "12: The iSAFE Note",
    "13: Convertible Notes",
    "14: Valuation Basics",
    "15: Setting the Price",
    "16: The Pitch Story",
    "17: Vitamin vs Painkiller",
    "18: Market Size (TAM)",
    "19: Making Money",
    "20: The Moat",
    "21: Retention",
    "22: Revenue (MRR)",
    "23: Unit Economics",
    "24: Financial Modeling",
    "25: Investor Pipeline",
    "26: The Warm Intro",
    "27: The Pitch Meeting",
    "28: Term Sheet Economics",
    "29: Term Sheet Control",
    "30: Closing the Deal"
];

export const QUIZ_GENERATION_PROMPT = `
Generate a quiz with 3 multiple-choice questions based on the provided module content.
Ensure the questions test understanding of key concepts, not just memorization.
Return the response as a valid JSON array of objects with this structure:
[
  {
    "question": "The question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0, // 0-3
    "explanation": "Brief explanation of why the answer is correct."
  }
]
`;

export const FLASHCARD_GENERATION_PROMPT = `
Generate 5 flashcards based on the provided module content.
Focus on key terms, definitions, and important concepts.
Return the response as a valid JSON array of objects with this structure:
[
  {
    "front": "Term or Concept",
    "back": "Simple definition or explanation (ELI5 style)"
  }
]
`;

export const ROADMAP_GENERATION_PROMPT = `
Generate a 3-month fundraising roadmap based on the startup's current stage and the provided context.
Break it down by month and week.
Return the response as a valid JSON array of objects (one per month) with this structure:
[
  {
    "monthNumber": 1,
    "title": "Month 1: Preparation",
    "focus": "Getting materials ready",
    "weeks": [
      {
        "weekNumber": 1,
        "theme": "Pitch Deck",
        "tasks": ["Task 1", "Task 2", "Task 3"]
      }
    ]
  }
]
`;
