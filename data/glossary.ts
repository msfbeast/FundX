
import { GlossaryTerm } from "../types";

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // --- FUNDING STAGES ---
  {
    term: "Pre-Seed",
    definition: "The 'Idea Stage'. You have a team and a vision, but maybe no product yet. Funding comes from Friends, Family, and Angels. Typical range: ₹40L - ₹2 Cr.",
    category: "Funding"
  },
  {
    term: "Seed Round",
    definition: "The 'Proof Stage'. You have a product and some early users. You need money to prove Product-Market Fit. Typical range: ₹4 Cr - ₹16 Cr.",
    category: "Funding"
  },
  {
    term: "Series A",
    definition: "The 'Scale Stage'. You have revenue and a working engine. You need money to pour fuel on the fire. Typical range: ₹16 Cr - ₹80 Cr.",
    category: "Funding"
  },
  {
    term: "Bridge Round",
    definition: "A smaller funding round to keep the company alive and growing between two major rounds (e.g., between Seed and Series A).",
    category: "Funding"
  },
  {
    term: "Bootstrapping",
    definition: "Building your company using your own savings or revenue, without taking outside investor money. You keep 100% control.",
    category: "Funding"
  },
  {
    term: "Down Round",
    definition: "Raising money at a lower valuation than your previous round. This is bad signal and dilutes existing shareholders significantly.",
    category: "Funding"
  },
  {
    term: "Flat Round",
    definition: "Raising money at the same valuation as the previous round. Better than a down round, but shows lack of growth.",
    category: "Funding"
  },
  {
    term: "Party Round",
    definition: "A funding round with many small investors (angels) and no clear Lead Investor. Can be hard to manage.",
    category: "Funding"
  },

  // --- INVESTOR TYPES ---
  {
    term: "Angel Investor",
    definition: "A wealthy individual (often an ex-founder) who gives you the first cheque (₹5L to ₹50L). They invest their own money.",
    category: "Funding"
  },
  {
    term: "Venture Capitalist (VC)",
    definition: "A professional firm that manages other people's money (LPs) and invests in high-growth startups to get massive returns.",
    category: "Funding"
  },
  {
    term: "Lead Investor",
    definition: "The investor who writes the biggest check, sets the valuation/terms, and usually takes a Board seat. Others follow their lead.",
    category: "Funding"
  },
  {
    term: "LP (Limited Partner)",
    definition: "The people who give money to VCs (e.g., Pension Funds, Universities, Billionaires). The VCs are the 'GPs' (General Partners).",
    category: "Funding"
  },
  {
    term: "Syndicate",
    definition: "A group of individual investors pooling their money together to invest as a single entity (often led by a 'Syndicate Lead').",
    category: "Funding"
  },
  {
    term: "Accelerator",
    definition: "A program (like YC, 100X.VC, Surge) that gives small money, mentorship, and a network in exchange for equity (usually ~7%).",
    category: "Funding"
  },

  // --- FINANCIAL METRICS ---
  {
    term: "Burn Rate",
    definition: "The amount of cash you lose every month. If you spend ₹15L and earn ₹5L, your Burn Rate is ₹10L.",
    category: "Financial"
  },
  {
    term: "Runway",
    definition: "How many months you have before you run out of cash. (Cash in Bank / Monthly Burn Rate).",
    category: "Financial"
  },
  {
    term: "MRR",
    definition: "Monthly Recurring Revenue. The holy grail for subscription businesses. Predictable revenue coming in every month.",
    category: "Financial"
  },
  {
    term: "ARR",
    definition: "Annual Recurring Revenue. Simply MRR x 12. Used to value SaaS companies.",
    category: "Financial"
  },
  {
    term: "Gross Margin",
    definition: "Revenue minus the direct cost of goods sold (COGS). Software has high margins (80%+), E-commerce has lower margins (30-50%).",
    category: "Financial"
  },
  {
    term: "CAC",
    definition: "Customer Acquisition Cost. Total marketing spend divided by new customers acquired. How much to buy a user?",
    category: "Metrics"
  },
  {
    term: "LTV",
    definition: "Lifetime Value. The total profit you expect to make from one customer over their entire relationship with you.",
    category: "Metrics"
  },
  {
    term: "LTV:CAC",
    definition: "The golden ratio. Ideally, LTV should be 3x your CAC. If it's 1x, you are losing money.",
    category: "Metrics"
  },
  {
    term: "Churn Rate",
    definition: "The percentage of subscribers who cancel each month. High churn kills growth.",
    category: "Metrics"
  },
  {
    term: "GMV",
    definition: "Gross Merchandise Value. The total value of goods sold on a marketplace. (Revenue is only the commission you take from this).",
    category: "Metrics"
  },
  {
    term: "CMGR",
    definition: "Compounded Monthly Growth Rate. The reliable way to measure how fast you are growing month-over-month.",
    category: "Metrics"
  },
  {
    term: "Contribution Margin",
    definition: "Revenue per unit minus variable costs per unit. Shows if the core unit economics are profitable.",
    category: "Financial"
  },
  {
    term: "EBITDA",
    definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization. A fancy way of saying 'Operating Profit'.",
    category: "Financial"
  },

  // --- EQUITY & VALUATION ---
  {
    term: "Equity",
    definition: "Ownership in a company. Exchanged for capital (money) or work (ESOPs).",
    category: "Financial"
  },
  {
    term: "Pre-Money Valuation",
    definition: "What your company is worth BEFORE the investment check enters the bank account.",
    category: "Financial"
  },
  {
    term: "Post-Money Valuation",
    definition: "What your company is worth IMMEDIATELY AFTER the investment. (Pre-Money + Cash Raised).",
    category: "Financial"
  },
  {
    term: "Dilution",
    definition: "The reduction in your % ownership when new shares are created for investors. You own a smaller piece of a bigger pie.",
    category: "Financial"
  },
  {
    term: "Fully Diluted",
    definition: "The total number of shares assuming all options, warrants, and convertible notes are turned into shares.",
    category: "Financial"
  },
  {
    term: "Cap Table",
    definition: "Capitalization Table. A spreadsheet showing who owns what % of the company (Founders, Investors, ESOP).",
    category: "Financial"
  },
  {
    term: "ESOP Pool",
    definition: "Employee Stock Option Plan. Shares (usually 10-15%) set aside to hire and reward employees. Comes out of founder equity.",
    category: "Legal"
  },
  {
    term: "Vesting",
    definition: "Earning your shares over time. Standard is 4 years. If you leave early, you lose unvested shares.",
    category: "Legal"
  },
  {
    term: "Cliff",
    definition: "A trial period (usually 1 year) before vesting starts. If you leave before the cliff, you get 0 shares.",
    category: "Legal"
  },
  {
    term: "Sweat Equity",
    definition: "Shares given for work/effort rather than cash investment. Common for co-founders.",
    category: "Financial"
  },

  // --- DEAL TERMS & LEGAL ---
  {
    term: "Term Sheet",
    definition: "A non-binding document outlining the basic terms of an investment (Price, Board Seats, Control). The 'engagement ring' before marriage.",
    category: "Legal"
  },
  {
    term: "SHA",
    definition: "Shareholders Agreement. The final, binding legal contract that details rights and obligations. The 'marriage certificate'.",
    category: "Legal"
  },
  {
    term: "SSA",
    definition: "Share Subscription Agreement. The document for issuing new shares to investors in exchange for money.",
    category: "Legal"
  },
  {
    term: "iSAFE",
    definition: "India Simple Agreement for Future Equity. A quick contract to raise money without setting a valuation immediately. Standard in India.",
    category: "Legal"
  },
  {
    term: "Convertible Note",
    definition: "A loan that turns into equity later. Unlike iSAFE, it has an interest rate and a maturity date (deadline).",
    category: "Legal"
  },
  {
    term: "Valuation Cap",
    definition: "The maximum price an early investor pays when their note converts to equity. Protects them from you getting too successful too fast.",
    category: "Legal"
  },
  {
    term: "Discount Rate",
    definition: "A percentage off (usually 20%) the future share price given to early investors for taking early risk.",
    category: "Legal"
  },
  {
    term: "Liquidation Preference",
    definition: "Who gets paid first if the company sells. '1x Non-Participating' is standard (Investor gets money back, OR their % share).",
    category: "Legal"
  },
  {
    term: "Participating Preferred",
    definition: "A greedy term where investors get their money back AND their % share. Avoid this 'Double Dipping'.",
    category: "Legal"
  },
  {
    term: "Anti-Dilution",
    definition: "Protects investors if you raise money later at a lower price (Down Round). 'Broad-based Weighted Average' is the fair standard.",
    category: "Legal"
  },
  {
    term: "Full Ratchet",
    definition: "A toxic Anti-Dilution clause that reprices ALL investor shares to the new low price. Avoid at all costs.",
    category: "Legal"
  },
  {
    term: "Pro-Rata Rights",
    definition: "The right for an investor to invest in future rounds to maintain their ownership percentage.",
    category: "Legal"
  },
  {
    term: "ROFR",
    definition: "Right of First Refusal. If a founder wants to sell shares, they must offer them to existing investors first.",
    category: "Legal"
  },
  {
    term: "Tag-Along Rights",
    definition: "If majority shareholders sell the company, minority shareholders have the right to tag along and sell at the same price.",
    category: "Legal"
  },
  {
    term: "Drag-Along Rights",
    definition: "If majority shareholders want to sell the company, they can force minority shareholders to sell too.",
    category: "Legal"
  },
  {
    term: "Board Seat",
    definition: "The right to have a representative on the Board of Directors. Gives voting power on big decisions.",
    category: "Legal"
  },
  {
    term: "Board Observer",
    definition: "Someone who sits in Board meetings and hears everything but cannot vote. Common for smaller investors.",
    category: "Legal"
  },

  // --- GENERAL STARTUP JARGON ---
  {
    term: "Acqui-hire",
    definition: "Buying a company primarily to hire its talented team, not for its product or revenue.",
    category: "General"
  },
  {
    term: "Alpha / Beta",
    definition: "Alpha is the rough first version for internal testing. Beta is the version released to a few users to find bugs.",
    category: "General"
  },
  {
    term: "B2B / B2C / D2C",
    definition: "Business-to-Business (selling to companies). Business-to-Consumer (selling to people). Direct-to-Consumer (selling brands online).",
    category: "General"
  },
  {
    term: "Data Room",
    definition: "A Google Drive folder containing all your legal, financial, and metric documents for investors to check (Due Diligence).",
    category: "General"
  },
  {
    term: "Dry Powder",
    definition: "Cash that VCs have raised but haven't invested yet. 'There is a lot of dry powder in the market'.",
    category: "General"
  },
  {
    term: "Exit Strategy",
    definition: "How investors eventually get their money back. Usually an IPO (Public Listing) or Acquisition (M&A).",
    category: "General"
  },
  {
    term: "FOMO",
    definition: "Fear Of Missing Out. The psychological force that makes investors write checks quickly when others are interested.",
    category: "General"
  },
  {
    term: "Hockey Stick",
    definition: "A growth chart that is flat at the start and then shoots up vertically. The dream curve.",
    category: "General"
  },
  {
    term: "Moat",
    definition: "A competitive advantage that protects your business from being copied (e.g., Network Effects, Brand, Tech).",
    category: "General"
  },
  {
    term: "MVP",
    definition: "Minimum Viable Product. The simplest version of your product you can ship to test if people want it.",
    category: "General"
  },
  {
    term: "Network Effect",
    definition: "When a product gets better the more people use it (e.g., WhatsApp, Instagram, Uber).",
    category: "General"
  },
  {
    term: "Pivot",
    definition: "Changing the business model or product direction significantly because the current one isn't working.",
    category: "General"
  },
  {
    term: "PMF (Product-Market Fit)",
    definition: "The magical moment when the market pulls the product out of your hands faster than you can make it.",
    category: "General"
  },
  {
    term: "Traction",
    definition: "Proof of progress. Can be users, revenue, or engagement. The best evidence for investors.",
    category: "General"
  },
  {
    term: "Unicorn",
    definition: "A privately held startup valued at over $1 Billion (approx ₹8,300 Crores).",
    category: "General"
  },

  // --- INDIAN CONTEXT ---
  {
    term: "RoC",
    definition: "Registrar of Companies. The government body in India where you file your incorporation and funding documents.",
    category: "Legal"
  },
  {
    term: "DPIIT Recognition",
    definition: "A government certificate that officially recognizes you as a 'Startup', giving tax benefits and easier compliance.",
    category: "Legal"
  },
  {
    term: "Authorised Capital",
    definition: "The maximum amount of share capital a company is allowed to issue. You pay a fee to increase this before raising a round.",
    category: "Financial"
  },
  {
    term: "Paid-up Capital",
    definition: "The amount of money actually received from shareholders in exchange for shares.",
    category: "Financial"
  }
];
