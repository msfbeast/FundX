# Deployment Guide - Funding Masterclass Coach

## 🚀 Quick Deploy to Vercel (5 minutes)

### Step 1: Prepare Your Code

1. **Create `.env.example`** (for documentation):
```bash
GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **Ensure `.gitignore` includes**:
```
.env
.env.local
node_modules
dist
```

3. **Test build locally**:
```bash
npm run build
npm run preview
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repo
4. **Add Environment Variables**:
   - `GEMINI_API_KEY` = your Gemini API key
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

5. Click "Deploy"

**Done!** Your app will be live at `your-app.vercel.app`

---

## ⚠️ CRITICAL: Security Fix Needed

### Problem
Your Gemini API key is exposed in the client code. Anyone can:
- View it in browser DevTools
- Steal it and rack up your bill
- Use it for their own apps

### Solution: Backend Proxy

Create API routes to proxy Gemini calls:

#### Option A: Vercel Serverless Functions

Create `api/gemini.ts`:
```typescript
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting (simple version)
  // TODO: Add proper rate limiting with Redis/Upstash

  const { prompt, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Server-side only!

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      // ... rest of config
    });

    res.status(200).json({ result: response.text });
  } catch (error) {
    res.status(500).json({ error: 'Generation failed' });
  }
}
```

Then update your client to call `/api/gemini` instead of Gemini directly.

#### Option B: Use Supabase Edge Functions

Deploy Gemini calls as Supabase Edge Functions (Deno-based).

---

## 🌐 Deployment Options Comparison

### Vercel ⭐ (Recommended)
- **Pros**: Zero config, automatic HTTPS, great DX, serverless functions
- **Cons**: None for your use case
- **Cost**: Free tier (100GB bandwidth, unlimited requests)
- **Best for**: React/Vite apps like yours

### Netlify
- **Pros**: Similar to Vercel, good CI/CD
- **Cons**: Slightly slower builds
- **Cost**: Free tier (100GB bandwidth)
- **Best for**: Static sites, JAMstack

### Firebase Hosting
- **Pros**: Google ecosystem, good CDN
- **Cons**: More complex setup
- **Cost**: Free tier (10GB storage, 360MB/day transfer)
- **Best for**: Apps already using Firebase

### Cloudflare Pages
- **Pros**: Fastest CDN, unlimited bandwidth on free tier
- **Cons**: Newer, fewer integrations
- **Cost**: Free tier (unlimited bandwidth!)
- **Best for**: Global audience

### Railway / Render
- **Pros**: Full backend support, databases
- **Cons**: Overkill for static site
- **Cost**: $5-10/month
- **Best for**: Full-stack apps with backend

---

## 📦 Build Configuration

### Current Setup (Good!)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Vercel Auto-Detects:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 🔐 Environment Variables Setup

### Development (.env.local)
```bash
GEMINI_API_KEY=AIza...
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
```

### Production (Vercel Dashboard)
Add the same variables in:
**Settings → Environment Variables**

⚠️ **Important**: 
- Variables prefixed with `VITE_` are exposed to client
- Non-prefixed variables are server-only (use for API keys!)

---

## 🚦 Pre-Deployment Testing

### 1. Build Test
```bash
npm run build
```
Should complete without errors.

### 2. Preview Test
```bash
npm run preview
```
Test at `http://localhost:4173`

### 3. Check Bundle Size
```bash
npm run build
```
Look for output:
```
dist/index.html                   0.XX kB
dist/assets/index-XXXXX.js      XXX.XX kB
```

**Target**: < 500 KB for main bundle

### 4. Lighthouse Score
Run in Chrome DevTools:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 🎯 Post-Deployment Checklist

### Immediate
- [ ] Test all features work
- [ ] Check environment variables loaded
- [ ] Verify Supabase connection
- [ ] Test podcast generation
- [ ] Test VC finder
- [ ] Check mobile responsiveness

### Within 24 Hours
- [ ] Set up custom domain
- [ ] Configure analytics (Vercel Analytics or Google Analytics)
- [ ] Set up error tracking (Sentry)
- [ ] Add monitoring (Vercel Monitoring)

### Within 1 Week
- [ ] Implement API proxy for Gemini
- [ ] Add rate limiting
- [ ] Set up CI/CD
- [ ] Configure caching headers
- [ ] Add sitemap.xml
- [ ] Add robots.txt

---

## 🔧 Optimization for Production

### 1. Code Splitting
Already handled by Vite automatically!

### 2. Image Optimization
If you add images later, use:
```typescript
import { defineConfig } from 'vite';
import imagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    imagemin({
      // optimize images
    })
  ]
});
```

### 3. Caching Headers
Add `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 4. Compression
Vercel handles this automatically (Brotli + Gzip)

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Recommended)
```bash
npm install @vercel/analytics
```

```typescript
// In App.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Google Analytics
```typescript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### Error Tracking (Sentry)
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

---

## 💰 Cost Estimation

### Free Tier (Vercel)
- **Bandwidth**: 100 GB/month
- **Requests**: Unlimited
- **Build Minutes**: 6,000/month
- **Serverless Functions**: 100 GB-hours

**Estimated Users**: ~10,000 monthly active users

### If You Exceed Free Tier
- **Pro Plan**: $20/month
- **Bandwidth**: 1 TB/month
- **Everything else**: Unlimited

### API Costs (Gemini)
- **Free Tier**: 15 requests/minute
- **Paid**: $0.00025 per 1K characters

**Estimated**: $10-50/month for 1,000 active users

---

## 🌍 Custom Domain Setup

### 1. Buy Domain
- Namecheap: ~$10/year
- Google Domains: ~$12/year
- Cloudflare: ~$10/year

### 2. Add to Vercel
1. Go to **Settings → Domains**
2. Add your domain: `fundingcoach.app`
3. Follow DNS instructions

### 3. DNS Configuration
Add these records:
```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

**Propagation**: 5 minutes - 48 hours

---

## 🚨 Common Deployment Issues

### Issue 1: Build Fails
**Error**: `Module not found`
**Fix**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 2: Environment Variables Not Working
**Error**: `undefined` in production
**Fix**: 
- Ensure variables start with `VITE_` for client access
- Redeploy after adding variables

### Issue 3: 404 on Refresh
**Error**: Page not found on direct URL access
**Fix**: Add `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue 4: Slow Initial Load
**Fix**: 
- Enable Vercel Edge Network
- Add loading skeletons (already done!)
- Lazy load heavy components

---

## 📱 Progressive Web App (PWA)

Want users to install your app? Add PWA support:

```bash
npm install vite-plugin-pwa
```

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Funding Masterclass Coach',
        short_name: 'Funding Coach',
        description: 'AI-powered fundraising coach',
        theme_color: '#1e293b',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

---

## 🎉 You're Ready!

Your app is production-ready with:
- ✅ Error handling
- ✅ Loading states
- ✅ Caching
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Progress indicators

**Next Steps**:
1. Push to GitHub
2. Deploy to Vercel
3. Add custom domain
4. Share with users!

**Estimated Time**: 30 minutes from code to live URL

Good luck! 🚀
