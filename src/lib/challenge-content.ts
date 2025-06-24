/**
 * Enhanced challenge content database and management utilities
 * Sprint 6: Expanded content for PatternPlay, PerceptionFlip, and SocialDecoder
 */

import { challengeApi } from './api';
import { MEME_DATABASE } from '../data/meme-database';
import { ETHICS_SCENARIOS } from '../data/ethics-scenarios';
import { PATTERN_SEQUENCES } from '../data/pattern-sequences';
import { PERCEPTION_ILLUSIONS } from '../data/perception-illusions';
import { SOCIAL_MESSAGES } from '../data/social-messages';
import type { 
  MemeData, 
  EthicsScenario, 
  PatternSequence, 
  PerceptionIllusion, 
  SocialMessage 
} from '../types/challenge-content';

/**
 * Generate enhanced pattern recognition challenge
 */
export const generatePatternPlayChallenge = (difficulty: 'easy' | 'medium' | 'hard') => {
  const patternsForDifficulty = PATTERN_SEQUENCES.filter(p => p.difficulty === difficulty);
  
  if (patternsForDifficulty.length === 0) {
    const easyPatterns = PATTERN_SEQUENCES.filter(p => p.difficulty === 'easy');
    const randomPattern = easyPatterns[Math.floor(Math.random() * easyPatterns.length)];
    return createPatternChallenge(randomPattern);
  }
  
  const randomPattern = patternsForDifficulty[Math.floor(Math.random() * patternsForDifficulty.length)];
  return createPatternChallenge(randomPattern);
};

/**
 * Create pattern challenge with multiple choice options
 */
const createPatternChallenge = (pattern: PatternSequence) => {
  const correctAnswer = pattern.correctNext;
  
  // Generate plausible wrong options
  const wrongOptions = [];
  
  // Add common mistake patterns
  if (pattern.category === 'arithmetic') {
    const diff = pattern.sequence[1] - pattern.sequence[0];
    wrongOptions.push(correctAnswer + diff); // Double increment
    wrongOptions.push(correctAnswer - diff); // Wrong direction
    wrongOptions.push(pattern.sequence[pattern.sequence.length - 1] + 1); // Simple +1
  } else if (pattern.category === 'geometric') {
    const ratio = pattern.sequence[1] / pattern.sequence[0];
    wrongOptions.push(Math.floor(correctAnswer / ratio)); // Wrong direction
    wrongOptions.push(correctAnswer + pattern.sequence[pattern.sequence.length - 1]); // Addition instead
    wrongOptions.push(correctAnswer * 2); // Double multiplication
  } else {
    // Generic wrong options
    wrongOptions.push(correctAnswer + 1);
    wrongOptions.push(correctAnswer - 1);
    wrongOptions.push(correctAnswer * 2);
    wrongOptions.push(Math.floor(correctAnswer / 2));
  }
  
  // Filter valid options and ensure we have exactly 3 wrong options
  const validWrongOptions = wrongOptions
    .filter(opt => opt > 0 && opt !== correctAnswer && opt < 1000)
    .slice(0, 3);
  
  // If we don't have enough wrong options, generate more
  while (validWrongOptions.length < 3) {
    const randomOffset = Math.floor(Math.random() * 10) + 1;
    const newOption = correctAnswer + (Math.random() > 0.5 ? randomOffset : -randomOffset);
    if (newOption > 0 && newOption !== correctAnswer && !validWrongOptions.includes(newOption)) {
      validWrongOptions.push(newOption);
    }
  }
  
  // Create shuffled options array
  const options = [correctAnswer, ...validWrongOptions.slice(0, 3)]
    .sort(() => Math.random() - 0.5);
  
  return {
    type: 'PatternPlay',
    title: 'Pattern Recognition Challenge',
    description: 'Identify the pattern and select the next number in the sequence',
    content: {
      sequence: [...pattern.sequence, null], // Show sequence with missing last element
      options: options,
      rule: pattern.rule,
      category: pattern.category
    },
    correct_answer: correctAnswer,
    signal_tags: ['pattern-recognition', 'logic', 'sequence', pattern.category],
    input_mode: 'multiple-choice',
    difficulty: pattern.difficulty
  };
};

/**
 * Generate perception flip challenge
 */
export const generatePerceptionFlipChallenge = (difficulty: 'easy' | 'medium' | 'hard') => {
  const illusionsForDifficulty = PERCEPTION_ILLUSIONS.filter(p => {
    // Map illusion complexity to difficulty
    if (difficulty === 'easy') return ['ambiguous', 'color'].includes(p.type);
    if (difficulty === 'medium') return ['perspective', 'motion'].includes(p.type);
    return true; // hard includes all types
  });
  
  if (illusionsForDifficulty.length === 0) {
    const randomIllusion = PERCEPTION_ILLUSIONS[Math.floor(Math.random() * PERCEPTION_ILLUSIONS.length)];
    return createPerceptionChallenge(randomIllusion, difficulty);
  }
  
  const randomIllusion = illusionsForDifficulty[Math.floor(Math.random() * illusionsForDifficulty.length)];
  return createPerceptionChallenge(randomIllusion, difficulty);
};

