/*
  # Sprint 8: User Experience Optimization

  1. UI/UX Improvements
    - Add accessibility metadata and settings
    - Add user feedback collection table
    - Add error logging table for system monitoring
    - Update RLS policies for new tables
  
  2. Enhanced User Experience
    - Store user preferences and customization
    - Track interface issues for continuous improvement
    - Enable feedback collection and analysis
*/

-- Create user feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID,
  feedback_type VARCHAR(20) CHECK (feedback_type IN ('positive', 'negative', 'suggestion', 'bug')),
  comment TEXT,
  page_url TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create error logging table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID,
  error_type VARCHAR(100),
  error_message TEXT,
  stack_trace TEXT,
  component TEXT,
  page_url TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create accessibility preferences table
CREATE TABLE IF NOT EXISTS accessibility_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  high_contrast BOOLEAN DEFAULT false,
  reduce_motion BOOLEAN DEFAULT false,
  large_text BOOLEAN DEFAULT false,
  keyboard_mode BOOLEAN DEFAULT false,
  screen_reader_optimized BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add theme preferences to admin_users table
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS theme_preference VARCHAR(20) DEFAULT 'auto';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS interface_density VARCHAR(20) DEFAULT 'default';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "browser": true, "mobile": false}';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_accessibility_preferences_user_id ON accessibility_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to submit feedback
CREATE POLICY "Anyone can submit feedback"
  ON user_feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view all feedback
CREATE POLICY "Admin users can view all feedback"
  ON user_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can view error logs
CREATE POLICY "Admin users can view error logs"
  ON error_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow anyone to log errors
CREATE POLICY "Anyone can log errors"
  ON error_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can manage their own accessibility preferences
CREATE POLICY "Users can manage their own accessibility preferences"
  ON accessibility_preferences FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create view for feedback analysis
CREATE OR REPLACE VIEW feedback_analysis_view AS
SELECT
  date_trunc('day', created_at) as day,
  feedback_type,
  COUNT(*) as count,
  array_agg(comment) as comments
FROM user_feedback
GROUP BY day, feedback_type
ORDER BY day DESC, feedback_type;