/*
  # Initial Database Schema for Yuno

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `role` (text, default 'admin')
      - `preferences` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `challenges`
      - `id` (uuid, primary key)
      - `type` (text)
      - `title` (text)
      - `description` (text)
      - `content` (jsonb)
      - `correct_answer` (jsonb)
      - `signal_tags` (text array)
      - `input_mode` (text)
      - `difficulty` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_responses`
      - `id` (uuid, primary key)
      - `session_id` (uuid)
      - `challenge_id` (uuid, references challenges)
      - `answer` (jsonb)
      - `response_time_ms` (integer)
      - `challenge_type` (text)
      - `input_mode` (text)
      - `signal_tags` (text array)
      - `is_human` (boolean)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `created_at` (timestamp)
    
    - `api_keys`
      - `id` (uuid, primary key)
      - `client_name` (text)
      - `api_key` (text, unique)
      - `status` (text)
      - `permissions` (jsonb)
      - `usage_metrics` (jsonb)
      - `created_at` (timestamp)
      - `last_used_at` (timestamp)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admins
    - Create analytics views for performance metrics
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  correct_answer JSONB NOT NULL,
  signal_tags TEXT[] DEFAULT '{}',
  input_mode VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_responses table
CREATE TABLE IF NOT EXISTS user_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL,
  answer JSONB NOT NULL,
  response_time_ms INTEGER NOT NULL,
  challenge_type VARCHAR(50) NOT NULL,
  input_mode VARCHAR(50) NOT NULL,
  signal_tags TEXT[] DEFAULT '{}',
  is_human BOOLEAN,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'revoked')) DEFAULT 'active',
  permissions JSONB DEFAULT '{"read": true, "write": true}',
  usage_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_responses_session_id ON user_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_challenge_id ON user_responses(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_created_at ON user_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_user_responses_is_human ON user_responses(is_human);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);
CREATE INDEX IF NOT EXISTS idx_challenges_is_active ON challenges(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view their own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin users can update their own data"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for challenges
CREATE POLICY "Challenges are viewable by authenticated users"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Challenges are manageable by admins"
  ON challenges FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for user_responses
CREATE POLICY "User responses are viewable by admins"
  ON user_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "User responses are insertable by anyone"
  ON user_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for api_keys
CREATE POLICY "API keys are manageable by admins"
  ON api_keys FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create analytics views
CREATE OR REPLACE VIEW challenge_performance_view AS
SELECT 
  c.id,
  c.type,
  c.title,
  c.difficulty,
  COUNT(ur.id) as total_attempts,
  COUNT(CASE WHEN ur.is_human = true THEN 1 END) as human_attempts,
  COUNT(CASE WHEN ur.is_human = false THEN 1 END) as bot_attempts,
  ROUND(AVG(ur.response_time_ms), 2) as avg_response_time,
  ROUND(
    COUNT(CASE WHEN ur.is_human = true THEN 1 END)::DECIMAL / 
    NULLIF(COUNT(ur.id), 0) * 100, 2
  ) as human_pass_rate
FROM challenges c
LEFT JOIN user_responses ur ON c.id = ur.challenge_id
WHERE c.is_active = true
GROUP BY c.id, c.type, c.title, c.difficulty;

CREATE OR REPLACE VIEW daily_metrics_view AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN is_human = true THEN 1 END) as human_verifications,
  COUNT(CASE WHEN is_human = false THEN 1 END) as bot_detections,
  ROUND(AVG(response_time_ms), 2) as avg_response_time,
  ROUND(
    COUNT(CASE WHEN is_human = true THEN 1 END)::DECIMAL / 
    NULLIF(COUNT(*), 0) * 100, 2
  ) as human_pass_rate
FROM user_responses
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Insert some sample challenges for testing
INSERT INTO challenges (type, title, description, content, correct_answer, signal_tags, input_mode, difficulty, is_active) VALUES
(
  'SentimentSpectrum',
  'Workplace Sarcasm Detection',
  'Identify the tone and sentiment in workplace communication',
  '{"message": "Oh great, another meeting that could have been an email 📧", "options": ["Genuinely excited", "Sarcastic/frustrated", "Neutral", "Confused"]}',
  '"Sarcastic/frustrated"',
  ARRAY['sarcasm', 'workplace-culture'],
  'multiple-choice',
  'medium',
  true
),
(
  'SentimentSpectrum',
  'Social Media Tone Analysis',
  'Determine the emotional tone of social media posts',
  '{"message": "Just perfect timing for the wifi to go down right before my presentation! 🙃", "options": ["Happy", "Frustrated/sarcastic", "Neutral", "Excited"]}',
  '"Frustrated/sarcastic"',
  ARRAY['sarcasm', 'social-media'],
  'multiple-choice',
  'easy',
  true
),
(
  'MemeTimeWarp',
  'Internet Meme Chronology',
  'Arrange viral memes in chronological order of their popularity',
  '{"memes": [{"id": "distracted_boyfriend", "name": "Distracted Boyfriend", "year": 2017}, {"id": "woman_yelling_cat", "name": "Woman Yelling at Cat", "year": 2019}, {"id": "drake_pointing", "name": "Drake Pointing", "year": 2015}]}',
  '["drake_pointing", "distracted_boyfriend", "woman_yelling_cat"]',
  ARRAY['chronology', 'internet-culture'],
  'drag-and-drop',
  'hard',
  false
);