/**
 * Create perception flip challenge
 */
const createPerceptionChallenge = (illusion: PerceptionIllusion, difficulty: 'easy' | 'medium' | 'hard') => {
  // Generate wrong options based on illusion type
  const wrongOptions = [];
  
  if (illusion.type === 'ambiguous') {
    wrongOptions.push('Triangle', 'Square', 'Circle', 'Line');
  } else if (illusion.type === 'color') {
    wrongOptions.push('Different colors', 'One is darker', 'Different shades');
  } else if (illusion.type === 'perspective') {
    wrongOptions.push('Possible triangle', 'Regular triangle', 'Simple shape');
  } else {
    wrongOptions.push('Static image', 'Normal pattern', 'Regular design');
  }
  
  // Combine correct and wrong answers
  const allOptions = [...illusion.acceptableAnswers.slice(0, 1), ...wrongOptions.slice(0, 3)]
    .sort(() => Math.random() - 0.5);
  
  return {
    type: 'PerceptionFlip',
    title: 'Visual Perception Challenge',
    description: illusion.description,
    content: {
      illusionType: illusion.type,
      options: allOptions,
      hint: illusion.hint,
      ...illusion.illusionData
    },
    correct_answer: {
      acceptableAnswers: illusion.acceptableAnswers
    },
    signal_tags: ['perception', 'visual', 'illusion', illusion.type],
    input_mode: 'multiple-choice',
    difficulty
  };
};

/**
 * Generate social decoder challenge
 */
export const generateSocialDecoderChallenge = (difficulty: 'easy' | 'medium' | 'hard') => {
  const messagesForDifficulty = SOCIAL_MESSAGES.filter(m => m.difficulty === difficulty);
  
  if (messagesForDifficulty.length === 0) {
    const randomMessage = SOCIAL_MESSAGES[Math.floor(Math.random() * SOCIAL_MESSAGES.length)];
    return createSocialDecoderChallenge(randomMessage);
  }
  
  const randomMessage = messagesForDifficulty[Math.floor(Math.random() * messagesForDifficulty.length)];
  return createSocialDecoderChallenge(randomMessage);
};

/**
 * Create social decoder challenge
 */
const createSocialDecoderChallenge = (socialMessage: SocialMessage) => {
  return {
    type: 'SocialDecoder',
    title: 'Social Context Decoder',
    description: 'Analyze the tone, context, and cultural nuances in this social media message',
    content: {
      message: socialMessage.message,
      author: socialMessage.author,
      platform: socialMessage.platform,
      timestamp: socialMessage.timestamp,
      context: socialMessage.context,
      emojis: socialMessage.emojis,
      interpretations: socialMessage.interpretations
    },
    correct_answer: {
      acceptableAnswers: [socialMessage.correctInterpretation]
    },
    signal_tags: ['social-decoding', 'cultural-context', 'tone-analysis', socialMessage.culturalContext],
    input_mode: 'multiple-choice',
    difficulty: socialMessage.difficulty
  };
};

/**
 * Enhanced challenge content generation functions
 */
export const generateMemeTimeWarpChallenge = (difficulty: 'easy' | 'medium' | 'hard') => {
  let memeCount: number;
  let timeRange: { start: number; end: number };
  
  switch (difficulty) {
    case 'easy':
      memeCount = 3;
      timeRange = { start: 2015, end: 2022 }; // Recent memes
      break;
    case 'medium':
      memeCount = 4;
      timeRange = { start: 2010, end: 2022 }; // Last decade
      break;
    case 'hard':
      memeCount = 5;
      timeRange = { start: 1996, end: 2022 }; // Full internet history
      break;
  }
  
  // Filter memes by time range
  const availableMemes = MEME_DATABASE.filter(
    meme => meme.year >= timeRange.start && meme.year <= timeRange.end
  );
  
  // Randomly select memes
  const selectedMemes = [];
  const indices = new Set<number>();
  
  while (indices.size < memeCount && indices.size < availableMemes.length) {
    indices.add(Math.floor(Math.random() * availableMemes.length));
  }
  
  for (const index of indices) {
    selectedMemes.push(availableMemes[index]);
  }
  
  // Sort by year for correct answer
  const correctOrder = selectedMemes
    .sort((a, b) => a.year - b.year)
    .map(meme => meme.id);
  
  return {
    type: 'MemeTimeWarp',
    title: 'Internet Meme Chronology',
    description: 'Arrange these memes in chronological order from oldest to newest',
    content: {
      memes: selectedMemes.sort(() => 0.5 - Math.random()) // Shuffle for display
    },
    correct_answer: correctOrder,
    signal_tags: ['chronology', 'internet-culture', 'timeline', 'memes'],
    input_mode: 'drag-and-drop',
    difficulty
  };
};

