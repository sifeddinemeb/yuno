/*
  # Add Sample Challenge Content for Sprint 4

  1. Challenge Content Addition
    - Add MemeTimeWarp challenge samples
    - Add EthicsPing challenge samples
    - Update existing challenges with proper difficulty levels
    - Add performance tracking sample data

  2. Data Integrity
    - Ensure all challenges have proper content structure
    - Add signal tags for better categorization
    - Set appropriate difficulty levels
*/

-- Add MemeTimeWarp challenges
INSERT INTO challenges (type, title, description, content, correct_answer, signal_tags, input_mode, difficulty, is_active) VALUES
(
  'MemeTimeWarp',
  'Early Internet Memes Timeline',
  'Arrange these classic internet memes in chronological order from oldest to newest',
  '{
    "memes": [
      {"id": "dancing_baby", "name": "Dancing Baby", "year": 1996},
      {"id": "hampster_dance", "name": "Hampster Dance", "year": 1998},
      {"id": "all_your_base", "name": "All Your Base", "year": 2001}
    ]
  }',
  '["dancing_baby", "hampster_dance", "all_your_base"]',
  ARRAY['chronology', 'internet-culture', 'memes', 'timeline'],
  'drag-and-drop',
  'easy',
  true
),
(
  'MemeTimeWarp',
  'Social Media Era Memes',
  'Order these viral memes from the social media explosion era',
  '{
    "memes": [
      {"id": "rickroll", "name": "Rickroll", "year": 2007},
      {"id": "keyboard_cat", "name": "Keyboard Cat", "year": 2009},
      {"id": "nyan_cat", "name": "Nyan Cat", "year": 2011},
      {"id": "gangnam_style", "name": "Gangnam Style", "year": 2012}
    ]
  }',
  '["rickroll", "keyboard_cat", "nyan_cat", "gangnam_style"]',
  ARRAY['chronology', 'social-media', 'viral-content'],
  'drag-and-drop',
  'medium',
  true
),
(
  'MemeTimeWarp',
  'Modern Meme Evolution',
  'Trace the evolution of modern internet culture through these memes',
  '{
    "memes": [
      {"id": "drake_pointing", "name": "Drake Pointing", "year": 2015},
      {"id": "distracted_boyfriend", "name": "Distracted Boyfriend", "year": 2017},
      {"id": "this_is_fine", "name": "This is Fine", "year": 2018},
      {"id": "woman_yelling_cat", "name": "Woman Yelling at Cat", "year": 2019},
      {"id": "bernie_mittens", "name": "Bernie Sanders Mittens", "year": 2021}
    ]
  }',
  '["drake_pointing", "distracted_boyfriend", "this_is_fine", "woman_yelling_cat", "bernie_mittens"]',
  ARRAY['chronology', 'modern-culture', 'meme-templates'],
  'drag-and-drop',
  'hard',
  true
);

-- Add EthicsPing challenges
INSERT INTO challenges (type, title, description, content, correct_answer, signal_tags, input_mode, difficulty, is_active) VALUES
(
  'EthicsPing',
  'Privacy vs Security Dilemma',
  'Consider this ethical scenario about balancing privacy rights with security needs',
  '{
    "scenario": "A tech company can prevent a terrorist attack by scanning all user messages, but this would violate privacy promises made to millions of users.",
    "choices": [
      {
        "id": "scan_messages",
        "title": "Scan the messages",
        "description": "Prevent the attack by violating privacy temporarily",
        "feedback": "Prioritizing immediate safety over privacy rights."
      },
      {
        "id": "respect_privacy", 
        "title": "Respect privacy",
        "description": "Honor the privacy commitment regardless of consequences",
        "feedback": "Upholding rights and promises even when difficult."
      },
      {
        "id": "seek_warrant",
        "title": "Seek legal authorization", 
        "description": "Work through legal channels even if it takes time",
        "feedback": "Balancing security needs with legal and ethical processes."
      }
    ],
    "category": "privacy"
  }',
  '{
    "acceptableChoices": ["scan_messages", "respect_privacy", "seek_warrant"],
    "preferredChoice": "seek_warrant"
  }',
  ARRAY['ethics', 'privacy', 'security', 'rights'],
  'multiple-choice',
  'medium',
  true
),
(
  'EthicsPing',
  'AI Hiring Fairness',
  'Navigate the complex ethics of AI bias in hiring decisions',
  '{
    "scenario": "Your AI hiring system is more accurate than humans but shows bias against certain demographic groups. It helps qualified candidates overall but disadvantages some groups.",
    "choices": [
      {
        "id": "keep_system",
        "title": "Keep the AI system",
        "description": "Focus on overall accuracy and meritocracy",
        "feedback": "Prioritizing efficiency but potentially perpetuating systemic bias."
      },
      {
        "id": "remove_system",
        "title": "Remove the system", 
        "description": "Return to human hiring to avoid algorithmic bias",
        "feedback": "Avoiding algorithmic bias but potentially accepting human bias."
      },
      {
        "id": "adjust_algorithm",
        "title": "Adjust for fairness",
        "description": "Modify the AI to be more equitable across groups", 
        "feedback": "Balancing accuracy with fairness considerations."
      }
    ],
    "category": "fairness"
  }',
  '{
    "acceptableChoices": ["remove_system", "adjust_algorithm"],
    "preferredChoice": "adjust_algorithm"
  }',
  ARRAY['ethics', 'ai-bias', 'fairness', 'employment'],
  'multiple-choice',
  'medium',
  true
),
(
  'EthicsPing',
  'Medical Resource Allocation',
  'A challenging medical ethics scenario about resource allocation during a crisis',
  '{
    "scenario": "During a pandemic, there is only one ventilator left. Two patients need it equally: a 30-year-old with a good prognosis and a 70-year-old with a fair prognosis.",
    "choices": [
      {
        "id": "younger_patient",
        "title": "Give to younger patient",
        "description": "Prioritize based on life years saved",
        "feedback": "Maximizing total life years - a common medical ethics approach."
      },
      {
        "id": "first_come",
        "title": "First come, first served",
        "description": "Give to whoever arrived first",
        "feedback": "Equal treatment regardless of outcomes - procedural fairness."
      },
      {
        "id": "lottery_system",
        "title": "Random lottery",
        "description": "Use chance to decide fairly",
        "feedback": "Equal dignity and worth of all lives - avoiding discrimination."
      }
    ],
    "category": "welfare"
  }',
  '{
    "acceptableChoices": ["younger_patient", "first_come", "lottery_system"],
    "preferredChoice": "younger_patient"
  }',
  ARRAY['ethics', 'medical', 'resource-allocation', 'welfare'],
  'multiple-choice',
  'hard',
  true
);

-- Update existing SentimentSpectrum challenges with better signal tags
UPDATE challenges 
SET signal_tags = ARRAY['sarcasm', 'workplace-culture', 'tone-analysis']
WHERE type = 'SentimentSpectrum' AND title = 'Workplace Sarcasm Detection';

UPDATE challenges 
SET signal_tags = ARRAY['sarcasm', 'social-media', 'tone-analysis'] 
WHERE type = 'SentimentSpectrum' AND title = 'Social Media Tone Analysis';