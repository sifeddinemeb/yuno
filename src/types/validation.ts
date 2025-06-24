/**
 * Challenge validation type definitions
 * Extracted from challenge-validation.ts for better organization
 */

export interface ValidationResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  difficulty: 'easy' | 'medium' | 'hard';
  partialCredit?: number;
  detailedFeedback?: string;
}

export interface ChallengeMetrics {
  averageTime: number;
  successRate: number;
  difficultyScore: number;
  userFeedback: number;
  adaptiveLevel: number;
}

export interface DifficultyAssessment {
  currentLevel: 'easy' | 'medium' | 'hard';
  nextRecommended: 'easy' | 'medium' | 'hard';
  confidenceScore: number;
  reasoning: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  challenge: any;
  performance: ChallengeMetrics;
  sampleSize: number;
}