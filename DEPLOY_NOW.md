# 🚀 Deploy Now - Quick Guide

## ⚡ 5-Minute Deployment

Follow these steps to deploy your app in 5 minutes!

---

## Step 1: Deploy Backend to Railway (2 minutes)

### Option A: One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Click the button above
2. Connect your GitHub account
3. Select this repository
4. Railway will auto-deploy!

### Option B: Manual Deploy

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "Deploy"

### Configure Environment Variables

In Railway dashboard → Variables tab, add:

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Get Your Backend URL

1. Go to Settings → Networking
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://funding-coach-production.up.railway.app`)
4. **Save this URL!** You'll need it next.

---

## Step 2: Deploy Frontend to Vercel (2 minutes)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Connect your GitHub account
3. Select this repository
4. Configure environment variables (see below)
5. Click "Deploy"

### Environment Variables for Vercel

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-backend.up.railway.app/api
```

**Important**: Replace `your-backend.up.railway.app` with your actual Railway URL from Step 1!

---

## Step 3: Update CORS (1 minute)

After Vercel deployment:

1. Copy your Vercel URL (e.g., `https://funding-coach.vercel.app`)
2. Go back to Railway dashboard
3. Update `FRONTEND_URL` variable to your Vercel URL
4. Click "Redeploy"

---

## ✅ Verification Checklist

Test your deployment:

- [ ] Visit your Vercel URL
- [ ] Sign up / Log in works
- [ ] Generate a quiz
- [ ] Open DevTools → Network tab
- [ ] Verify API key is NOT visible ✅
- [ ] Try generating 11 quizzes (11th should fail with rate limit)

---

## 🎯 Quick Reference

### Your URLs

```
Frontend: https://your-app.vercel.app
Backend:  https://your-backend.up.railway.app
Health:   https://your-backend.up.railway.app/api/health
```

### Environment Variables

**Railway (Backend)**:
- `GEMINI_API_KEY` - Your Gemini API key
- `PORT` - 3001
- `FRONTEND_URL` - Your Vercel URL
- `NODE_ENV` - production

**Vercel (Frontend)**:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `VITE_API_URL` - Your Railway backend URL + `/api`

---

## 🚨 Troubleshooting

### "Cannot connect to backend"
- Check `VITE_API_URL` in Vercel matches your Railway URL
- Verify Railway backend is running (check logs)

### "CORS error"
- Update `FRONTEND_URL` in Railway to match Vercel URL exactly
- Redeploy Railway backend

### "API key not found"
- Check `GEMINI_API_KEY` is set in Railway
- No typos in variable name
- Redeploy after adding

---

## 🎉 Done!

Your app is now live and secure!

**Next Steps**:
1. Share your app URL
2. Monitor usage in Railway/Vercel dashboards
3. Enable Supabase RLS policies (see START_HERE.md)

---

**Deployment Time**: ~5 minutes  
**Cost**: $0 (free tiers)  
**Security**: 9/10 ✅
