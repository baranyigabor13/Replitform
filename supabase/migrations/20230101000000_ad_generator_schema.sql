-- Create schema for ad generator application

-- Form data table
CREATE TABLE IF NOT EXISTS form_data (
  id SERIAL PRIMARY KEY,
  business_type TEXT NOT NULL,
  business_name TEXT NOT NULL,
  value_proposition TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Generated ads table
CREATE TABLE IF NOT EXISTS generated_ads (
  id SERIAL PRIMARY KEY,
  form_data_id INTEGER REFERENCES form_data(id),
  headline TEXT NOT NULL,
  content TEXT NOT NULL,
  tone TEXT NOT NULL,
  length TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  emoji_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Favorite ads table
CREATE TABLE IF NOT EXISTS favorite_ads (
  id SERIAL PRIMARY KEY,
  headline TEXT NOT NULL,
  content TEXT NOT NULL,
  tone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create RLS policies to secure the data
ALTER TABLE form_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_ads ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access during development
-- In production, you would restrict this to authenticated users
CREATE POLICY "Allow anonymous select on form_data" 
ON form_data FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert on form_data" 
ON form_data FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update on form_data" 
ON form_data FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous select on generated_ads" 
ON generated_ads FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert on generated_ads" 
ON generated_ads FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select on favorite_ads" 
ON favorite_ads FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert on favorite_ads" 
ON favorite_ads FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS form_data_business_name_idx ON form_data(business_name);
CREATE INDEX IF NOT EXISTS generated_ads_form_data_id_idx ON generated_ads(form_data_id);