-- Create comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
  id uuid primary key default gen_random_uuid(),
  x float8 not null,
  y float8 not null,
  "normalizedX" float8 not null,
  "normalizedY" float8 not null,
  text text not null,
  "authorName" text not null,
  "userId" text not null,
  "pagePath" text not null,
  timestamp timestamptz not null default now(),
  replies jsonb not null default '[]'::jsonb,
  status text not null default 'open'
);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running)
DROP POLICY IF EXISTS "Anyone can read comments" ON comments;
DROP POLICY IF EXISTS "Anyone can create comments" ON comments;
DROP POLICY IF EXISTS "Anyone can update comments" ON comments;
DROP POLICY IF EXISTS "Anyone can delete comments" ON comments;

-- Create policies to allow public access (adjust as needed for production)
CREATE POLICY "Anyone can read comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update comments" ON comments
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete comments" ON comments
  FOR DELETE USING (true);
