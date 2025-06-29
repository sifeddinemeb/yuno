/**
 * Challenge validation and scoring utilities with enhanced algorithms
 * Sprint 6: Added validation for PatternPlay, PerceptionFlip, and SocialDecoder
 */

import { Challenge } from '../types';
import type { ValidationResult, ChallengeMetrics, DifficultyAssessment, ABTestVariant } from '../types/validation';

/**
 * Validates a user's answer against the correct answer with enhanced scoring
 */
export const validateAnswer = (challenge: Challenge, userAnswer: any): ValidationResult => {
  switch (challenge.type) {
    case 'SentimentSpectrum':
      return validateSentimentSpectrum(challenge, userAnswer);
    case 'MemeTimeWarp':
      return validateMemeTimeWarp(challenge, userAnswer);
    case 'EthicsPing':
      return validateEthicsPing(challenge, userAnswer);
    case 'PatternPlay':
      return validatePatternPlay(challenge, userAnswer);
    case 'PerceptionFlip':
      return validatePerceptionFlip(challenge, userAnswer);
    case 'SocialDecoder':
      return validateSocialDecoder(challenge, userAnswer);
    default:
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Challenge type not yet implemented',
        difficulty: challenge.difficulty
      };
  }
};

/**
 * Enhanced SentimentSpectrum validation with nuance detection
 */
const validateSentimentSpectrum = (challenge: Challenge, userAnswer: string): ValidationResult => {
  const correctAnswer = challenge.correct_answer;
  const isCorrect = userAnswer === correctAnswer;
  
  // Enhanced feedback based on answer choice
  let feedback = '';
  let detailedFeedback = '';
  
  if (isCorrect) {
    feedback = 'Excellent! You correctly identified the sentiment.';
    detailedFeedback = `You successfully detected the ${correctAnswer.toLowerCase()} tone in the message.`;
  } else {
    feedback = `The correct answer was "${correctAnswer}".`;
    detailedFeedback = `This message showed ${correctAnswer.toLowerCase()}. Look for contextual clues like word choice, punctuation, and cultural references.`;
  }
  
  return {
    isCorrect,
    score: isCorrect ? 100 : 0,
    feedback,
    difficulty: challenge.difficulty,
    detailedFeedback
  };
};

/**
 * Enhanced MemeTimeWarp validation with partial credit scoring
 */
const validateMemeTimeWarp = (challenge: Challenge, userAnswer: string[]): ValidationResult => {
  const correctOrder = challenge.correct_answer as string[];
  const memes = challenge.content.memes || [];
  
  if (!Array.isArray(userAnswer) || userAnswer.length !== correctOrder.length) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Please arrange all memes in the timeline.',
      difficulty: challenge.difficulty
    };
  }
  
  // Calculate positional accuracy
  let correctPositions = 0;
  let adjacencyBonus = 0;
  let partialCredit = 0;
  
  userAnswer.forEach((memeId, index) => {
    if (correctOrder[index] === memeId) {
      correctPositions++;
    } else {
      // Check if meme is close to correct position (within 1)
      const correctIndex = correctOrder.indexOf(memeId);
      const distance = Math.abs(correctIndex - index);
      if (distance === 1) {
        adjacencyBonus += 0.5;
      } else if (distance === 2) {
        partialCredit += 0.25;
      }
    }
  });
  
  const totalMemes = correctOrder.length;
  const rawScore = (correctPositions + adjacencyBonus + partialCredit) / totalMemes;
  const score = Math.round(rawScore * 100);
  const isCorrect = correctPositions === totalMemes;
  
  let feedback = '';
  let detailedFeedback = '';
  
  if (isCorrect) {
    feedback = 'Perfect chronological ordering! You have excellent knowledge of internet culture evolution.';
    detailedFeedback = 'You correctly traced how these memes emerged and gained popularity over time.';
  } else if (score >= 70) {
    feedback = `Good effort! You got ${correctPositions}/${totalMemes} memes in exactly the right position.`;
    detailedFeedback = `Consider the broader context of when these memes became popular and their cultural impact.`;
  } else {
    feedback = 'Internet culture evolved in fascinating waves. Each meme reflects its time period.';
    detailedFeedback = 'Think about technological changes, social media platforms, and cultural moments that influenced meme popularity.';
  }
  
  return {
    isCorrect,
    score,
    feedback,
    difficulty: challenge.difficulty,
    partialCredit: rawScore,
    detailedFeedback
  };
};

/**
 * Enhanced EthicsPing validation with reasoning analysis
 */