/**
 * Generate enhanced ethics challenge
 */
export const generateEthicsPingChallenge = (difficulty: 'easy' | 'medium' | 'hard') => {
  const scenariosForDifficulty = ETHICS_SCENARIOS.filter(s => s.difficulty === difficulty);
  
  if (scenariosForDifficulty.length === 0) {
    // Fallback to any difficulty
    const randomScenario = ETHICS_SCENARIOS[Math.floor(Math.random() * ETHICS_SCENARIOS.length)];
    return createEthicsChallenge(randomScenario);
  }
  
  const randomScenario = scenariosForDifficulty[Math.floor(Math.random() * scenariosForDifficulty.length)];
  return createEthicsChallenge(randomScenario);
};

/**
 * Create enhanced ethics challenge from scenario
 */
const createEthicsChallenge = (scenario: EthicsScenario) => {
  return {
    type: 'EthicsPing',
    title: 'Ethical Decision Making',
    description: 'Consider this ethical dilemma and choose what you think is the most appropriate response',
    content: {
      scenario: scenario.scenario,
      choices: scenario.choices,
      category: scenario.category,
      ethicalFrameworks: scenario.ethicalFrameworks,
      realWorldContext: scenario.realWorldContext
    },
    correct_answer: {
      acceptableChoices: scenario.choices.map(c => c.id), // All choices are valid in ethics
      preferredChoice: scenario.choices[0].id // First choice as default preferred
    },
    signal_tags: ['ethics', 'moral-reasoning', scenario.category, ...scenario.ethicalFrameworks],
    input_mode: 'multiple-choice',
    difficulty: scenario.difficulty
  };
};

/**
 * Batch create challenges in database
 */
export const seedChallengeDatabase = async () => {
  try {
    const challenges = [];
    
    // Create PatternPlay challenges for each difficulty
    ['easy', 'medium', 'hard'].forEach(difficulty => {
      for (let i = 0; i < 3; i++) {
        challenges.push(generatePatternPlayChallenge(difficulty as 'easy' | 'medium' | 'hard'));
      }
    });
    
    // Create PerceptionFlip challenges for each difficulty
    ['easy', 'medium', 'hard'].forEach(difficulty => {
      for (let i = 0; i < 2; i++) {
        challenges.push(generatePerceptionFlipChallenge(difficulty as 'easy' | 'medium' | 'hard'));
      }
    });
    
    // Create SocialDecoder challenges for each difficulty
    ['easy', 'medium', 'hard'].forEach(difficulty => {
      for (let i = 0; i < 2; i++) {
        challenges.push(generateSocialDecoderChallenge(difficulty as 'easy' | 'medium' | 'hard'));
      }
    });
    
    // Insert challenges into database
    for (const challenge of challenges) {
      await challengeApi.create({
        ...challenge,
        is_active: true
      });
    }
    
    console.log(`Successfully seeded ${challenges.length} challenges to database`);
  } catch (error) {
    console.error('Error seeding challenge database:', error);
  }
};

/**
 * Challenge difficulty assessment tools
 */
export const assessChallengeDifficulty = (responses: any[]): {
  suggestedDifficulty: 'easy' | 'medium' | 'hard';
  confidence: number;
  reasoning: string;
} => {
  if (responses.length < 10) {
    return {
      suggestedDifficulty: 'medium',
      confidence: 0.3,
      reasoning: 'Insufficient data for accurate assessment'
    };
  }
  
  const successRate = responses.filter(r => r.is_human).length / responses.length;
  const avgResponseTime = responses.reduce((sum, r) => sum + r.response_time_ms, 0) / responses.length;
  
  let suggestedDifficulty: 'easy' | 'medium' | 'hard';
  let confidence: number;
  let reasoning: string;
  
  if (successRate > 0.8 && avgResponseTime < 8000) {
    suggestedDifficulty = 'easy';
    confidence = 0.9;
    reasoning = 'High success rate and fast completion times indicate this challenge is too easy';
  } else if (successRate < 0.4 || avgResponseTime > 20000) {
    suggestedDifficulty = 'hard';
    confidence = 0.85;
    reasoning = 'Low success rate or slow completion times indicate this challenge is very difficult';
  } else {
    suggestedDifficulty = 'medium';
    confidence = 0.7;
    reasoning = 'Balanced performance metrics suggest appropriate medium difficulty';
  }
  
  return { suggestedDifficulty, confidence, reasoning };
};