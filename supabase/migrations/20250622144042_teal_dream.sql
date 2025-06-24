/*
  # AI Content Generation System - Sprint 7

  1. New Features
    - Enhanced challenges table with AI generation metadata
    - Content review tracking system for AI-generated challenges
    - Quality metrics tracking for AI-generated content
    - New views for content quality analytics

  2. Schema Changes
    - Add generation_metadata to challenges table
    - Add quality_score to challenges table
    - Create content_reviews table for review workflow
    - Create ai_content_metrics view for quality analytics
*/

-- Add AI generation metadata to challenges table
ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS generation_metadata JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS quality_score NUMERIC DEFAULT NULL;

-- Create content reviews table for tracking review workflow
CREATE TABLE IF NOT EXISTS content_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_status VARCHAR(20) CHECK (review_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  review_notes TEXT,
  quality_feedback JSONB DEFAULT '{}',
  suggested_improvements TEXT[] DEFAULT '{}',
  review_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_reviews_challenge_id ON content_reviews(challenge_id);
CREATE INDEX IF NOT EXISTS idx_content_reviews_reviewer_id ON content_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_content_reviews_status ON content_reviews(review_status);
CREATE INDEX IF NOT EXISTS idx_challenges_quality_score ON challenges(quality_score);

-- Enable RLS on content reviews table
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_reviews
CREATE POLICY "Content reviews are viewable by authenticated users"
  ON content_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Content reviews are manageable by admins"
  ON content_reviews FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create view for AI content metrics analytics
CREATE OR REPLACE VIEW ai_content_metrics AS
SELECT
  c.type,
  c.difficulty,
  ROUND(AVG(c.quality_score), 2) as avg_quality_score,
  COUNT(c.id) as total_generated,
  COUNT(CASE WHEN cr.review_status = 'approved' THEN 1 END) as approved_count,
  COUNT(CASE WHEN cr.review_status = 'rejected' THEN 1 END) as rejected_count,
  ROUND(
    COUNT(CASE WHEN cr.review_status = 'approved' THEN 1 END)::DECIMAL / 
    NULLIF(COUNT(CASE WHEN cr.review_status IN ('approved', 'rejected') THEN 1 END), 0) * 100
  , 1) as approval_rate,
  ROUND(AVG(EXTRACT(EPOCH FROM (cr.review_date - c.created_at)) / 60), 1) as avg_review_time_minutes
FROM challenges c
LEFT JOIN content_reviews cr ON c.id = cr.challenge_id
WHERE c.generation_metadata IS NOT NULL
GROUP BY c.type, c.difficulty;

-- Add permissions column to content_reviews
ALTER TABLE content_reviews
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"can_edit": true, "can_delete": true}';

-- Add a trigger to update challenges last_modified when reviews change
CREATE OR REPLACE FUNCTION update_challenge_on_review()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE challenges
  SET updated_at = NOW()
  WHERE id = NEW.challenge_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_review_update_challenge
AFTER INSERT OR UPDATE ON content_reviews
FOR EACH ROW
EXECUTE FUNCTION update_challenge_on_review();

-- Update any existing challenges to have a default quality score
UPDATE challenges
SET quality_score = 80
WHERE quality_score IS NULL AND is_active = true;