const validateEthicsPing = (challenge: Challenge, userAnswer: { choice: string; reasoning: string }): ValidationResult => {
  const acceptableChoices = challenge.correct_answer.acceptableChoices || [];
  const isCorrect = acceptableChoices.includes(userAnswer.choice);
  
  // Base score for choice
  let score = isCorrect ? 70 : 40;
  
  // Reasoning quality assessment
  const reasoning = userAnswer.reasoning || '';
  if (reasoning.length > 0) {
    // Length bonus
    if (reasoning.length > 20) score += 10;
    if (reasoning.length > 50) score += 10;
    
    // Content quality indicators
    const qualityIndicators = [
      /consider|think|believe|feel/i,
      /because|since|due to|reason/i,
      /consequence|impact|effect|result/i,
      /right|wrong|ethical|moral/i,
      /people|person|individual|society/i
    ];
    
    const qualityScore = qualityIndicators.reduce((acc, pattern) => {
      return acc + (pattern.test(reasoning) ? 2 : 0);
    }, 0);
    
    score += Math.min(qualityScore, 10);
  }
  
  const choiceData = challenge.content.choices?.find((c: any) => c.id === userAnswer.choice);
  
  let feedback = '';
  let detailedFeedback = '';
  
  if (isCorrect) {
    feedback = `Thoughtful choice! ${choiceData?.feedback || 'This demonstrates sound ethical reasoning.'}`;
    detailedFeedback = reasoning ? 'Your reasoning shows good consideration of the ethical dimensions involved.' : 'Consider adding reasoning to further develop your ethical thinking.';
  } else {
    feedback = `This scenario highlights different ethical perspectives. ${choiceData?.feedback || ''}`;
    detailedFeedback = 'Ethics often involves weighing competing values. Consider multiple stakeholders and potential consequences.';
  }
  
  return {
    isCorrect,
    score: Math.min(score, 100),
    feedback,
    difficulty: challenge.difficulty,
    detailedFeedback
  };
};

/**
 * Enhanced PatternPlay validation with detailed pattern analysis
 */
const validatePatternPlay = (challenge: Challenge, userAnswer: number): ValidationResult => {
  const correctAnswer = challenge.correct_answer as number;
  const isCorrect = userAnswer === correctAnswer;
  
  let feedback = '';
  let detailedFeedback = '';
  
  if (isCorrect) {
    feedback = 'Excellent pattern recognition! You identified the sequence correctly.';
    detailedFeedback = `The pattern "${challenge.content.rule}" was correctly identified. Pattern recognition is a key cognitive skill.`;
  } else {
    feedback = `The correct answer was ${correctAnswer}. The pattern follows: ${challenge.content.rule}`;
    detailedFeedback = 'Look for mathematical progressions, alternating sequences, or positional relationships between elements. Practice recognizing different pattern types to improve.';
  }
  
  // Partial credit for close answers in some pattern types
  let score = isCorrect ? 100 : 0;
  if (!isCorrect && challenge.content.category === 'arithmetic') {
    const sequence = challenge.content.sequence.filter((n: number) => n !== null);
    const diff = sequence[1] - sequence[0];
    const userDiff = Math.abs(userAnswer - correctAnswer);
    
    // Give partial credit if the user was close to the right increment
    if (userDiff === diff) {
      score = 30; // 30% for getting the increment right but wrong base
      feedback += ' You identified the arithmetic pattern but applied it incorrectly.';
    }
  }
  
  return {
    isCorrect,
    score,
    feedback,
    difficulty: challenge.difficulty,
    detailedFeedback
  };
};

/**
 * Enhanced PerceptionFlip validation with multiple acceptable answers
 */
const validatePerceptionFlip = (challenge: Challenge, userAnswer: any): ValidationResult => {
  // Ensure userAnswer is a string
  const userAnswerString = String(userAnswer || '').trim();
  
  // Check if correct_answer is properly formatted
  if (!challenge.correct_answer) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Challenge configuration error: missing correct answer',
      difficulty: challenge.difficulty,
      detailedFeedback: 'This challenge appears to be misconfigured. Please contact support.'
    };
  }
  
  // Handle different formats of correct_answer
  let acceptableAnswers: string[] = [];
  
  if (typeof challenge.correct_answer === 'string') {
    acceptableAnswers = [challenge.correct_answer];
  } else if (Array.isArray(challenge.correct_answer)) {
    acceptableAnswers = challenge.correct_answer.map(answer => String(answer || ''));
  } else if (challenge.correct_answer.acceptableAnswers && Array.isArray(challenge.correct_answer.acceptableAnswers)) {
    acceptableAnswers = challenge.correct_answer.acceptableAnswers.map(answer => String(answer || ''));
  } else {
    // Fallback: convert whatever format to string
    acceptableAnswers = [String(challenge.correct_answer)];
  }
  
  // Filter out empty strings and ensure all are strings
  acceptableAnswers = acceptableAnswers.filter(answer => answer.length > 0);
  
  if (acceptableAnswers.length === 0) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Challenge configuration error: no valid acceptable answers',
      difficulty: challenge.difficulty,
      detailedFeedback: 'This challenge appears to be misconfigured. Please contact support.'
    };
  }
  
  // Perform case-insensitive comparison
  const isCorrect = acceptableAnswers.some(answer => {
    const answerLower = answer.toLowerCase();
    const userAnswerLower = userAnswerString.toLowerCase();
    return answerLower.includes(userAnswerLower) || userAnswerLower.includes(answerLower);
  });
  
  let feedback = '';
  let detailedFeedback = '';
  
  if (isCorrect) {
    feedback = 'Great visual perception! You correctly interpreted the illusion.';
    detailedFeedback = 'Visual perception involves complex processing that can vary between individuals. Your interpretation demonstrates good perceptual awareness.';
  } else {
    feedback = 'Visual illusions can be interpreted differently by different people.';
    detailedFeedback = `These challenges explore how our brains process visual information. The intended answer was one of: ${acceptableAnswers.join(', ')}.`;
  }
  
  return {
    isCorrect,
    score: isCorrect ? 100 : 70, // More lenient scoring for perception-based challenges
    feedback,
    difficulty: challenge.difficulty,
    detailedFeedback
  };
};

