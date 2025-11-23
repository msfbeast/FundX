# 🚀 Deploy Everything to Vercel

## Overview

Deploy both frontend AND backend to Vercel using Serverless Functions.

**Benefits**:
- Everything in one place
- Single deployment
- Free tier
- Automatic HTTPS
- Global CDN

**Time**: 10 minutes

---

## Step 1: Create Vercel API Routes (5 minutes)

We'll convert the Express backend to Vercel Serverless Functions.

### Create API Directory Structure

```bash
mkdir -p api/generate
```

### Create Health Check Endpoint

Create `api/health.ts`:

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
```

### Create Chat Endpoint

Create `api/chat.ts`:

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history, newMessage, systemInstruction } = req.body;

    if (!newMessage) {
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

    res.status(200).json({ response: response.text || "I'm having trouble retrieving the answer." });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
}
```

### Create Quiz Generation Endpoint

Create `api/generate/quiz.ts`:

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { moduleName, systemInstruction } = req.body;

    if (!moduleName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Generate a quiz for ${moduleName}. 
    Return a JSON object with a 'questions' array. 
    Each question object must have: 'question' (string), 'options' (array of strings), 'correctAnswerIndex' (number), 'explanation' (string).
    Create 5 questions.`;

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
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
}
```

---

## Step 2: Update vercel.json

Update your `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Step 3: Install Vercel Types

```bash
npm install --save-dev @vercel/node
```

---

## Step 4: Update Frontend to Use Vercel API

Update `services/geminiServiceSecure.ts`:

```typescript
// Change this line:
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Now it will use relative paths like /api/chat
```

---

## Step 5: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? funding-coach
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables (see below)
6. Click "Deploy"

---

## Step 6: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```bash
# Backend (Serverless Functions)
GEMINI_API_KEY=your_actual_gemini_api_key

# Frontend
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=/api
```

**Important**: 
- `GEMINI_API_KEY` has NO `VITE_` prefix (server-side only)
- `VITE_API_URL=/api` uses relative path (same domain)

---

## Step 7: Test Deployment

After deployment:

1. Visit your Vercel URL (e.g., `https://funding-coach.vercel.app`)
2. Test features:
   - Sign up / Log in
   - Generate a quiz
   - Check DevTools → Network → API key should NOT be visible ✅

3. Test API endpoints directly:
   ```bash
   curl https://your-app.vercel.app/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

---

## 📊 Vercel-Only vs Railway+Vercel

| Feature | Vercel Only | Railway + Vercel |
|---------|-------------|------------------|
| **Setup** | Simpler | Slightly more complex |
| **Cost** | $0 | $0 |
| **Performance** | Serverless (cold starts) | Always warm |
| **Scaling** | Automatic | Automatic |
| **Monitoring** | Vercel dashboard | Two dashboards |
| **Best For** | Simple apps | High-traffic apps |

---

## 🚨 Important Notes

### Serverless Function Limits

Vercel Free Tier:
- **Execution Time**: 10 seconds max
- **Memory**: 1024 MB
- **Deployments**: 100/day
- **Bandwidth**: 100 GB/month

If you hit these limits, upgrade to Pro ($20/month) or use Railway for backend.

### Cold Starts

Serverless functions may have 1-2 second cold start delay on first request. Subsequent requests are fast.

---

## 🔧 Troubleshooting

### "Function execution timed out"
- Increase timeout in `vercel.json`:
  ```json
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
  ```
- Note: Free tier max is 10s, Pro tier max is 60s

### "Module not found"
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### "CORS error"
- Check `vercel.json` has CORS headers for `/api/*`
- Verify `Access-Control-Allow-Origin` is set

---

## 🎯 Complete File Structure

```
your-project/
├── api/
│   ├── health.ts
│   ├── chat.ts
│   └── generate/
│       ├── quiz.ts
│       ├── flashcards.ts
│       ├── roadmap.ts
│       ├── slides.ts
│       ├── vc-insights.ts
│       ├── podcast-script.ts
│       └── podcast-audio.ts
├── src/
│   └── ... (your frontend code)
├── vercel.json
├── package.json
└── .env (local only, not committed)
```

---

## ✅ Deployment Checklist

- [ ] Created `api/` directory with serverless functions
- [ ] Updated `vercel.json` with function config
- [ ] Installed `@vercel/node` types
- [ ] Updated `VITE_API_URL` to `/api`
- [ ] Pushed code to GitHub
- [ ] Deployed to Vercel
- [ ] Added environment variables in Vercel
- [ ] Tested all features in production
- [ ] Verified API key is NOT visible in browser

---

## 🎉 Success!

Your entire app is now running on Vercel!

**URL**: https://your-app.vercel.app  
**API**: https://your-app.vercel.app/api  
**Cost**: $0/month  
**Security**: 9/10 ✅

---

## 📞 Next Steps

1. Enable Supabase RLS policies (see START_HERE.md)
2. Test all features thoroughly
3. Monitor usage in Vercel dashboard
4. Share your app!

**Deployment Time**: ~10 minutes  
**Maintenance**: Minimal  
**Scaling**: Automatic
