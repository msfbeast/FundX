import { VCProfile } from '../types';

// Curated database of Indian VCs with SPECIFIC PARTNERS for high hit rate
export const VC_DATABASE: VCProfile[] = [
    {
        name: "Blume Ventures (Karthik Reddy)",
        firmType: "VC",
        checkSize: "₹5Cr - ₹25Cr",
        thesis: "Early-stage tech startups with strong product-market fit in India",
        notablePortfolio: ["Dunzo", "GreyOrange", "Unacademy"],
        matchReason: "Karthik leads consumer tech and marketplaces. Best for Pre-Series A.",
        email: "karthik@blume.vc",
        website: "https://blume.vc",
        linkedin: "https://www.linkedin.com/in/karthikreddy/"
    },
    {
        name: "Sequoia India (Rajan Anandan)",
        firmType: "VC",
        checkSize: "₹10Cr - ₹100Cr",
        thesis: "Surge program for early stage, focus on edtech, consumer, and SaaS",
        notablePortfolio: ["Zomato", "Byju's", "Razorpay"],
        matchReason: "Rajan is the Managing Director for Surge and focuses on early stage founders.",
        email: "rajan@sequoiacap.com",
        website: "https://www.sequoiacap.com/india",
        linkedin: "https://www.linkedin.com/in/rajananandan/"
    },
    {
        name: "Accel India (Prashanth Prakash)",
        firmType: "VC",
        checkSize: "₹8Cr - ₹50Cr",
        thesis: "Technology-first companies solving large problems in India",
        notablePortfolio: ["Swiggy", "Freshworks", "Urban Company"],
        matchReason: "Prashanth focuses on consumer internet and marketplaces.",
        email: "prashanth@accel.com",
        website: "https://www.accel.com/india",
        linkedin: "https://www.linkedin.com/in/prashanthprakash/"
    },
    {
        name: "Matrix Partners (Tarun Davda)",
        firmType: "VC",
        checkSize: "₹5Cr - ₹30Cr",
        thesis: "Early-stage companies in SaaS, fintech, and consumer",
        notablePortfolio: ["Ola", "Dailyhunt", "Razorpay"],
        matchReason: "Tarun leads consumer internet investments at Matrix.",
        email: "tarun@matrixpartners.in",
        website: "https://www.matrixpartners.in",
        linkedin: "https://www.linkedin.com/in/tarundavda/"
    },
    {
        name: "Kalaari Capital (Vani Kola)",
        firmType: "VC",
        checkSize: "₹3Cr - ₹20Cr",
        thesis: "Technology startups in consumer, healthcare, and fintech",
        notablePortfolio: ["Dream11", "Snapdeal", "Myntra"],
        matchReason: "Vani is a legend in consumer tech investing.",
        email: "vani@kalaari.com",
        website: "https://www.kalaari.com",
        linkedin: "https://www.linkedin.com/in/vanikola/"
    },
    {
        name: "Lightspeed India (Dev Khare)",
        firmType: "VC",
        checkSize: "₹10Cr - ₹40Cr",
        thesis: "Consumer, enterprise SaaS, and deep tech startups",
        notablePortfolio: ["Sharechat", "Udaan", "Innovaccer"],
        matchReason: "Dev focuses on content, media, and consumer platforms.",
        email: "dev@lsvp.com",
        website: "https://lsvp.com/india",
        linkedin: "https://www.linkedin.com/in/dkhare/"
    },
    {
        name: "100X.VC (Sanjay Mehta)",
        firmType: "Micro-VC",
        checkSize: "₹25L - ₹2Cr",
        thesis: "Very early-stage startups with iSAFE notes",
        notablePortfolio: ["Rupeek", "Jar", "Fampay"],
        matchReason: "Sanjay is the most active angel/micro-VC for first cheques.",
        email: "sanjay@100x.vc",
        website: "https://100x.vc",
        linkedin: "https://www.linkedin.com/in/sanjaymehta/"
    },
    {
        name: "Chiratae Ventures (Sudhir Sethi)",
        firmType: "VC",
        checkSize: "₹5Cr - ₹30Cr",
        thesis: "Technology companies across consumer, enterprise, and healthcare",
        notablePortfolio: ["Flipkart", "Lenskart", "Cure.fit"],
        matchReason: "Sudhir has deep experience in scaling consumer brands.",
        email: "sudhir@chiratae.com",
        website: "https://www.chiratae.com",
        linkedin: "https://www.linkedin.com/in/sudhirsethi/"
    },
    {
        name: "Stellaris VP (Ritesh Banglani)",
        firmType: "VC",
        checkSize: "₹5Cr - ₹25Cr",
        thesis: "Product-first companies in SaaS and deep tech",
        notablePortfolio: ["Mamaearth", "Whatfix", "Delhivery"],
        matchReason: "Ritesh focuses on product-led growth companies.",
        email: "ritesh@stellarisvp.com",
        website: "https://www.stellarisvp.com",
        linkedin: "https://www.linkedin.com/in/riteshbanglani/"
    },
    {
        name: "India Quotient (Anand Lunia)",
        firmType: "Micro-VC",
        checkSize: "₹50L - ₹5Cr",
        thesis: "Consumer internet and mobile-first startups",
        notablePortfolio: ["Sugar Cosmetics", "Licious", "Sharechat"],
        matchReason: "Anand loves quirky, non-obvious consumer insights.",
        email: "anand@indiaquotient.in",
        website: "https://www.indiaquotient.in",
        linkedin: "https://www.linkedin.com/in/anandlunia/"
    }
];

// Helper function to get VCs by type
export const getVCsByType = (type: string): VCProfile[] => {
    return VC_DATABASE.filter(vc => vc.firmType === type);
};

// Helper function to search VCs
export const searchVCs = (query: string): VCProfile[] => {
    const lowerQuery = query.toLowerCase();
    return VC_DATABASE.filter(vc =>
        vc.name.toLowerCase().includes(lowerQuery) ||
        vc.thesis.toLowerCase().includes(lowerQuery) ||
        vc.notablePortfolio.some(company => company.toLowerCase().includes(lowerQuery))
    );
};
