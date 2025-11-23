-- Create saved_vcs table
CREATE TABLE IF NOT EXISTS saved_vcs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vc_name TEXT NOT NULL,
  firm_type TEXT NOT NULL,
  check_size TEXT,
  thesis TEXT,
  notable_portfolio TEXT[], -- Array of company names
  match_reason TEXT,
  email TEXT,
  website TEXT,
  linkedin TEXT,
  detailed_info TEXT, -- Cached detailed VC info
  status TEXT DEFAULT 'to_contact', -- to_contact, contacted, in_discussion, passed, invested
  notes TEXT,
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vc_name) -- Prevent duplicate VCs per user
);

-- Create generated_emails table
CREATE TABLE IF NOT EXISTS generated_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vc_id UUID REFERENCES saved_vcs(id) ON DELETE CASCADE,
  email_content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_vcs_user_id ON saved_vcs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_vcs_status ON saved_vcs(status);
CREATE INDEX IF NOT EXISTS idx_generated_emails_user_id ON generated_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_emails_vc_id ON generated_emails(vc_id);

-- Enable Row Level Security
ALTER TABLE saved_vcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_emails ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_vcs
CREATE POLICY "Users can view their own VCs"
  ON saved_vcs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own VCs"
  ON saved_vcs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own VCs"
  ON saved_vcs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own VCs"
  ON saved_vcs FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for generated_emails
CREATE POLICY "Users can view their own emails"
  ON generated_emails FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emails"
  ON generated_emails FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_saved_vcs_updated_at
  BEFORE UPDATE ON saved_vcs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
