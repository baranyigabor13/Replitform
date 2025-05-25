-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up realtime subscriptions
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;

-- Create users table for form creators/account holders
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create form_data table for storing the form submissions
CREATE TABLE IF NOT EXISTS public.form_data (
  id BIGSERIAL PRIMARY KEY,
  business_type TEXT NOT NULL,
  business_name TEXT NOT NULL,
  value_proposition TEXT NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES public.users(id)
);

-- Create generated_ads table for storing AI-generated ads
CREATE TABLE IF NOT EXISTS public.generated_ads (
  id BIGSERIAL PRIMARY KEY,
  form_data_id BIGINT REFERENCES public.form_data(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  content TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('professional', 'casual', 'urgent')),
  length TEXT NOT NULL CHECK (length IN ('short', 'medium', 'long')),
  tags TEXT[] NOT NULL,
  emoji_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false
);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_ads ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own data
CREATE POLICY "Users can manage their own data" ON public.users
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow inserting form data without authentication for demo purposes
CREATE POLICY "Anyone can insert form data" ON public.form_data
  FOR INSERT WITH CHECK (true);

-- Allow reading form data without authentication for demo purposes  
CREATE POLICY "Anyone can read form data" ON public.form_data
  FOR SELECT USING (true);

-- Allow inserting generated ads without authentication for demo purposes
CREATE POLICY "Anyone can insert generated ads" ON public.generated_ads
  FOR INSERT WITH CHECK (true);

-- Allow reading generated ads without authentication for demo purposes
CREATE POLICY "Anyone can read generated ads" ON public.generated_ads
  FOR SELECT USING (true);

-- Add these tables to realtime subscription
ALTER PUBLICATION supabase_realtime ADD TABLE public.form_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.generated_ads;

-- Create index on form_data for faster queries
CREATE INDEX IF NOT EXISTS form_data_business_type_idx ON public.form_data (business_type);
CREATE INDEX IF NOT EXISTS form_data_business_name_idx ON public.form_data (business_name);
CREATE INDEX IF NOT EXISTS form_data_created_at_idx ON public.form_data (created_at DESC);

-- Create index on generated_ads for faster queries
CREATE INDEX IF NOT EXISTS generated_ads_form_data_id_idx ON public.generated_ads (form_data_id);
CREATE INDEX IF NOT EXISTS generated_ads_tone_idx ON public.generated_ads (tone);
CREATE INDEX IF NOT EXISTS generated_ads_is_favorite_idx ON public.generated_ads (is_favorite) WHERE is_favorite = true;