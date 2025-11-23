# 🚀 Production Deployment Guide

## Overview

We'll deploy:
- **Frontend** → Vercel (free, optimized for Vite/React)
- **Backend** → Railway (free tier available, easy Express deployment)

**Total Time**: 15-20 minutes

---

## 📋 Pre-Deployment Checklist

- [ ] All security fixes applied
- [ ] `.env` file configured locally
- [ ] App runs locally with `npm run dev`
- [ ] Supabase RLS policies enabled
- [ ] Git repository initialized

---

## Part 1: Deploy Backend to Railway (10 minutes)

### Step 1: Prepare Backend for Deployment

Create `server/package.json`:

```json
{
  "name": "funding-coach-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "build": "echo 'No build needed'"
  },
  "dependencies": {
    "@google/genai": "^1.30.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0"
  }
}
```

### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub

### Step 3: Deploy Backend

1. Click "New Project" → "Deploy from GitHub repo"
2. Select your repository
3. Railway will auto-detect it's a Node.js app

### Step 4: Configure Environment Variables

In Railway dashboard:
1. Click on your service
2. Go to "Variables" tab
3. Add these variables:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=3001
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

**Important**: You'll update `FRONTEND_URL` after deploying frontend.

### Step 5: Configure Build Settings

1. Go to "Settings" tab
2. Set "Root Directory" to `server`
3. Set "Start Command" to `node index.js`
4. Click "Deploy"

### Step 6: Get Backend URL

After deployment:
1. Go to "Settings" → "Networking"
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://your-backend.up.railway.app`)
4. Save this - you'll need it for frontend!

---

## Part 2: Deploy Frontend to Vercel (5 minutes)

### Step 1: Prepare Frontend

Update `vercel.json` (create if doesn't exist):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"

### Step 3: Import Repository

1. Select your GitHub repository
2. Vercel will auto-detect it's a Vite app
3. Click "Import"

### Step 4: Configure Environment Variables

In Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add these variables:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-backend.up.railway.app/api
```

**Important**: Use the Railway backend URL from Part 1, Step 6!

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Get your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 6: Update Backend CORS

Go back to Railway:
1. Update `FRONTEND_URL` variable to your Vercel URL
2. Redeploy backend

---

## Part 3: Final Configuration (5 minutes)

### Update Supabase Settings

1. Go to Supabase Dashboard
2. Navigate to "Authentication" → "URL Configuration"
3. Add your Vercel URL to "Site URL"
4. Add to "Redirect URLs":
   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/**`

### Test Production Deployment

1. Visit your Vercel URL
2. Try signing up/logging in
3. Generate a quiz
4. Check browser DevTools → Network:
   - API calls should go to Railway backend
   - No API key should be visible ✅

---

## 🔧 Alternative: Deploy Both to Vercel

If you prefer everything on Vercel:

### Backend as Vercel Serverless Function

Create `api/` folder structure:

```
api/
├── chat.ts
├── generate/
│   ├── quiz.ts
│   ├── flashcards.ts
│   └── ...
```

Each file exports a Vercel serverless function:

```typescript
// api/chat.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  // ... your logic here

  res.json({ response: 'data' });
}
```

Update `vercel.json`:

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 🐳 Alternative: Deploy with Docker

### Create Dockerfile for Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ ./

EXPOSE 3001

CMD ["node", "index.js"]
```

### Deploy to:
- **Railway**: Supports Docker automatically
- **Render**: Free tier available
- **Fly.io**: Global edge deployment
- **DigitalOcean App Platform**: $5/month

---

## 📊 Deployment Comparison

| Platform | Frontend | Backend | Cost | Ease | Speed |
|----------|----------|---------|------|------|-------|
| **Vercel + Railway** | ✅ | ✅ | Free | ⭐⭐⭐⭐⭐ | Fast |
| **Vercel Only** | ✅ | ✅ | Free | ⭐⭐⭐⭐ | Fast |
| **Netlify + Render** | ✅ | ✅ | Free | ⭐⭐⭐⭐ | Medium |
| **Docker (Any)** | ✅ | ✅ | Varies | ⭐⭐⭐ | Medium |

**Recommended**: Vercel + Railway (easiest, free, fast)

---

## 🔐 Production Security Checklist

After deployment, verify:

- [ ] API key NOT visible in browser DevTools
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS configured correctly (only your frontend allowed)
- [ ] Rate limiting working (test with 11 requests)
- [ ] Supabase RLS policies enabled
- [ ] Environment variables set in production
- [ ] Error messages don't leak sensitive info
- [ ] Security headers present (check with securityheaders.com)

---

## 🧪 Testing Production

### Test 1: API Key Security
```bash
# Open browser DevTools → Network
# Generate a quiz
# Check request - API key should NOT be visible ✅
```

### Test 2: Backend Health
```bash
curl https://your-backend.up.railway.app/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test 3: Rate Limiting
```bash
# Make 11 quiz generation requests quickly
# 11th should fail with rate limit error ✅
```

### Test 4: CORS
```bash
# Try accessing backend from different domain
# Should fail with CORS error ✅
```

---

## 🚨 Common Deployment Issues

### Issue 1: "Cannot connect to backend"
**Solution**: 
- Check `VITE_API_URL` in Vercel environment variables
- Verify Railway backend is running
- Check Railway logs for errors

### Issue 2: "CORS error"
**Solution**:
- Update `FRONTEND_URL` in Railway to match Vercel URL
- Redeploy backend after changing

### Issue 3: "API key not found"
**Solution**:
- Check `GEMINI_API_KEY` is set in Railway
- Verify no typos in variable name
- Redeploy after adding

### Issue 4: "Build failed"
**Solution**:
- Check build logs in Vercel/Railway
- Verify all dependencies in package.json
- Test build locally: `npm run build`

---

## 📈 Monitoring & Maintenance

### Set Up Monitoring

**Vercel**:
- Built-in analytics available
- View deployment logs in dashboard
- Set up deployment notifications

**Railway**:
- View logs in dashboard
- Set up usage alerts
- Monitor resource usage

**Supabase**:
- Monitor database usage
- Check RLS policy violations
- Review auth logs

### Regular Maintenance

**Weekly**:
- [ ] Check error logs
- [ ] Monitor API usage
- [ ] Review rate limit hits

**Monthly**:
- [ ] Update dependencies (`npm update`)
- [ ] Review security advisories
- [ ] Check performance metrics

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Supabase URLs updated
- [ ] All features tested in production
- [ ] API key security verified
- [ ] Rate limiting tested
- [ ] Error tracking set up
- [ ] Monitoring configured

---

## 🎉 Success!

Your application is now live and secure! 

**Frontend**: https://your-app.vercel.app  
**Backend**: https://your-backend.up.railway.app

**Security Rating**: 9/10 ✅  
**Production Ready**: Yes ✅  
**Monitoring**: Active ✅

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Supabase Docs**: https://supabase.com/docs

---

**Deployment Time**: ~20 minutes  
**Cost**: $0 (free tiers)  
**Maintenance**: Minimal