/**
 * Enhanced SocialDecoder validation with cultural context analysis
 */
const validateSocialDecoder = (challenge: Challenge, userAnswer: any): ValidationResult => {
  // Ensure userAnswer is a string
  const userAnswerString = String(userAnswer || '').trim();
  
  // Check if correct_answer is properly formatted
  if (!challenge.correct_answer) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Challenge configuration error: missing correct answer',
      difficulty: challenge.difficulty,
      detailedFeedback: 'This challenge appears to be misconfigured. Please contact support.'
    };
  }
  
  // Handle different formats of correct_answer
  let acceptableAnswers: string[] = [];
  
  if (typeof challenge.correct_answer === 'string') {
    acceptableAnswers = [challenge.correct_answer];
  } else if (Array.isArray(challenge.correct_answer)) {
    acceptableAnswers = challenge.correct_answer.map(answer => String(answer || ''));
  } else if (challenge.correct_answer.acceptableAnswers && Array.isArray(challenge.correct_answer.acceptableAnswers)) {
    acceptableAnswers = challenge.correct_answer.acceptableAnswers.map(answer => String(answer || ''));
  } else {
    // Fallback: convert whatever format to string
    acceptableAnswers = [String(challenge.correct_answer)];
  }
  
  // Filter out empty strings
  acceptableAnswers = acceptableAnswers.filter(answer => answer.length > 0);
  
  if (acceptableAnswers.length === 0) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Challenge configuration error: no valid acceptable answers',
      difficulty: challenge.difficulty,
      detailedFeedback: 'This challenge appears to be misconfigured. Please contact support.'
    };
  }
  
  const isCorrect = acceptableAnswers.includes(userAnswerString);
  
  let feedback = '';
  let detailedFeedback = '';
  
  if (isCorrect) {
    feedback = 'Excellent cultural interpretation! You understood the social context well.';
    detailedFeedback = 'Social communication involves layers of meaning beyond literal words. You successfully decoded the tone, cultural context, and intended meaning.';
  } else {
    feedback = 'Social context can significantly change how messages are interpreted.';
    detailedFeedback = 'Consider the platform, relationship dynamics, cultural background, generational differences, and timing when interpreting social messages. Emojis, slang, and context clues provide important meaning.';
  }
  
  // Partial credit for social interpretation challenges
  let score = isCorrect ? 100 : 60;
  
  // Give some credit for reasonable interpretations even if not the "correct" one
  const reasonableInterpretations = challenge.content.interpretations || [];
  if (!isCorrect && reasonableInterpretations.includes(userAnswerString)) {
    score = 80; // High partial credit for plausible interpretations
    feedback = 'Your interpretation is reasonable, though not the most likely intended meaning.';
  }
  
  return {
    isCorrect,
    score,
    feedback,
    difficulty: challenge.difficulty,
    detailedFeedback
  };
};

/**
 * Advanced adaptive difficulty calculation
 */
