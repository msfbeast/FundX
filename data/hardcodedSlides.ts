
import { SlideDeck } from "../types";

export const HARDCODED_SLIDE_DECKS: Record<string, SlideDeck> = {
  "1": {
    moduleTitle: "1: What is a Startup?",
    slides: [
      {
        title: "Startup vs. Small Shop",
        bullets: [
          "**The Goal**: A shop wants to feed a family. A startup wants to take over the world.",
          "**The Speed**: Shops grow slow. Startups grow FAST (like a rocket).",
          "**The Fuel**: You burn cash to grow speed. That's why you need investors."
        ],
        tutorNotes: "Think of your local Kirana store vs. Zepto. The Kirana makes profit today. Zepto loses money today to become huge tomorrow.",
        detailedExplanation: "Most businesses are designed to stay small and profitable. That's great! But a 'Startup' is different. It's an experiment designed to grow 100x in a few years. Because you want to grow that fast, you can't just wait for profits. You need outside money (Capital) to hire smart people and run ads *before* you make money.",
        practicalExample: "{{company}} isn't just a video production house; it's a tech platform scaling to millions of users. That's a startup.",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "Small Biz",
          rightTitle: "Startup",
          items: [
            { left: "Linear Growth", right: "Rocketship Growth" },
            { left: "Profit First", right: "Growth First" },
            { left: "Own 100%", right: "Share the Pie" }
          ]
        }
      },
      {
        title: "The Money Pit (J-Curve)",
        bullets: [
          "**The Dip**: You have to spend money to build the product.",
          "**Valley of Death**: This is where you run out of cash and die. Scary!",
          "**The Rocket**: If you survive the dip, you shoot up to the moon."
        ],
        tutorNotes: "Investors know you will lose money at first. That's normal. They give you money to build the bridge over the 'Valley of Death'.",
        detailedExplanation: "Imagine a letter 'J'. You start at the top, but then you spend money to build the app (going down). You are losing cash. This is the 'Valley of Death'. Eventually, if people love your app, you make money and shoot up past where you started. Funding is the bridge.",
        practicalExample: "Right now, {{company}} is in the investment phase (The Dip). You are building the engine. Funding is the fuel to take off.",
        visualType: "PROCESS",
        visualData: { steps: ["Spend Cash", "Valley of Death", "Break-even", "To The Moon"] }
      },
      {
        title: "The Exit Strategy",
        bullets: [
          "**The End Game**: Investors don't want to hold your shares forever.",
          "**IPO**: Selling shares to the public (Stock Market).",
          "**Acquisition**: Selling the company to a giant (like Google or Reliance)."
        ],
        tutorNotes: "You build the rocket to fly it, but investors build it to sell the ticket. They need an exit.",
        detailedExplanation: "Startups are designed to be sold or go public. This is the 'Exit'. Investors put money in today hoping to get 10x money back in 7-10 years when you exit. If you plan to run this as a family business forever, VC funding isn't for you.",
        practicalExample: "For {{company}}, an exit could be getting bought by Disney+ Hotstar or listing on the BSE.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "IPO",
            rightTitle: "Acquisition",
            items: [
                { left: "Go Public", right: "Get Bought" },
                { left: "Massive Scale", right: "Strategic Fit" },
                { left: "Zomato, Paytm", right: "Flipkart (Walmart)" }
            ]
        }
      }
    ]
  },
  "2": {
    moduleTitle: "2: The Funding Lifecycle",
    slides: [
      {
        title: "The Levels of the Game",
        bullets: [
          "**Pre-Seed (Level 1)**: ₹40L - ₹2Cr. You have an Idea & a PowerPoint.",
          "**Seed (Level 2)**: ₹4Cr - ₹16Cr. You have a working App & Users.",
          "**Series A (Level 3)**: ₹16Cr+. You have Revenue & you are Scaling.",
          "**IPO (Boss Level)**: You enter the stock market. Big time!"
        ],
        tutorNotes: "Don't ask for Level 3 money when you are at Level 1. It's like fighting the final boss with a wooden sword.",
        detailedExplanation: "Funding happens in stages. First, you prove the idea works (Pre-Seed). Then, you prove people want it (Seed). Then, you prove you can sell it to everyone (Series A). In India, Pre-Seed comes from Angels, Seed comes from Micro-VCs.",
        practicalExample: "Since {{company}} is at {{stage}}, focus only on the milestones for the NEXT round. Don't worry about IPO yet.",
        visualType: "PROCESS",
        visualData: { steps: ["Idea (Pre-Seed)", "Traction (Seed)", "Scale (Series A)", "Exit (IPO)"] }
      },
      {
        title: "Timeline Reality Check",
        bullets: [
          "**Preparation**: 1-2 Months. (Deck, Financials, List).",
          "**Pitching**: 2-3 Months. (Meeting investors).",
          "**Closing**: 1-2 Months. (Legal & Bank Transfer).",
          "**Total**: Expect 6 months to raise money."
        ],
        tutorNotes: "Start fundraising 6 months before you run out of cash. It always takes longer than you think.",
        detailedExplanation: "Fundraising is a full-time job. You cannot build the product and raise money at the same time easily. Founders often underestimate the time. From the first 'Hello' to money in the bank, it averages 6 months in India.",
        practicalExample: "If {{company}} has cash for 8 months, start preparing the deck NOW.",
        visualType: "STATISTIC",
        visualData: { statValue: "6 Mo", statLabel: "Avg Time to Raise", statContext: "From first pitch to cash in bank." }
      },
      {
        title: "The Fundraising Seasons",
        bullets: [
          "**Hot Times**: Investors are active in March-May and Sept-Nov.",
          "**Dead Zones**: December (Holidays) and August (European Vacation).",
          "**Momentum**: Raise when you are growing fast, not when you are desperate."
        ],
        tutorNotes: "Don't launch a fundraise on December 20th. Everyone is on Goa vacation.",
        detailedExplanation: "Timing matters. Investors take breaks too. The best time to raise is when you have just hit a big milestone (like 10k users) and the market is active. Trying to raise when you have 1 week of cash left is a recipe for disaster.",
        practicalExample: "Plan {{company}}'s raise to hit the market in September or February for best results.",
        visualType: "STATISTIC",
        visualData: { statValue: "Q1 & Q3", statLabel: "Best Time", statContext: "Avoid Holiday Seasons." }
      }
    ]
  },
  "3": {
    moduleTitle: "3: Equity vs Debt Basics",
    slides: [
      {
        title: "Selling vs. Borrowing",
        bullets: [
          "**Equity**: You sell a slice of your company. No monthly payments.",
          "**Debt**: You borrow cash (Loan). You pay EMI + Interest.",
          "**Why Equity?**: Because startups are risky. Banks won't give you a loan."
        ],
        tutorNotes: "Banks lend to people who have houses. Startups have no assets, only ideas. So we sell Equity (Ownership).",
        detailedExplanation: "When you take Equity funding, you get a partner. If you fail, they lose their money (you don't owe them). If you win, they own a piece of the win. Debt is safer for the lender but riskier for you (you must pay back even if you fail).",
        practicalExample: "For {{company}}, a loan is stressful (monthly payments). Equity is better—you use the cash to grow, not to pay back debt.",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "Equity",
          rightTitle: "Debt",
          items: [
            { left: "Give up ownership", right: "Keep ownership" },
            { left: "No repayment", right: "Monthly EMIs" },
            { left: "Partner mindset", right: "Lender mindset" }
          ]
        }
      },
      {
        title: "The Cost of Capital",
        bullets: [
          "**Cheap Money**: Bank loans (10-15% interest). Cheap but risky.",
          "**Expensive Money**: Equity. You might give up millions in future value.",
          "**The Trade-off**: Equity is expensive long-term, but cheap short-term (cash flow friendly)."
        ],
        tutorNotes: "Equity is the most expensive money you will ever take... if you succeed.",
        detailedExplanation: "Giving 1% of your company for ₹10 Lakhs seems cheap now. But if your company becomes Zomato, that 1% is worth ₹1000 Crores. You paid ₹1000 Crores for a ₹10 Lakh loan. That's why you only take equity to grow HUGE.",
        practicalExample: "Only sell equity in {{company}} if you believe that cash will grow the company's value by 10x.",
        visualType: "STATISTIC",
        visualData: { statValue: "Expensive", statLabel: "Equity Cost", statContext: "Costs nothing now, costs millions later." }
      },
      {
        title: "The Cap Table",
        bullets: [
            "**The Scoreboard**: A list of who owns what.",
            "**Founders**: Start with 100%.",
            "**Investors**: Buy in and dilute you.",
            "**Clean vs. Dirty**: Keep it simple. Too many small owners is 'Dirty'."
        ],
        tutorNotes: "Investors hate 'Dirty' Cap Tables with 50 random uncles owning 0.1%. Keep it clean.",
        detailedExplanation: "Your Cap Table is your holy grail. Every time you raise money, you update it. If you give 5% to an advisor, 10% to an angel, 20% to a VC... soon you own very little. Protect your Cap Table like your life depends on it.",
        practicalExample: "Create a simple spreadsheet for {{company}} tracking who owns what shares today.",
        visualType: "PROCESS",
        visualData: { steps: ["Founders (100%)", "Seed Round (-20%)", "ESOP (-10%)", "Series A (-20%)"] }
      }
    ]
  },
  "4": {
    moduleTitle: "4: The Investor Mindset",
    slides: [
      {
        title: "Hunting for Treasure",
        bullets: [
          "**High Failure**: VCs know 5 out of 10 startups will die.",
          "**The Home Run**: They need 1 massive winner to pay for the 9 losers.",
          "**100x Potential**: They only invest if you can get HUGE."
        ],
        tutorNotes: "Investors aren't looking for a 'safe' 2x return. They want the next Zomato or Paytm.",
        detailedExplanation: "VC math is crazy. They invest in 10 companies. 5 die. 3 do okay. 1 MUST be a superstar (100x return) to make the whole fund profitable. This is why they always ask 'How big can this get?'. They are hunting for unicorns.",
        practicalExample: "Pitch {{company}} not as a 'nice video app' but as 'The Next Netflix for Bharat'. Show the massive potential.",
        visualType: "STATISTIC",
        visualData: { statValue: "100x", statLabel: "Target Return", statContext: "Needed from the winners to cover losers." }
      },
      {
        title: "The VC Portfolio Math",
        bullets: [
          "**The Fund**: A VC collects ₹100 Cr from others (LPs).",
          "**The Bets**: They invest in 20 companies (₹5 Cr each).",
          "**The Result**: If 19 fail, the last one MUST return ₹100 Cr+.",
        ],
        tutorNotes: "They are playing roulette, but they try to pick the best numbers. You need to look like a winning number.",
        detailedExplanation: "Understand that VCs answer to their own bosses (Limited Partners). They need to return 3x the total fund value in 7-10 years. If you look like a 'lifestyle business' that makes good money but won't sell for billions, they can't invest.",
        practicalExample: "Show that {{company}} addresses a ₹5000 Cr market. That's the scale they need.",
        visualType: "PROCESS",
        visualData: { steps: ["Raise Fund", "Invest in 20 Startups", "Wait 7 Years", "1 Winner Returns All"] }
      },
      {
        title: "Fear of Missing Out (FOMO)",
        bullets: [
            "**Herd Mentality**: VCs hate losing money, but they HATE missing the next big thing even more.",
            "**Momentum**: If other smart investors are interested, everyone gets interested.",
            "**Scarcity**: 'The round is closing soon' makes them move fast."
        ],
        tutorNotes: "Nothing makes a VC move faster than thinking their rival is about to invest in you.",
        detailedExplanation: "VCs are competitive. If they think {{company}} is the next big thing and they might miss it, they will chase you. You create FOMO by having a great product and other investors interested. Don't look desperate.",
        practicalExample: "When pitching {{company}}, mention that you have 'strong interest' from others (if true!).",
        visualType: "STATISTIC",
        visualData: { statValue: "FOMO", statLabel: "Driver", statContext: "The #1 emotion driving VC deals." }
      }
    ]
  },
  "5": {
    moduleTitle: "5: Indian Ecosystem Overview",
    slides: [
      {
        title: "India is Booming",
        bullets: [
          "**Top 3**: We have the 3rd biggest startup ecosystem in the world.",
          "**Unicorns**: 100+ startups worth over $1 Billion (₹8000 Cr).",
          "**Exits**: Walmart bought Flipkart. Zomato went public. It's real money now."
        ],
        tutorNotes: "10 years ago, people said 'Indian startups can't make money'. Flipkart and Zomato proved them wrong.",
        detailedExplanation: "India has changed. We used to just copy US ideas. Now we build for India (UPI, ONDC). Global investors love the 'India Story' because we have 1.4 Billion people getting online. It's the best time to build.",
        practicalExample: "You are building in a mature market. Use success stories like Pocket FM or Stage to show that your model works in India.",
        visualType: "STATISTIC",
        visualData: { statValue: "100+", statLabel: "Unicorns", statContext: "Indian startups worth >$1 Billion." }
      },
      {
        title: "What's Hot in India?",
        bullets: [
          "**Fintech**: Everyone needs payments (Paytm, PhonePe).",
          "**Consumer (D2C)**: Selling brands directly (Mamaearth, Boat).",
          "**SaaS**: Building software for the world (Zoho, Freshworks).",
          "**Media/Content**: Entertaining the masses (Your space!)."
        ],
        tutorNotes: "Investors follow trends. Right now, 'Content for Bharat' is heating up.",
        detailedExplanation: "Investors move in packs. When one sector gets hot, everyone wants in. Your micro-OTT app fits into 'Consumer Tech' and 'Media'. Position it as part of the 'Next Billion Users' wave.",
        practicalExample: "Highlight that {{company}} captures the Tier 2/3 audience, which is the next big growth engine.",
        visualType: "PROCESS",
        visualData: { steps: ["E-commerce Era", "Fintech Era", "SaaS Era", "Content/Bharat Era"] }
      },
      {
        title: "Who Funds Media & OTT?",
        bullets: [
            "**The Early Believers**: Titan Capital, Better Capital, 100X.VC (They do Seed rounds).",
            "**The Consumer Specialists**: Fireside Ventures, DSG Consumer (They love brands/content).",
            "**The Tech Giants**: Blume Ventures, 3one4 Capital, InfoEdge (Deep pockets)."
        ],
        tutorNotes: "Don't pitch a B2B SaaS investor. Pitch someone who understands 'Bharat Users'. Look at who funded Stage, KukuFM, or PocketFM.",
        detailedExplanation: "In India, specific funds specialize in 'Consumer Tech'. They understand that building an audience takes time. Funds like Fireside or Titan have a history of backing content platforms. Put them at the top of your list for {{company}}.",
        practicalExample: "Add Titan Capital and Better Capital to your target list. They funded many early-stage consumer apps.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Fund Type",
            rightTitle: "Top Names",
            items: [
                { left: "Seed / Angel", right: "Titan, Better, 100X" },
                { left: "Consumer VC", right: "Fireside, DSG" },
                { left: "General VC", right: "Blume, Matrix" }
            ]
        }
      }
    ]
  },
  "6": {
    moduleTitle: "6: Bootstrapping Strategies",
    slides: [
      {
        title: "The Freedom Route",
        bullets: [
          "**Self-Funded**: Using your own savings or customer money.",
          "**Zero Dilution**: You keep 100% of the pizza.",
          "**Control**: No boss. No board meetings. Just you.",
        ],
        tutorNotes: "Zerodha and Zoho are India's heroes. They grew huge without taking ANY investor money.",
        detailedExplanation: "Bootstrapping is hard but amazing. You grow only as fast as you sell. It forces you to be disciplined. If you can build {{company}} to ₹10L revenue without investors, you become very powerful.",
        practicalExample: "Can {{company}} sell subscriptions or ads early to pay the bills? That's bootstrapping.",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "Bootstrapping",
          rightTitle: "VC Funding",
          items: [
            { left: "100% Control", right: "Shared Control" },
            { left: "Slow Growth", right: "Fast Growth" },
            { left: "Profit Focus", right: "Scale Focus" }
          ]
        }
      },
      {
        title: "Customer Funding",
        bullets: [
            "**Pre-Sales**: Get customers to pay before you build.",
            "**Service Revenue**: Do consulting/agency work to fund the product.",
            "**Advance Payment**: Ask for 12 months subscription upfront."
        ],
        tutorNotes: "The best investor is your customer. They don't take equity, they just give cash.",
        detailedExplanation: "Many startups fund themselves by doing 'services' first. Maybe {{company}} produces videos for brands to make cash, and uses that cash to build the tech platform. It's a smart way to survive without begging investors.",
        practicalExample: "Could {{company}} make white-label video apps for others to fund its own journey?",
        visualType: "PROCESS",
        visualData: { steps: ["Offer Service", "Get Cash", "Build Product", "Stop Service"] }
      },
      {
        title: "When to Quit Bootstrapping",
        bullets: [
            "**Market Speed**: If competitors are raising millions and moving fast, you might lose by being slow.",
            "**Capital Intensive**: If you need to buy expensive servers or licenses.",
            "**Network Effects**: If the winner takes all, you need to grow FAST."
        ],
        tutorNotes: "Bootstrap as long as you can. But if the market is exploding, take the fuel to win the race.",
        detailedExplanation: "Bootstrapping is great, but sometimes speed matters more than control. If 3 other companies are building micro-OTT apps and raising ₹50 Cr, they will buy all the content and users. You might need funding just to compete.",
        practicalExample: "Watch your competitors. If {{company}} is falling behind because they have more ad budget, it's time to raise.",
        visualType: "STATISTIC",
        visualData: { statValue: "Speed", statLabel: "The Tradeoff", statContext: "Bootstrap for control, Fundraise for speed." }
      }
    ]
  },
  "7": {
    moduleTitle: "7: Friends & Family Rounds",
    slides: [
      {
        title: "Love Money",
        bullets: [
          "**Source**: Parents, rich uncles, college besties.",
          "**Amount**: Usually ₹5L - ₹25L.",
          "**Warning**: Can ruin relationships if you lose the money."
        ],
        tutorNotes: "Be honest: 'Uncle, this money might disappear.' If they can't afford to lose it, don't take it.",
        detailedExplanation: "This is the first money in. They invest because they trust YOU, not because they understand the business model. Treat it professionally. Use a simple contract so nobody gets confused later.",
        practicalExample: "Draft a simple 1-page agreement for {{company}} if taking money from family. Don't just take cash with a handshake.",
        visualType: "PROCESS",
        visualData: { steps: ["Identify Rich Uncle", "Explain Risk", "Sign Contract", "Get Cash"] }
      },
      {
        title: "Structuring the Deal",
        bullets: [
            "**Convertible Note**: Best for family. No need to argue about price.",
            "**Plain Loan**: Simple, but they miss the upside.",
            "**Gift**: If they are super rich, maybe it's just help!"
        ],
        tutorNotes: "Don't give family 'Common Stock' with voting rights. It gets messy. Use a simple Convertible or iSAFE.",
        detailedExplanation: "Keep it simple. You don't want to hold a board meeting with your aunt. Use an instrument that is passive. They give money, they get shares later, they don't run the company.",
        practicalExample: "Use a simple iSAFE for {{company}}'s family round. 'Invest now, get shares when pros invest later'.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Loan",
            rightTitle: "Convertible",
            items: [
                { left: "Must Repay", right: "Becomes Shares" },
                { left: "No Upside", right: "Big Upside" },
                { left: "Stressful", right: "Aligned" }
            ]
        }
      },
      {
        title: "The Thanksgiving Test",
        bullets: [
            "**The Rule**: Would you still be welcome at dinner if you lost all their money?",
            "**Transparency**: Tell them 90% of startups fail.",
            "**Limits**: Don't let them invest their retirement savings."
        ],
        tutorNotes: "Protect your family from themselves. Don't let dad mortgage the house.",
        detailedExplanation: "Taking money from people you love is emotional. If {{company}} fails (which is possible), you don't want to destroy your family's financial security. Only accept what they can afford to treat as a 'gamble'.",
        practicalExample: "Ask your potential family investors: 'If this ₹5 Lakhs goes to zero, are we still cool?'",
        visualType: "STATISTIC",
        visualData: { statValue: "Risk", statLabel: "High", statContext: "Only take 'play money'." }
      }
    ]
  },
  "8": {
    moduleTitle: "8: Angel Investors",
    slides: [
      {
        title: "Rich People Who Help",
        bullets: [
          "**Who**: Successful founders, senior tech execs (HNIs).",
          "**Why**: To give back and make money.",
          "**Where**: AngelList India, LetsVenture, LinkedIn."
        ],
        tutorNotes: "Angels are the bridge between 'Friends' and 'Big VCs'. They write cheques of ₹5L to ₹50L.",
        detailedExplanation: "In India, super-angels (like Kunal Shah or Anupam Mittal) are very active. They decide quickly (days, not months). They often give advice because they have built companies before. They are your first believers.",
        practicalExample: "Find angels who understand Media/Content. They will value {{company}}'s vision more than a generic tech investor.",
        visualType: "PROCESS",
        visualData: { steps: ["Find Angel on LinkedIn", "Get Intro", "Coffee Meeting", "Cheque"] }
      },
      {
        title: "Smart Money vs. Dumb Money",
        bullets: [
          "**Smart Money**: Gives Cash + Advice + Network. (Ex-Founders).",
          "**Dumb Money**: Gives Cash but headaches. (Real Estate Uncles).",
          "**Choice**: Always take smart money, even at a lower valuation."
        ],
        tutorNotes: "A bad investor calls you every day asking 'Where is my money?'. A good investor introduces you to customers.",
        detailedExplanation: "Not all rupees are equal. An investor who knows your industry can open doors that are worth millions. An investor who doesn't understand tech will panic when you burn cash. Choose your partners wisely.",
        practicalExample: "For {{company}}, an angel from Hotstar or Jio is worth 10x more than a random rich person.",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "Smart Angel",
          rightTitle: "Dumb Angel",
          items: [
            { left: "Understands Risk", right: "Fears Risk" },
            { left: "Opens Doors", right: "Asks Dumb Qs" },
            { left: "Patient", right: "Impatient" }
          ]
        }
      },
      {
        title: "How to Find Them",
        bullets: [
            "**Platforms**: AngelList India and LetsVenture are marketplaces.",
            "**LinkedIn**: Search for 'Angel Investor' + 'Media'.",
            "**Founders**: Ask other founders who funded them."
        ],
        tutorNotes: "Angels flock together. If you get one respected angel, others will follow.",
        detailedExplanation: "You don't need to know them personally. You can reach out cold on LinkedIn if your profile is good. But the best way is an intro from a founder they already backed. 'Hey, my friend X said I should talk to you.'",
        practicalExample: "Search LinkedIn for 'Ex-Hotstar' or 'Ex-Netflix' executives. They might be angels interested in {{company}}.",
        visualType: "PROCESS",
        visualData: { steps: ["Search LinkedIn", "Filter by Sector", "Ask for Intro", "Pitch"] }
      }
    ]
  },
  "9": {
    moduleTitle: "9: Accelerators & Incubators",
    slides: [
      {
        title: "Startup School",
        bullets: [
          "**What**: 3-month programs (like YC, 100X.VC, Surge).",
          "**Deal**: They give small money + big advice for ~7% equity.",
          "**Demo Day**: You pitch to hundreds of investors at the end."
        ],
        tutorNotes: "It's like getting a gold star on your report card. If they pick you, other investors trust you.",
        detailedExplanation: "Accelerators are great for first-time founders. They teach you how to build, how to sell, and how to pitch. The alumni network is powerful—you can ask fellow founders for help anytime.",
        practicalExample: "Applying to an accelerator could be a game-changer for {{company}} to get its first stamp of approval.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Solo Founder",
            rightTitle: "Accelerator",
            items: [
                { left: "No Network", right: "Instant Network" },
                { left: "Trial & Error", right: "Proven Curriculum" },
                { left: "Keep 100%", right: "Give ~7%" }
            ]
        }
      },
      {
        title: "Is it Worth It?",
        bullets: [
            "**The Cost**: 7% equity is expensive if you are already successful.",
            "**The Value**: For a new founder, the network is worth it.",
            "**The Signal**: Being a 'YC Company' or 'Surge Company' makes fundraising 10x easier."
        ],
        tutorNotes: "If you have 100k users and investors chasing you, maybe you don't need it. But if you are starting, it's gold.",
        detailedExplanation: "Think of the equity as a tuition fee. Is the network worth 7% of your company? Usually, yes, because they increase your value by more than 7%. But choose top-tier accelerators only. Bad ones take equity and give nothing.",
        practicalExample: "Evaluate if {{company}} needs the brand name boost. If you are struggling to get meetings, apply.",
        visualType: "STATISTIC",
        visualData: { statValue: "7%", statLabel: "Typical Cost", statContext: "Equity given to accelerators." }
      },
      {
        title: "Top Indian Accelerators",
        bullets: [
            "**Surge (Sequoia/Peak XV)**: Big money ($1M+), very competitive.",
            "**100X.VC**: First cheque (₹1.25 Cr), uses iSAFE, great for beginners.",
            "**Techstars Bangalore**: Global network, strong mentorship."
        ],
        tutorNotes: "Know the flavor. Surge is for high-growth. 100X is for first cheque.",
        detailedExplanation: "Research which one fits {{company}}. 100X.VC is famous for being the first believer. Surge usually comes in slightly later or for super-hot teams. Apply to the one that matches your stage.",
        practicalExample: "Check the application deadlines for 100X.VC and Surge for {{company}}.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "100X.VC",
            rightTitle: "Surge",
            items: [
                { left: "First Cheque", right: "Early Stage" },
                { left: "₹1.25 Cr", right: "$1-2M" },
                { left: "Speed", right: "Scale" }
            ]
        }
      }
    ]
  },
  "10": {
    moduleTitle: "10: Pre-Seed vs Seed",
    slides: [
      {
        title: "Know Your Stage",
        bullets: [
          "**Pre-Seed**: You have an Idea & a Team. (Selling the Dream).",
          "**Seed**: You have a Product & Users. (Selling the Data).",
          "**The Gap**: It's hard to jump from Dream to Data."
        ],
        tutorNotes: "Pre-seed is about 'What IF'. Seed is about 'Look WHAT we did'.",
        detailedExplanation: "In Pre-Seed, investors bet on YOU. 'I like her, she's smart.' In Seed, they look at your Excel sheets. 'Retention is 30%, Growth is 10%.' The bar gets higher. Make sure you know which game you are playing.",
        practicalExample: "Focus {{company}}'s current pitch on the Vision (Pre-Seed) unless you already have 50k active users (Seed).",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "Pre-Seed",
          rightTitle: "Seed",
          items: [
            { left: "Selling a Dream", right: "Selling History" },
            { left: "Raise ₹1-2 Cr", right: "Raise ₹4-10 Cr" },
            { left: "Risk: Will it work?", right: "Risk: Can it scale?" }
          ]
        }
      },
      {
        title: "The Traction Gap",
        bullets: [
            "**The Trap**: Raising Pre-Seed is easy, but hitting Seed metrics is hard.",
            "**Milestones**: You need to prove PMF (Product Market Fit) before Seed.",
            "**Runway**: Ensure your Pre-Seed money lasts long enough to hit Seed goals."
        ],
        tutorNotes: "Don't spend all your Pre-Seed money on fancy offices. Spend it on getting users.",
        detailedExplanation: "Many startups die between Pre-Seed and Seed. They raise money, build a product, but nobody uses it. Then they run out of cash. Use your Pre-Seed money maniacally to get your first 10,000 happy users.",
        practicalExample: "For {{company}}, the goal of Pre-Seed is purely to prove people watch the videos.",
        visualType: "PROCESS",
        visualData: { steps: ["Raise Pre-Seed", "Build MVP", "Get Users", "Raise Seed"] }
      },
      {
        title: "Valuation Jumps",
        bullets: [
            "**Step Up**: Ideally, your value doubles or triples between rounds.",
            "**Dilution**: You sell 15-20% in each round.",
            "**Momentum**: Higher growth = Higher valuation."
        ],
        tutorNotes: "If you raise Pre-Seed at ₹10 Cr val, aim for ₹30 Cr val at Seed.",
        detailedExplanation: "Investors want to see the value grow. If you raised at ₹10 Cr and come back a year later asking for the same price, it's a 'Flat Round'. That's bad. You need to show that {{company}} is worth more now because you de-risked it.",
        practicalExample: "Target a 3x valuation jump for {{company}}'s Seed round by showing 5x user growth.",
        visualType: "STATISTIC",
        visualData: { statValue: "3x", statLabel: "Target Jump", statContext: "Valuation increase between rounds." }
      }
    ]
  },
  "11": {
    moduleTitle: "11: Understanding Equity",
    slides: [
      {
        title: "The Pizza Pie",
        bullets: [
          "**The Pie**: Your company is a pizza.",
          "**Slices**: Shares are slices of the pizza.",
          "**Dilution**: When you sell a slice, you own less of the total.",
          "**Value**: Ideally, the pizza gets bigger, so your smaller slice is worth MORE."
        ],
        tutorNotes: "Don't worry about owning 100% of a grape. Worry about owning 10% of a watermelon.",
        detailedExplanation: "When an investor gives you money, you create NEW slices for them. This means your percentage goes down (Dilution). But the cash helps the company grow. 100% of 0 is 0. 50% of ₹100 Cr is ₹50 Cr. Better to be rich with a smaller slice.",
        practicalExample: "If you give 20% to an investor for ₹2 Cr, you believe that ₹2 Cr will make the remaining 80% worth much more than before.",
        visualType: "STATISTIC",
        visualData: { statValue: "₹50 Cr", statLabel: "Your 50%", statContext: "Worth more than 100% of ₹1 Cr." }
      },
      {
        title: "Vesting: Earning Your Keep",
        bullets: [
            "**The Cliff**: You don't own your shares immediately. You earn them over 4 years.",
            "**Safety**: If a co-founder leaves in Month 2, they don't walk away with 50%.",
            "**Standard**: 4 Year Vesting, 1 Year Cliff."
        ],
        tutorNotes: "This protects YOU from your co-founder quitting early and keeping half the company.",
        detailedExplanation: "Investors will insist on this. It means if you leave the company, you lose your unvested shares. It ensures everyone is committed for the long haul. The 'Cliff' means if you leave before 1 year, you get nothing.",
        practicalExample: "Set up a 4-year vesting schedule for {{company}} founders immediately.",
        visualType: "PROCESS",
        visualData: { steps: ["Year 1 (0%)", "Cliff Hit (25%)", "Year 2 (50%)", "Year 4 (100%)"] }
      },
      {
        title: "The Option Pool (ESOP)",
        bullets: [
            "**Employee Shares**: You set aside ~10% of the pizza for future employees.",
            "**Attraction**: Used to hire rockstars who want upside.",
            "**Math**: This 10% usually comes out of the Founders' pocket BEFORE the investor puts money in."
        ],
        tutorNotes: "It's the 'wallet' you use to pay key hires. Don't be stingy.",
        detailedExplanation: "To hire a great CTO or Head of Growth for {{company}}, you can't pay Google salaries. You pay them with ESOPs (Ownership). Investors want to see this pool created so you can build a great team.",
        practicalExample: "Create a 10% ESOP pool for {{company}} to attract top talent.",
        visualType: "STATISTIC",
        visualData: { statValue: "10-15%", statLabel: "ESOP Size", statContext: "Standard pool for early employees." }
      }
    ]
  },
  "12": {
    moduleTitle: "12: The iSAFE Note",
    slides: [
      {
        title: "The Simple Indian Deal",
        bullets: [
          "**What**: iSAFE (India Simple Agreement for Future Equity).",
          "**Standard**: Used by almost everyone in India now.",
          "**Simple**: No arguments about valuation today. Fast cash."
        ],
        tutorNotes: "iSAFE is your best friend. It saves you months of legal headache.",
        detailedExplanation: "An iSAFE basically says: 'Give me money now. I will give you shares later when we raise a bigger round.' It avoids legal headaches and 'Stamp Duty' issues in India. It saves you time and lawyer fees so you can focus on building.",
        practicalExample: "Raise your first ₹2 Cr for {{company}} using an iSAFE. It takes 2 weeks instead of 3 months.",
        visualType: "PROCESS",
        visualData: { steps: ["Sign iSAFE", "Get Cash", "Build App", "Give Shares Later"] }
      },
      {
        title: "Valuation Cap Math",
        bullets: [
            "**The Ceiling**: The max price the investor pays later.",
            "**Reward**: It rewards early investors for taking risk.",
            "**Example**: If Cap is ₹10 Cr, and you raise later at ₹20 Cr, they still buy at ₹10 Cr price."
        ],
        tutorNotes: "The Cap is the most important number. It protects the investor from you getting too successful too fast.",
        detailedExplanation: "Investors take a risk betting on you early. The Cap ensures they get a good deal. If {{company}} explodes and becomes worth ₹100 Cr, the early angel with a ₹10 Cr Cap gets a 10x discount. It's fair.",
        practicalExample: "Set a realistic Cap for {{company}} (e.g., ₹10-15 Cr) to make the deal attractive.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Without Cap",
            rightTitle: "With Cap",
            items: [
                { left: "Investor pays market price", right: "Investor pays max price" },
                { left: "Less upside for Angel", right: "Protected upside" },
                { left: "Bad for early risk", right: "Fair for early risk" }
            ]
        }
      },
      {
        title: "Discount Rates",
        bullets: [
            "**The Coupon**: A discount on the future price (usually 20%).",
            "**Mechanism**: If no Cap is hit, they get 20% off the Series A price.",
            "**Combo**: Most iSAFEs have both a Cap AND a Discount."
        ],
        tutorNotes: "It's like a 'Early Bird' sale. Buy now, get 20% off later.",
        detailedExplanation: "This is another sweetener. Even if the Cap isn't hit, the investor gets a discount because they gave you money when nobody else would. It's standard practice.",
        practicalExample: "Offer a 20% discount in {{company}}'s iSAFE.",
        visualType: "STATISTIC",
        visualData: { statValue: "20%", statLabel: "Discount", statContext: "Standard for early investors." }
      }
    ]
  },
  "13": {
    moduleTitle: "13: Convertible Notes",
    slides: [
      {
        title: "The Loan that Morphs",
        bullets: [
          "**Start**: Starts as a Loan (Debt).",
          "**End**: Turns into Shares (Equity) later.",
          "**Interest**: It gathers interest like a loan until it converts."
        ],
        tutorNotes: "Less common in India now due to iSAFE, but you might see it.",
        detailedExplanation: "It's a bridge. Investors lend you money, but instead of wanting cash back, they want shares when you raise your next round. If you don't raise the next round by a certain date (Maturity), they *could* ask for their cash back. That's risky.",
        practicalExample: "Be careful using Notes for {{company}}. The deadline creates pressure.",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "iSAFE",
          rightTitle: "Conv. Note",
          items: [
            { left: "Equity Paper", right: "Debt Paper" },
            { left: "No Deadline", right: "Deadline (Maturity)" },
            { left: "Simple", right: "Complex" }
          ]
        }
      },
      {
        title: "Interest Rates",
        bullets: [
            "**Accrual**: The loan grows by ~8% per year.",
            "**Not Cash**: You don't pay cash. The interest turns into MORE shares.",
            "**Logic**: It compensates them for time."
        ],
        tutorNotes: "It's phantom interest. You pay it in equity, not cash.",
        detailedExplanation: "If you borrow ₹1 Cr at 8%, after a year you owe ₹1.08 Cr. When it converts to equity, they get ₹1.08 Cr worth of shares. It dilutes you slightly more, but preserves cash.",
        practicalExample: "Expect an 8-10% interest rate on notes for {{company}}.",
        visualType: "STATISTIC",
        visualData: { statValue: "8-10%", statLabel: "Interest", statContext: "Standard annual rate." }
      },
      {
        title: "The Maturity Cliff",
        bullets: [
            "**Deadline**: The date you MUST pay back or convert.",
            "**Danger**: If you haven't raised money by then, you are in trouble.",
            "**Extension**: Usually investors extend it, but they *can* bankrupt you."
        ],
        tutorNotes: "This is why iSAFE is better. No maturity date.",
        detailedExplanation: "Convertible Notes have a ticking clock (usually 18-24 months). If {{company}} is struggling when the clock runs out, investors have leverage. iSAFEs don't have this, which is safer for founders.",
        practicalExample: "Negotiate for a long maturity (24+ months) if you must use a Note.",
        visualType: "PROCESS",
        visualData: { steps: ["Issue Note", "Clock Ticks", "Raise Series A", "Convert to Shares"] }
      }
    ]
  },
  "14": {
    moduleTitle: "14: Valuation Basics",
    slides: [
      {
        title: "The Price Tag",
        bullets: [
          "**Pre-Money**: Value BEFORE the check.",
          "**Post-Money**: Value AFTER the check.",
          "**Math**: Pre-Money + Cash = Post-Money."
        ],
        tutorNotes: "Always clarify if you are talking Pre or Post. It changes how much you own!",
        detailedExplanation: "If your company is worth ₹8 Cr (Pre), and I give you ₹2 Cr... the company is now worth ₹10 Cr (Post). I own 2 out of 10, which is 20%. If we did the math wrong, I might take 25%. Be careful.",
        practicalExample: "Run the math for {{company}}. If you want to sell 20% for ₹2 Cr, your Post-Money must be ₹10 Cr.",
        visualType: "PROCESS",
        visualData: { steps: ["Value (₹8Cr)", "+ Cash (₹2Cr)", "= Total (₹10Cr)", "Investor owns 20%"] }
      },
      {
        title: "Why it Matters",
        bullets: [
            "**Dilution**: Lower valuation = You sell more shares for same money.",
            "**Expectation**: High valuation = High expectations for next round.",
            "**The Trap**: Raising too high can kill you later (Down Round)."
        ],
        tutorNotes: "Don't celebrate a crazy high valuation. It's a heavy backpack to carry.",
        detailedExplanation: "If you raise at ₹100 Cr valuation but only have ₹10k revenue, you set yourself up for failure. In the next round, you need to be worth ₹300 Cr. If you can't justify it, you face a 'Down Round', which crushes founders.",
        practicalExample: "Aim for a 'Fair' valuation for {{company}}, not the 'Highest' one.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "High Val",
            rightTitle: "Fair Val",
            items: [
                { left: "Less Dilution", right: "Normal Dilution" },
                { left: "Harder Next Round", right: "Easier Next Round" },
                { left: "Ego Boost", right: "Sustainable" }
            ]
        }
      },
      {
        title: "The Cap Table Impact",
        bullets: [
            "**Scenario**: Raise ₹2 Cr at ₹8 Cr Pre vs ₹18 Cr Pre.",
            "**Outcome A**: You sell 20%.",
            "**Outcome B**: You sell 10%.",
            "**Long Term**: That 10% difference could be worth ₹100 Cr later."
        ],
        tutorNotes: "Fight for valuation, but not to the death. Deal completion is more important.",
        detailedExplanation: "Valuation dictates how much of the company you keep. But remember, 10% of a dead company is 0. Prioritize getting the right partner over squeezing the last 1% of valuation.",
        practicalExample: "Model the dilution for {{company}} at different valuation points.",
        visualType: "STATISTIC",
        visualData: { statValue: "10-25%", statLabel: "Dilution", statContext: "Typical equity sold per round." }
      }
    ]
  },
  "15": {
    moduleTitle: "15: Valuation Methods",
    slides: [
      {
        title: "It's an Art, Not Science",
        bullets: [
          "**Guessing Game**: Early valuations are mostly made up.",
          "**Comps**: Look at what similar startups raised.",
          "**Supply & Demand**: It's worth what someone will pay."
        ],
        tutorNotes: "Don't try to use complex Excel formulas. You have no revenue yet!",
        detailedExplanation: "How do you price a dream? You look at neighbors. If a similar OTT app raised at ₹20 Cr valuation, you can ask for the same. If you have a better team, ask for more. If the market is hot, ask for more. It's negotiation.",
        practicalExample: "Look at recent deals in Indian media. Use that to set the price tag for {{company}}.",
        visualType: "PROCESS",
        visualData: { steps: ["Find Similar Deals", "Compare Traction", "Adjust for Team", "Set Price"] }
      },
      {
        title: "The VC Method",
        bullets: [
            "**Backwards Math**: They guess what you sell for in 7 years.",
            "**Target Return**: They calculate what they need to make (10x).",
            "**Current Price**: They work backwards to find today's price."
        ],
        tutorNotes: "They need to see a path to 10-20x. If the entry price is too high, the math breaks.",
        detailedExplanation: "If they think {{company}} can exit for ₹1000 Cr, and they want 10x, they can't pay more than ₹100 Cr (Post) today. It's reverse engineering the price based on the exit potential.",
        practicalExample: "Understand that your valuation ceiling is determined by your potential exit size.",
        visualType: "PROCESS",
        visualData: { steps: ["Exit (₹1000 Cr)", "Target Return (10x)", "Max Post-Money (₹100 Cr)", "Offer"] }
      },
      {
        title: "The Revenue Multiple",
        bullets: [
            "**For Series A**: Once you have revenue, math kicks in.",
            "**SaaS**: 10-20x Revenue.",
            "**Consumer**: 5-10x Revenue.",
            "**Logic**: Annual Revenue * Multiple = Valuation."
        ],
        tutorNotes: "This is why getting revenue helps. It gives you a floor for the price.",
        detailedExplanation: "If {{company}} makes ₹5 Cr ARR (Annual Revenue), you can argue for a ₹50 Cr valuation (10x). Without revenue, it's just vibes. With revenue, it's a calculation.",
        practicalExample: "Aim to hit revenue milestones that justify your target valuation.",
        visualType: "STATISTIC",
        visualData: { statValue: "5-10x", statLabel: "Multiple", statContext: "Typical Rev multiple for Consumer." }
      }
    ]
  },
  "16": {
    moduleTitle: "16: Storytelling Arc",
    slides: [
      {
        title: "The Movie Script",
        bullets: [
          "**The Villain**: The Problem (Boredom is winning).",
          "**The Hero**: The Customer (Tier 2 User).",
          "**The Weapon**: Your App ({{company}}).",
          "**The Happy Ending**: Life is better with your app."
        ],
        tutorNotes: "Investors are human. They love stories. Don't bore them with just charts.",
        detailedExplanation: "A pitch is a story. 'Once upon a time, people in small towns were bored. They couldn't afford Netflix (Villain). Then {{company}} arrived (Weapon). Now they are entertained for ₹1 (Happy Ending). We need money to save more people.'",
        practicalExample: "Write {{company}}'s story like a movie trailer. Keep it dramatic and simple.",
        visualType: "PROCESS",
        visualData: { steps: ["The Villain (Problem)", "The Struggle", "The Hero (You)", "Happy Ending"] }
      },
      {
        title: "The Perfect Deck Flow",
        bullets: [
          "**The Hook**: Cover, Problem, Solution (Get them interested).",
          "**The Meat**: Market, Product, Business Model (Show the potential).",
          "**The Proof**: Traction, Metrics, Competition (Prove it works).",
          "**The Ask**: Team, Financials, Funding Need (Close the deal)."
        ],
        tutorNotes: "A great deck flows logically. Don't jump from Team to Market to Product. Follow the map.",
        detailedExplanation: "Your deck should answer questions in the order investors ask them. 1. What is this? (Hook). 2. Is it big? (Meat). 3. Is it real? (Proof). 4. Can you do it? (Ask). If you mix this up, they get confused.",
        practicalExample: "Re-order {{company}}'s slides to match this 4-step flow. Ensure 'The Hook' is strong.",
        visualType: "PROCESS",
        visualData: { steps: ["Intro (Hook)", "Opportunity (Meat)", "Execution (Proof)", "The Deal (Ask)"] }
      },
      {
        title: "The 10-Slide Blueprint",
        bullets: [
          "**Order Matters**: Don't put Team first unless you are famous. Follow the standard flow.",
          "**The Logic**: Problem -> Solution -> Market -> Traction.",
          "**The Goal**: Answer the investor's question before they ask it."
        ],
        tutorNotes: "Investors spend 2 minutes on a deck. If you use a weird structure, they get confused and close it. Boring structure = Good.",
        detailedExplanation: "This is the industry standard structure. VCs scan decks quickly. They expect to see the Problem first, then Solution, then Market. If you bury the Market slide at the end, they might think you are hiding a small market size. Stick to the format.",
        practicalExample: "Audit {{company}}'s deck. Do you have these exact 10 slides? If you have 20 slides, cut half.",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "Slide",
          rightTitle: "Key Question to Answer",
          items: [
            { left: "1. Problem", right: "Why does this hurt?" },
            { left: "2. Solution", right: "How do you cure it?" },
            { left: "3. Market", right: "How many people pay?" },
            { left: "4. Product", right: "How does it work?" },
            { left: "5. Traction", right: "Who loves it already?" },
            { left: "6. Team", right: "Why you?" },
            { left: "7. Competition", right: "Why not Google?" },
            { left: "8. Business Model", right: "How you make money?" },
            { left: "9. Financials", right: "How rich will we get?" },
            { left: "10. Ask", right: "What do you need?" }
          ]
        }
      }
    ]
  },
  "17": {
    moduleTitle: "17: Problem & Solution",
    slides: [
      {
        title: "Vitamin vs. Painkiller",
        bullets: [
          "**Vitamin**: Nice to have. 'I'll take it if I remember.'",
          "**Painkiller**: Need to have. 'My head hurts, give it to me NOW.'",
          "**India Rule**: Indians only pay for Painkillers."
        ],
        tutorNotes: "You want to be a Painkiller. Is the problem burning enough that people will pay?",
        detailedExplanation: "Define the problem sharply. 'People are bored' is weak. 'Commuters have 45 mins of boring travel and can't afford big data plans' is a specific, painful problem. Your app kills that pain instantly.",
        practicalExample: "Position {{company}} as the cure for 'Boredom on a Budget' in Bharat.",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "Vitamin",
          rightTitle: "Painkiller",
          items: [
            { left: "Might buy", right: "MUST buy" },
            { left: "Hard to sell", right: "Sells itself" },
            { left: "Low retention", right: "High retention" }
          ]
        }
      },
      {
        title: "The 'Hair on Fire' Problem",
        bullets: [
            "**Urgency**: Is the customer trying to solve this TODAY?",
            "**Workarounds**: Are they using a bad hacky solution right now?",
            "**Evidence**: Show they are desperate."
        ],
        tutorNotes: "If someone has their hair on fire, they don't compare prices for water. They just buy.",
        detailedExplanation: "The best problems are urgent. For {{company}}, the 'Hair on Fire' moment is when a user has finished their data pack or is stuck on a bus with nothing to do. They need entertainment NOW. Prove that urgency exists.",
        practicalExample: "Show photos of commuters watching videos on low-quality screens. That's your opportunity.",
        visualType: "STATISTIC",
        visualData: { statValue: "Urgency", statLabel: "Driver", statContext: "Customers must need it NOW." }
      },
      {
        title: "Solution Fit",
        bullets: [
            "**Elegant**: Does it solve the problem simply?",
            "**10x Better**: Is it 10x better than the workaround?",
            "**Addictive**: Does it make the pain go away permanently?"
        ],
        tutorNotes: "Don't just be slightly better. Be completely different.",
        detailedExplanation: "If your solution is 'YouTube but slightly different', nobody cares. It needs to be 'Netflix for ₹1'. That's a 10x improvement on price/access. Highlight the specific feature that makes {{company}} magical.",
        practicalExample: "Your 'Vertical Format' + 'Micropayments' is the magic combo for {{company}}.",
        visualType: "PROCESS",
        visualData: { steps: ["Identify Pain", "Build 10x Cure", "Remove Friction", "Profit"] }
      }
    ]
  },
  "18": {
    moduleTitle: "18: Market Sizing (TAM)",
    slides: [
      {
        title: "How Big is the Pond?",
        bullets: [
          "**TAM**: Total Addressable Market (Everyone).",
          "**SAM**: Serviceable Market (Your specific segment).",
          "**India 1/2/3**: Not all 1.4 Billion people pay.",
        ],
        tutorNotes: "Don't say 'Everyone in India is my customer'. A farmer in Bihar buys differently than a coder in Bangalore.",
        detailedExplanation: "India 1 (Rich) pays easily. India 2 (Middle) pays small amounts. India 3 (Poor) barely pays. Your TAM calculation must be honest about WHO pays. Are you targeting India 2?",
        practicalExample: "Calculate {{company}}'s market as 'Mobile users in Tier 2/3 cities willing to spend ₹10'.",
        visualType: "STATISTIC",
        visualData: { statValue: "₹5000 Cr", statLabel: "SAM", statContext: "Your realistic market slice." }
      },
      {
        title: "Top Down vs Bottom Up",
        bullets: [
            "**Top Down**: 'India has 1B people, we get 1%'. (Lazy).",
            "**Bottom Up**: 'We sell to 5M students at ₹100'. (Smart).",
            "**Credibility**: Bottom up math shows you know your business."
        ],
        tutorNotes: "Investors hate Top Down. It's fake math. Build your number from the ground up.",
        detailedExplanation: "Show the math: 'There are 50M daily commuters in Tier 2 cities. We can reach 10% of them. They pay ₹50/month. That is ₹25 Cr/month revenue.' This proves you understand the customer and the pricing.",
        practicalExample: "Use Bottom-Up math for {{company}}'s TAM slide.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Top Down",
            rightTitle: "Bottom Up",
            items: [
                { left: "Vague", right: "Specific" },
                { left: "Lazy", right: "Credible" },
                { left: "Ignored", right: "Respected" }
            ]
        }
      },
      {
        title: "The 'Why Now' Market",
        bullets: [
            "**Tailwinds**: What changed recently? (5G, UPI).",
            "**Timing**: Why wasn't this built 5 years ago?",
            "**Urgency**: Why is this the perfect moment?"
        ],
        tutorNotes: "Being too early is the same as being wrong. Prove the timing is perfect.",
        detailedExplanation: "For {{company}}, the 'Why Now' is clear: 5G rollouts + UPI adoption. 5 years ago, data was too expensive and paying ₹1 was hard. Now, it's easy. This slide proves you are surfing a wave, not paddling against it.",
        practicalExample: "Highlight 'Cheaper Data' and 'UPI' as key drivers for {{company}}.",
        visualType: "PROCESS",
        visualData: { steps: ["5G Launch", "UPI Growth", "Content Hunger", "Your App"] }
      }
    ]
  },
  "19": {
    moduleTitle: "19: Business Model",
    slides: [
      {
        title: "Show Me The Money",
        bullets: [
          "**Ads**: You need MILLIONS of users.",
          "**Subscription**: Hard to sell monthly plans in India.",
          "**Sachet Pricing**: Pay ₹5 per episode. (Works well!)",
        ],
        tutorNotes: "In India, 'Sachet Pricing' (Micro-transactions) is magic. Think shampoo packets, not bottles.",
        detailedExplanation: "Explain exactly who pays and how much. 'We show ads to free users, and charge ₹5 to unlock premium episodes.' Simple. Investors love simple models.",
        practicalExample: "Maybe {{company}} charges ₹1 per episode? That's a frictionless model for India.",
        visualType: "STATISTIC",
        visualData: { statValue: "₹1", statLabel: "Sachet Price", statContext: "Low friction entry point." }
      },
      {
        title: "Freemium vs Paid",
        bullets: [
            "**Freemium**: Get them hooked for free, charge for premium.",
            "**Conversion**: In India, expect 1-5% to convert to paid.",
            "**Ads**: Monetize the free users with ads."
        ],
        tutorNotes: "You can't just have paid users in consumer tech. You need a funnel.",
        detailedExplanation: "The Freemium model is standard for OTT. Free users build the brand and viral growth. Paid users provide the profit. Ensure you have a strategy for BOTH. Don't ignore the 95% who won't pay—show them ads.",
        practicalExample: "Use ads for {{company}}'s free tier to cover server costs.",
        visualType: "PROCESS",
        visualData: { steps: ["Free User", "Gets Hooked", "Hits Paywall", "Pays ₹10"] }
      },
      {
        title: "Marketplace Dynamics",
        bullets: [
            "**Creators**: You pay them a share (Rev Share).",
            "**Platform**: You keep a cut (Take Rate).",
            "**Economics**: Gross Margin = Your Cut."
        ],
        tutorNotes: "If you pay creators, you are a marketplace. Show how you keep them happy.",
        detailedExplanation: "If {{company}} pays creators 50% of revenue, your 'Take Rate' is 50%. This is your Gross Margin. Investors check this to ensure you aren't giving away all the money. A healthy take rate for media is 30-50%.",
        practicalExample: "Define {{company}}'s creator payout clearly. 50/50 split is standard.",
        visualType: "STATISTIC",
        visualData: { statValue: "30-50%", statLabel: "Take Rate", statContext: "Platform share of revenue." }
      }
    ]
  },
  "20": {
    moduleTitle: "20: Competition & Moat",
    slides: [
      {
        title: "Why You Won't Die",
        bullets: [
          "**Competitors**: Who else is fighting for attention? (YouTube, Reels).",
          "**Moat**: Your castle wall. What protects you?",
          "**Defensibility**: Why can't Google just copy you?"
        ],
        tutorNotes: "Never say 'We have no competition'. It means you have no market. Say 'Our competitors are lazy/expensive'.",
        detailedExplanation: "Your 'Moat' is your secret sauce. Maybe you have exclusive rights to the best writers? Maybe your community is super loyal? Without a moat, a rich competitor can crush you easily.",
        practicalExample: "For {{company}}, your moat might be 'Exclusive contracts with top 50 local writers'.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Defensible",
            rightTitle: "Vulnerable",
            items: [
                { left: "Loyal Fans", right: "Disloyal Users" },
                { left: "Unique IP", right: "Generic Content" },
                { left: "High Margins", right: "Low Margins" }
            ]
        }
      },
      {
        title: "The Competitive Matrix",
        bullets: [
            "**The Chart**: X and Y axis graph.",
            "**Positioning**: Put yourself in the top-right corner.",
            "**Axes**: e.g., 'Premium vs Free' and 'Vertical vs Horizontal'."
        ],
        tutorNotes: "Visuals work best here. Show, don't just tell.",
        detailedExplanation: "Create a 2x2 matrix. Axis 1: Quality (High vs Low). Axis 2: Duration (Short vs Long). Place YouTube, Netflix, and Reels. Then place {{company}} in the empty 'High Quality, Short Duration' quadrant. That's your niche.",
        practicalExample: "Draw the matrix for {{company}} showing it occupies a unique space.",
        visualType: "PROCESS",
        visualData: { steps: ["Choose Axes", "Plot Rivals", "Plot Yourself", "Show Gap"] }
      },
      {
        title: "Indirect Competitors",
        bullets: [
            "**The Real Enemy**: Sleep, PUBG, Instagram.",
            "**Attention Economy**: You compete for time, not just video.",
            "**Strategy**: How do you steal minutes from Instagram?"
        ],
        tutorNotes: "Your biggest rival isn't another app; it's boredom or other habits.",
        detailedExplanation: "Investors know that users have limited time. A user playing Ludo King isn't watching your show. Acknowledge that you are fighting for 'Entertainment Time'. Your weapon is 'High Dopamine in Short Bursts'.",
        practicalExample: "Position {{company}} as 'Better than doomscrolling' for entertainment.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Direct",
            rightTitle: "Indirect",
            items: [
                { left: "Netflix", right: "Sleep" },
                { left: "Reels", right: "PUBG" },
                { left: "YouTube", right: "Traffic Jam" }
            ]
        }
      }
    ]
  },
  "21": {
    moduleTitle: "21: Product Metrics",
    slides: [
      {
        title: "Are People Hooked?",
        bullets: [
          "**Retention**: Do they come back tomorrow?",
          "**DAU/MAU**: How addicted are they?",
          "**Time Spent**: How many minutes do they watch?"
        ],
        tutorNotes: "Retention is the #1 thing VCs look at. A leaky bucket can't be filled.",
        detailedExplanation: "If 100 people download your app, how many are still there after 30 days? If it's 30 people, you have a great business. If it's 5, you have a problem. Fix retention before raising money.",
        practicalExample: "Track {{company}}'s Day-30 retention. If it's over 20%, shout about it!",
        visualType: "STATISTIC",
        visualData: { statValue: "20%+", statLabel: "Good D30", statContext: "Aim for this retention." }
      },
      {
        title: "The North Star Metric",
        bullets: [
            "**One Number**: The single metric that defines success.",
            "**For OTT**: Usually 'Minutes Watched' or 'Episodes Completed'.",
            "**Focus**: Align the whole team to move this one number."
        ],
        tutorNotes: "Don't track 50 things. Pick one that matters.",
        detailedExplanation: "Downloads are a vanity metric. You can buy downloads. You can't buy watch time. For {{company}}, 'Total Minutes Watched' proves people love the content. If this number grows, you win.",
        practicalExample: "Make 'Weekly Minutes Watched' the North Star for {{company}}.",
        visualType: "STATISTIC",
        visualData: { statValue: "Watch Time", statLabel: "North Star", statContext: "The truest measure of value." }
      },
      {
        title: "Viral Coefficient (K-Factor)",
        bullets: [
            "**Referrals**: How many friends does 1 user invite?",
            "**K > 1**: Viral growth (Exponential).",
            "**K < 1**: Paid growth (Linear).",
            "**Cost**: High K-Factor lowers your CAC drastically."
        ],
        tutorNotes: "Free growth is the best growth. Build sharing features.",
        detailedExplanation: "If every user brings 1.1 friends, you grow forever for free. If they bring 0.5 friends, you have to pay for ads. Features like 'Share to unlock next episode' boost this K-factor.",
        practicalExample: "Add a WhatsApp share button to {{company}} to boost K-Factor.",
        visualType: "STATISTIC",
        visualData: { statValue: "K > 1", statLabel: "Viral Goal", statContext: "Exponential organic growth." }
      }
    ]
  },
  "22": {
    moduleTitle: "22: Revenue Metrics",
    slides: [
      {
        title: "The Cash Scoreboard",
        bullets: [
          "**MRR**: Monthly Recurring Revenue. (Predictable cash).",
          "**ARPU**: Average Revenue Per User. (How much is a user worth?)",
          "**Growth Rate**: How fast is MRR going up?"
        ],
        tutorNotes: "In India, ARPU is low (₹50-200). You win by having LOTS of users.",
        detailedExplanation: "Investors love MRR because it comes in every month automatically. If your graph goes 'up and to the right', investors get excited. Growth rate matters more than absolute numbers early on.",
        practicalExample: "If {{company}} has 10k users paying ₹50, that's ₹5 Lakhs MRR. Small start, but if it doubles every month, it's huge.",
        visualType: "STATISTIC",
        visualData: { statValue: "20%", statLabel: "MoM Growth", statContext: "Target growth rate for Seed." }
      },
      {
        title: "Gross Margin",
        bullets: [
            "**Revenue - COGS**: Money left after paying direct costs.",
            "**COGS**: Hosting, Payment Gateway Fees, Creator Payouts.",
            "**Target**: Software should be 80%+. Media is lower (50%)."
        ],
        tutorNotes: "Don't sell ₹10 notes for ₹9. Check your margins.",
        detailedExplanation: "If you sell a subscription for ₹100, but pay ₹50 to the creator and ₹20 to Google Cloud... you keep ₹30. Your Gross Margin is 30%. Investors need to know this to see if the business can be profitable at scale.",
        practicalExample: "Calculate {{company}}'s margin. Ensure it's positive!",
        visualType: "STATISTIC",
        visualData: { statValue: "50%+", statLabel: "Healthy Margin", statContext: "For content platforms." }
      },
      {
        title: "Churn is the Enemy",
        bullets: [
            "**Leaky Bucket**: Users cancelling subscriptions.",
            "**Churn Rate**: % of users leaving per month.",
            "**Impact**: High churn kills growth. You can't outrun it."
        ],
        tutorNotes: "It's cheaper to keep an old user than find a new one.",
        detailedExplanation: "If 10% of users leave every month, you lose your whole userbase in a year. You have to run fast just to stay in the same place. Keep churn low (<5%) by having great content.",
        practicalExample: "Measure monthly churn for {{company}}. If it's high, fix the content before marketing.",
        visualType: "STATISTIC",
        visualData: { statValue: "<5%", statLabel: "Safe Churn", statContext: "Monthly user loss target." }
      }
    ]
  },
  "23": {
    moduleTitle: "23: Unit Economics",
    slides: [
      {
        title: "The Lemonade Stand Math",
        bullets: [
          "**CAC**: Cost to Buy a Customer (Ads).",
          "**LTV**: How much that Customer Pays you over time.",
          "**The Rule**: You must make 3x more than you spend (LTV > 3x CAC)."
        ],
        tutorNotes: "If you spend ₹100 to get a user who only gives you ₹50... stop spending! You are losing money on every sale.",
        detailedExplanation: "Unit economics prove the machine works. 'I put ₹1 in the machine, and ₹3 comes out.' If this is true, investors will give you unlimited money to put into the machine. If not, you have a broken machine.",
        practicalExample: "Calculate {{company}}'s CAC. If you pay ₹10 for an install, and they watch ₹30 of ads, you win.",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "Bad Biz",
          rightTitle: "Good Biz",
          items: [
            { left: "Spend ₹100, Make ₹50", right: "Spend ₹100, Make ₹300" },
            { left: "Losing money/user", right: "Profit per user" },
            { left: "Unscalable", right: "Scalable" }
          ]
        }
      },
      {
        title: "LTV Calculation",
        bullets: [
            "**Formula**: ARPU × Lifetime (Months).",
            "**Example**: ₹50/month × 6 months = ₹300 LTV.",
            "**Goal**: Increase LTV by keeping them longer (Retention)."
        ],
        tutorNotes: "LTV is a guess early on. Be conservative.",
        detailedExplanation: "Don't assume they stay for 5 years. Assume 6-12 months. If your LTV is high, you can afford to spend more on ads (higher CAC) to grow faster. It gives you a competitive advantage.",
        practicalExample: "Estimate {{company}}'s LTV conservatively (e.g., 6 months).",
        visualType: "PROCESS",
        visualData: { steps: ["Avg Monthly Rev", "×", "Months Stays", "=", "Lifetime Value"] }
      },
      {
        title: "Payback Period",
        bullets: [
            "**Time to Recoup**: How long to earn back the ad spend?",
            "**Target**: < 6 months is amazing. < 12 months is okay.",
            "**Cash Flow**: Faster payback = Less funding needed."
        ],
        tutorNotes: "If it takes 2 years to get your money back, you will run out of cash.",
        detailedExplanation: "If you spend ₹100 to get a user, and they pay ₹10/month, it takes 10 months to get your ₹100 back. This is the 'Payback Period'. Shorter is better because you can recycle that cash into new ads.",
        practicalExample: "Aim for a 6-month payback for {{company}}.",
        visualType: "STATISTIC",
        visualData: { statValue: "6-12 Mo", statLabel: "Target Payback", statContext: "Time to recover CAC." }
      }
    ]
  },
  "24": {
    moduleTitle: "24: Financial Modeling",
    slides: [
      {
        title: "Crystal Ball Gazing",
        bullets: [
          "**Burn Rate**: How much cash you lose each month.",
          "**Runway**: How many months until you die (cash reaches zero).",
          "**Projections**: Guessing your future revenue."
        ],
        tutorNotes: "Your guesses will be wrong. But investors want to see your LOGIC.",
        detailedExplanation: "You need a plan. 'We will spend ₹10L a month. We have ₹2 Cr in the bank. So we can survive for 20 months.' This helps you sleep at night and helps investors trust you.",
        practicalExample: "Build a simple spreadsheet for {{company}}. Show that the funding gives you 18 months of life.",
        visualType: "PROCESS",
        visualData: { steps: ["Cash in Bank", "Minus Monthly Burn", "Equals Runway", "Raise Before Zero"] }
      },
      {
        title: "The Hiring Plan",
        bullets: [
            "**People = Cost**: Salaries are 70% of your expenses.",
            "**Timeline**: Don't hire everyone Day 1. Hire as you grow.",
            "**Revenue/Employee**: Keep the team lean."
        ],
        tutorNotes: "Investors check if you are over-hiring. Don't hire 50 people if you have no revenue.",
        detailedExplanation: "Your financial model is mostly a hiring plan. 'Month 1: 2 Founders. Month 6: Hire 2 Engineers. Month 12: Hire Sales.' Map this out. It shows you know how to build a team responsibly.",
        practicalExample: "Map out the next 10 hires for {{company}} in the model.",
        visualType: "PROCESS",
        visualData: { steps: ["Founders", "Engineers", "Marketing", "Sales"] }
      },
      {
        title: "Sanity Checks",
        bullets: [
            "**Reality Check**: Does your graph look like a hockey stick?",
            "**Benchmarks**: Compare with industry standards.",
            "**Defense**: Be ready to explain 'Why' you grow that fast."
        ],
        tutorNotes: "If you project ₹100 Cr revenue in Year 1, they will laugh. Be ambitious but sane.",
        detailedExplanation: "Investors see thousands of models. If you say you will reach 1 Million users with ₹0 marketing, they know you are lying. Make sure your inputs (Marketing Spend) match your outputs (User Growth).",
        practicalExample: "Ensure {{company}}'s growth rate matches its ad spend in the model.",
        visualType: "STATISTIC",
        visualData: { statValue: "Sane", statLabel: "Projection", statContext: "Ambitious but grounded in math." }
      }
    ]
  },
  "25": {
    moduleTitle: "25: Investor Pipeline",
    slides: [
      {
        title: "Making the List",
        bullets: [
          "**The Funnel**: You need to kiss many frogs to find a prince.",
          "**Target**: Find 50 investors who like Media/Consumer apps.",
          "**Filter**: Don't pitch B2B investors. It wastes time."
        ],
        tutorNotes: "Fundraising is sales. You need a list of leads. Expect 90 'No's to get 1 'Yes'.",
        detailedExplanation: "Use LinkedIn, Crunchbase, or lists like 'Active Angels in India'. Put them in a spreadsheet. Check if they invested in competitors (bad) or similar spaces (good). Don't spray and pray.",
        practicalExample: "Add 50 names to {{company}}'s target list. Filter by 'Consumer Tech' focus.",
        visualType: "PROCESS",
        visualData: { steps: ["Research VCs", "Filter List", "Find Intros", "Send Emails"] }
      },
      {
        title: "Tracking the Funnel",
        bullets: [
            "**CRM**: Use Notion or Excel to track status.",
            "**Stages**: Contacted -> Meeting -> Diligence -> Term Sheet.",
            "**Follow Up**: Most deals happen after the 3rd follow-up."
        ],
        tutorNotes: "If you don't track it, you lose it. Investors are busy; remind them.",
        detailedExplanation: "Treat investors like customers. Move them through the funnel. If they say 'Not now', set a reminder to email them in 2 months with an update. Discipline wins deals.",
        practicalExample: "Create a 'Fundraising CRM' for {{company}} today.",
        visualType: "PROCESS",
        visualData: { steps: ["Lead (50)", "Meeting (20)", "Deep Dive (5)", "Term Sheet (1)"] }
      },
      {
        title: "Qualify the Lead",
        bullets: [
            "**Check Size**: Do they write the size check you need?",
            "**Fund Cycle**: Do they have money left to spend?",
            "**Lead vs Follow**: Can they lead the round?"
        ],
        tutorNotes: "Don't pitch a 'Follower' investor until you have a 'Lead'. It's a waste of time.",
        detailedExplanation: "Some investors only invest if someone else leads (sets the price). Find the Lead investor first. Also, check if they are actively investing. 'Zombie Funds' have no money left but still take meetings.",
        practicalExample: "Tag each investor in {{company}}'s list as 'Lead' or 'Follower'.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Lead",
            rightTitle: "Follower",
            items: [
                { left: "Sets Price", right: "Accepts Price" },
                { left: "Does Diligence", right: "Piggybacks" },
                { left: "Pitch First", right: "Pitch Second" }
            ]
        }
      }
    ]
  },
  "26": {
    moduleTitle: "26: The Warm Intro",
    slides: [
      {
        title: "Don't Cold Call",
        bullets: [
          "**Trust**: Investors trust their friends, not random emails.",
          "**The Bridge**: Find someone who knows the investor.",
          "**The Ask**: 'Can you introduce me to X?'"
        ],
        tutorNotes: "Cold emails have a 1% chance. Warm intros have a 50% chance. Spend energy finding the bridge.",
        detailedExplanation: "If a founder they backed says 'You need to meet {{company}}', the investor WILL take the meeting. Use LinkedIn to find mutual connections. It's the golden key to opening doors.",
        practicalExample: "Look at who invested in KukuFM. Find a mutual connection. Ask for the intro.",
        visualType: "STATISTIC",
        visualData: { statValue: "50x", statLabel: "Better Odds", statContext: "With a warm intro." }
      },
      {
        title: "The Forwardable Email",
        bullets: [
            "**The format**: Write the email FOR the connector.",
            "**Blurb**: 2 sentences describing the company + 1 sentence on traction.",
            "**Ease**: Make it easy for them to just click 'Forward'."
        ],
        tutorNotes: "Don't make your friend write the email. Write it for them.",
        detailedExplanation: "Send your friend a clean email: 'Subject: Intro to {{company}}. Hi [Investor], meet [You]. They are building X and just hit Y traction. Deck attached.' Your friend just forwards it. Less friction = more intros.",
        practicalExample: "Draft a 'Forwardable Blurb' for {{company}} today.",
        visualType: "PROCESS",
        visualData: { steps: ["Write Blurb", "Send to Friend", "Friend Forwards", "Investor Replies"] }
      },
      {
        title: "Building Social Capital",
        bullets: [
            "**Give First**: Help others before asking for help.",
            "**Updates**: Send monthly updates to potential connectors.",
            "**Consistency**: Prove you are executing."
        ],
        tutorNotes: "People help winners. Show you are winning.",
        detailedExplanation: "Send a monthly 'Investor Update' to friends and mentors even before you raise. 'We grew 20% this month.' When you finally ask for an intro, they already know you are crushing it.",
        practicalExample: "Start a monthly newsletter for {{company}}'s network.",
        visualType: "STATISTIC",
        visualData: { statValue: "Trust", statLabel: "Capital", statContext: "Built over time, spent on intros." }
      }
    ]
  },
  "27": {
    moduleTitle: "27: The Pitch Meeting",
    slides: [
      {
        title: "Showtime!",
        bullets: [
          "**First 2 Mins**: Hook them fast. Don't be boring.",
          "**The Deck**: It's just background wallpaper. YOU are the show.",
          "**Confidence**: Know your numbers. Don't bluff."
        ],
        tutorNotes: "It's a conversation, not a lecture. Listen to their questions.",
        detailedExplanation: "Practice makes perfect. If you stumble on 'What's your CAC?', you lose trust. Be excited but realistic. If you don't know an answer, say 'I'll get back to you'. Be human.",
        practicalExample: "Practice the pitch for {{company}} 50 times. Record yourself.",
        visualType: "PROCESS",
        visualData: { steps: ["Small Talk (5m)", "The Pitch (15m)", "Q&A (20m)", "Next Steps (5m)"] }
      },
      {
        title: "Handling Objections",
        bullets: [
            "**Listen**: Understand the *real* concern.",
            "**Don't Argue**: 'That's a fair point, however...'",
            "**Pivot to Strength**: Address the weakness, then highlight a strength."
        ],
        tutorNotes: "An objection is a sign of interest. If they didn't care, they wouldn't ask.",
        detailedExplanation: "If they say 'Competition is tough', don't say 'No it's not'. Say 'Yes, it is, but we have a secret weapon (Moat) that they don't.' Agree and pivot. It shows maturity.",
        practicalExample: "Prepare answers for the top 3 hard questions about {{company}}.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Bad Answer",
            rightTitle: "Good Answer",
            items: [
                { left: "Defensive", right: "Curious" },
                { left: "Argues", right: "Clarifies" },
                { left: "Denies Risk", right: "Mitigates Risk" }
            ]
        }
      },
      {
        title: "The Follow Up",
        bullets: [
            "**Speed**: Send a thank you email within 24 hours.",
            "**Data**: Answer any unanswered questions.",
            "**Next Step**: Ask clearly for the next meeting."
        ],
        tutorNotes: "Deals are won in the follow-up. Be professional and fast.",
        detailedExplanation: "Send a clean email: 'Thanks for the time. Here is the answer to your question about CAC. Here is the data room link. Let me know if you need anything else.' It shows you are an executor.",
        practicalExample: "Create a follow-up email template for {{company}}.",
        visualType: "PROCESS",
        visualData: { steps: ["Meeting Ends", "Send Email", "Provide Data", "Book Next Call"] }
      }
    ]
  },
  "28": {
    moduleTitle: "28: Term Sheet Economics",
    slides: [
      {
        title: "The Money Rules",
        bullets: [
          "**Valuation**: The price they pay.",
          "**ESOP Pool**: Shares set aside for employees (comes from your pocket).",
          "**Liquidation Pref**: The 'Who gets paid first' rule."
        ],
        tutorNotes: "Watch out for 'Participating Liquidation Preference'. It's greedy. Avoid it.",
        detailedExplanation: "Liquidation Preference protects the investor. '1x Non-Participating' means if you sell the company cheap, they get their money back first. This is standard. Anything more is unfair to you.",
        practicalExample: "Ensure {{company}}'s term sheet says '1x Non-Participating'.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Non-Participating",
            rightTitle: "Participating",
            items: [
                { left: "Fair", right: "Greedy" },
                { left: "1x Payout", right: "Double Dip" },
                { left: "Standard", right: "Avoid" }
            ]
        }
      },
      {
        title: "Anti-Dilution",
        bullets: [
            "**Protection**: If you raise a 'Down Round' later (lower price).",
            "**Weighted Average**: The fair way. Adjusts their price slightly.",
            "**Full Ratchet**: The deadly way. Reprices ALL their shares to the new low price."
        ],
        tutorNotes: "Never accept 'Full Ratchet'. It can wipe you out.",
        detailedExplanation: "Anti-dilution protects investors if your value drops. 'Weighted Average' is standard market practice. 'Full Ratchet' is a punishment. If an investor asks for Full Ratchet, fight back or walk away.",
        practicalExample: "Check {{company}}'s term sheet for 'Broad-based Weighted Average' anti-dilution.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Weighted Avg",
            rightTitle: "Full Ratchet",
            items: [
                { left: "Market Std", right: "Toxic" },
                { left: "Fair Adjustment", right: "Total Reset" },
                { left: "Founder Friendly", right: "Founder Killer" }
            ]
        }
      },
      {
        title: "Dividends (Rare)",
        bullets: [
            "**Profit Share**: Paying cash to shareholders.",
            "**Startups**: Usually don't pay dividends (we reinvest).",
            "**Clause**: Ensure dividends are 'when and if declared'."
        ],
        tutorNotes: "You need cash for growth, not to pay investors. Keep it in the company.",
        detailedExplanation: "Sometimes term sheets mention dividends. Just make sure they aren't mandatory (Cumulative). You want the freedom to use all profits to grow {{company}}, not pay out cash.",
        practicalExample: "Ensure {{company}} has no mandatory dividend payments.",
        visualType: "STATISTIC",
        visualData: { statValue: "0%", statLabel: "Dividend", statContext: "Reinvest 100% in growth." }
      }
    ]
  },
  "29": {
    moduleTitle: "29: Term Sheet Control",
    slides: [
      {
        title: "Who is the Boss?",
        bullets: [
          "**Board Seats**: Who sits at the big table?",
          "**Veto Rights**: Investors can block big decisions (like selling).",
          "**Drag Along**: If they want to sell, you must sell too."
        ],
        tutorNotes: "Money can be earned back. Control is lost forever.",
        detailedExplanation: "Investors will want a Board Seat to watch their money. That's fair. But you (Founders) should keep the majority of seats so you can run the company. Don't let them veto hiring or budget changes.",
        practicalExample: "Fight to keep Board control for {{company}} founders (e.g., 2 Founders, 1 Investor).",
        visualType: "COMPARISON",
        visualData: {
          leftTitle: "Founder Control",
          rightTitle: "Investor Control",
          items: [
            { left: "Board Majority", right: "Board Vetoes" },
            { left: "Hiring decisions", right: "Firing CEO rights" },
            { left: "Run day-to-day", right: "Audit rights" }
          ]
        }
      },
      {
        title: "Information Rights",
        bullets: [
            "**Transparency**: Investors have a right to see the numbers.",
            "**Frequency**: Monthly or Quarterly reports.",
            "**Standard**: Always say yes to this. It builds trust."
        ],
        tutorNotes: "Don't hide bad news. Bad news ages like milk, not wine.",
        detailedExplanation: "Investors need to know how their money is doing. Agree to send them a standard P&L and Balance Sheet. It forces you to be disciplined with {{company}}'s accounting.",
        practicalExample: "Agree to Quarterly Info Rights for {{company}}.",
        visualType: "PROCESS",
        visualData: { steps: ["Close Books", "Create Report", "Send to Board", "Discuss"] }
      },
      {
        title: "Founder Vesting Reset",
        bullets: [
            "**The Ask**: Investors might ask you to restart your vesting clock.",
            "**Why**: To ensure you stay for another 4 years.",
            "**Negotiation**: Try to get credit for time served."
        ],
        tutorNotes: "If you worked 2 years, don't let them reset you to Day 0 completely.",
        detailedExplanation: "This is a common negotiation point. If you have been building {{company}} for 2 years, you are 50% vested. Investors might say 'Reset to 0'. Push back. Agree to a partial reset if needed, but protect your earned equity.",
        practicalExample: "Negotiate 'Time Served' credit for {{company}}'s founders.",
        visualType: "COMPARISON",
        visualData: {
            leftTitle: "Full Reset",
            rightTitle: "Partial Reset",
            items: [
                { left: "Start at 0%", right: "Keep Vested %" },
                { left: "Unfair", right: "Fair" },
                { left: "4 more years", right: "Balance years" }
            ]
        }
      }
    ]
  },
  "30": {
    moduleTitle: "30: Closing the Deal",
    slides: [
      {
        title: "The Final Lap",
        bullets: [
          "**Due Diligence**: They check your homework (Bank statements, Legal).",
          "**SHA**: The final monster contract (Shareholders Agreement).",
          "**The Wire**: Money hits the bank!"
        ],
        tutorNotes: "It's not over until the cash lands. Deals die at the last minute. Move fast.",
        detailedExplanation: "DD (Due Diligence) is boring but necessary. Have your documents ready in a Google Drive folder. The faster you give them papers, the faster they give you money.",
        practicalExample: "Prepare {{company}}'s 'Data Room' (Folder with docs) now so you are ready.",
        visualType: "PROCESS",
        visualData: { steps: ["Term Sheet", "Checking Docs", "Signing Contract", "Money Received"] }
      },
      {
        title: "Post-Closing Hygiene",
        bullets: [
            "**Share Certificates**: Issue them officially.",
            "**Filings**: Tell the government (RoC) about the new shares.",
            "**Welcome**: Send a welcome email to new investors."
        ],
        tutorNotes: "Don't forget the paperwork after the champagne.",
        detailedExplanation: "In India, you have strict timelines to file forms (like PAS-3) with the Registrar of Companies. If you miss this, you pay fines. Hire a Company Secretary (CS) to handle this for {{company}} immediately.",
        practicalExample: "Hire a CS to handle {{company}}'s post-funding compliance.",
        visualType: "PROCESS",
        visualData: { steps: ["Wire Hits", "Issue Shares", "File w/ RoC", "Update Cap Table"] }
      },
      {
        title: "Investor Relations",
        bullets: [
            "**Updates**: Send a monthly email update.",
            "**Bad News**: Share it early.",
            "**Asks**: Tell them how to help you."
        ],
        tutorNotes: "Your investors work for you now. Put them to work.",
        detailedExplanation: "The relationship starts *after* the check. Keep them engaged. A silent investor is a useless investor. Send a template: 'Highlights, Lowlights, KPIs, Asks'. It keeps {{company}} top of mind.",
        practicalExample: "Send the first investor update for {{company}} 30 days after closing.",
        visualType: "STATISTIC",
        visualData: { statValue: "Monthly", statLabel: "Update Rhythm", statContext: "Keep investors engaged." }
      }
    ]
  }
};
