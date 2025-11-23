# Supabase Setup Guide (5 minutes)

## Step 1: Create Supabase Project (2 min)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email
4. Click "New Project"
5. Fill in:
   - **Name**: `Fundx` (or any name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait ~2 minutes for project to be ready

## Step 2: Get API Keys (1 min)

1. In your Supabase project dashboard
2. Click ⚙️ **Settings** (bottom left)
3. Click **API** in the sidebar
4. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 3: Add to .env.local (1 min)

1. Open `/Users/msfbeast/Desktop/Fundx/.env.local`
2. Add these lines (replace with your actual values):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Run Database Schema (1 min)

1. In Supabase dashboard, click 🗄️ **SQL Editor** (left sidebar)
2. Click "+ New query"
3. Copy the entire contents of `/Users/msfbeast/Desktop/Fundx/supabase/schema.sql`
4. Paste into the SQL editor
5. Click **RUN** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

## Step 5: Restart Dev Server (30 sec)

1. Stop your current dev server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Open http://localhost:3000

## ✅ Done!

You now have:
- ✅ User authentication (email/password)
- ✅ Persistent VC storage in cloud
- ✅ Cross-device sync
- ✅ Automatic backups

## Testing

1. Go to VC Finder
2. You'll see a "Sign In" prompt
3. Create an account with your email
4. Check your email for confirmation link
5. Sign in and start saving VCs!

## Troubleshooting

**"Invalid API key" error:**
- Double-check you copied the correct anon key
- Make sure there are no extra spaces
- Restart dev server after adding keys

**"Schema already exists" error:**
- That's fine! It means the tables are already created
- You can ignore this

**Email confirmation not arriving:**
- Check spam folder
- In Supabase dashboard: Authentication → Settings → Disable email confirmation (for testing)

## What's Next?

The app will now:
- Save all VCs to your Supabase database
- Sync across all your devices
- Never lose data (even if you clear browser cache)
- Support multiple users (each with their own VC list)

## Step 6: Update Schema (Multi-Contact Support)

If you want to enable multiple partners per VC firm (ShortsBreak+ feature), run this additional SQL:

1. In Supabase SQL Editor
2. Run this query:

```sql
-- Add contacts column to saved_vcs table
ALTER TABLE saved_vcs 
ADD COLUMN IF NOT EXISTS contacts JSONB DEFAULT '[]'::jsonb;

-- Comment on column
COMMENT ON COLUMN saved_vcs.contacts IS 'List of specific partners: [{ name, email, role, linkedin }]';
```