export function calculateAdaptiveDifficulty(
  currentDifficulty: 'easy' | 'medium' | 'hard', 
  recentPerformance: ValidationResult[], 
  responseTimeHistory: number[]
): DifficultyAssessment {
  if (recentPerformance.length < 3) {
    return {
      currentLevel: currentDifficulty,
      nextRecommended: currentDifficulty,
      confidenceScore: 0.5,
      reasoning: 'Insufficient data for accurate assessment'
    };
  }
  
  const averageScore = recentPerformance.reduce((sum, result) => sum + result.score, 0) / recentPerformance.length;
  const successRate = recentPerformance.filter(r => r.isCorrect).length / recentPerformance.length;
  const averageResponseTime = responseTimeHistory.length > 0 
    ? responseTimeHistory.reduce((sum, time) => sum + time, 0) / responseTimeHistory.length 
    : 10000; // Default 10 seconds
  
  // Performance indicators
  const isPerformingWell = successRate >= 0.8 && averageScore >= 85;
  const isStruggling = successRate <= 0.4 || averageScore < 50;
  const isFastResponder = averageResponseTime < 5000; // Less than 5 seconds
  const isSlowResponder = averageResponseTime > 15000; // More than 15 seconds
  
  let nextRecommended: 'easy' | 'medium' | 'hard' = currentDifficulty;
  let confidenceScore = 0.7;
  let reasoning = '';
  
  if (isPerformingWell && !isSlowResponder) {
    // User is ready for harder challenges
    if (currentDifficulty === 'easy') {
      nextRecommended = 'medium';
      reasoning = 'High success rate and good response times indicate readiness for medium difficulty';
    } else if (currentDifficulty === 'medium') {
      nextRecommended = 'hard';
      reasoning = 'Excellent performance suggests capability for hard challenges';
    } else {
      nextRecommended = 'hard';
      reasoning = 'Maintaining high performance at hard difficulty';
    }
    confidenceScore = 0.9;
  } else if (isStruggling || isSlowResponder) {
    // User needs easier challenges
    if (currentDifficulty === 'hard') {
      nextRecommended = 'medium';
      reasoning = 'Lower performance indicates need for medium difficulty';
    } else if (currentDifficulty === 'medium') {
      nextRecommended = 'easy';
      reasoning = 'Struggling with current level, recommending easier challenges';
    } else {
      nextRecommended = 'easy';
      reasoning = 'Maintaining at easy difficulty for confidence building';
    }
    confidenceScore = 0.8;
  } else {
    // User is performing adequately, maintain current level
    nextRecommended = currentDifficulty;
    reasoning = 'Performance is steady at current difficulty level';
    confidenceScore = 0.6;
  }
  
  return {
    currentLevel: currentDifficulty,
    nextRecommended,
    confidenceScore,
    reasoning
  };
};

/**
 * Challenge performance analytics
 */
export function calculateChallengeMetrics(responses: any[]): ChallengeMetrics {
  if (responses.length === 0) {
    return {
      averageTime: 0,
      successRate: 0,
      difficultyScore: 50,
      userFeedback: 0,
      adaptiveLevel: 0.5
    };
  }
  
  const averageTime = responses.reduce((sum, r) => sum + r.response_time_ms, 0) / responses.length;
  const successful = responses.filter(r => r.is_human).length;
  const successRate = successful / responses.length;
  
  // Enhanced difficulty scoring algorithm
  const normalizedTime = Math.min(averageTime / 10000, 2); // Normalize to 0-2 range
  const timeWeight = 0.3;
  const successWeight = 0.7;
  
  const difficultyScore = Math.round(
    ((normalizedTime * timeWeight) + ((1 - successRate) * successWeight)) * 100
  );
  
  // Adaptive level calculation (0-1 scale)
  const adaptiveLevel = Math.max(0, Math.min(1, 
    (successRate * 0.6) + ((normalizedTime > 1 ? 0 : (1 - normalizedTime)) * 0.4)
  ));
  
  return {
    averageTime: Math.round(averageTime),
    successRate: Math.round(successRate * 100),
    difficultyScore,
    userFeedback: 0, // To be implemented with user feedback system
    adaptiveLevel: Math.round(adaptiveLevel * 100)
  };
};

/**
 * A/B testing framework for challenge variants
 */
export function evaluateABTestResults(variants: ABTestVariant[]): {
  winner: ABTestVariant | null;
  confidence: number;
  significance: boolean;
} {
  if (variants.length < 2) {
    return { winner: null, confidence: 0, significance: false };
  }
  
  // Simple performance comparison - in production would use statistical significance testing
  const bestVariant = variants.reduce((best, current) => 
    current.performance.successRate > best.performance.successRate ? current : best
  );
  
  const worstVariant = variants.reduce((worst, current) => 
    current.performance.successRate < worst.performance.successRate ? current : worst
  );
  
  const performanceDifference = bestVariant.performance.successRate - worstVariant.performance.successRate;
  const minSampleSize = Math.min(...variants.map(v => v.sampleSize));
  
  // Basic significance calculation (would be more sophisticated in production)
  const significance = performanceDifference > 5 && minSampleSize > 100; // 5% difference and 100+ samples
  const confidence = Math.min(0.95, (performanceDifference / 20) + (minSampleSize / 1000));
  
  return {
    winner: significance ? bestVariant : null,
    confidence,
    significance
  };
}