-- Add contacts column to saved_vcs table
ALTER TABLE saved_vcs 
ADD COLUMN IF NOT EXISTS contacts JSONB DEFAULT '[]'::jsonb;

-- Comment on column
COMMENT ON COLUMN saved_vcs.contacts IS 'List of specific partners: [{ name, email, role, linkedin }]';
