/**
 * Challenge content type definitions
 * Extracted from challenge-content.ts for better organization
 */

export interface MemeData {
  id: string;
  name: string;
  year: number;
  description?: string;
  popularityPeak?: string;
  culturalImpact?: string;
  platform?: string;
}

export interface EthicsScenario {
  id: string;
  scenario: string;
  choices: EthicsChoice[];
  category: 'privacy' | 'fairness' | 'transparency' | 'autonomy' | 'welfare' | 'rights' | 'justice';
  difficulty: 'easy' | 'medium' | 'hard';
  ethicalFrameworks: string[];
  realWorldContext?: string;
}

export interface EthicsChoice {
  id: string;
  title: string;
  description: string;
  feedback: string;
  ethicalFramework: string[];
  consequences?: string[];
  stakeholders?: string[];
}

export interface PatternSequence {
  id: string;
  sequence: number[];
  correctNext: number;
  rule: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'arithmetic' | 'geometric' | 'fibonacci' | 'alternating' | 'positional' | 'prime' | 'factorial';
}

export interface PerceptionIllusion {
  id: string;
  type: 'perspective' | 'ambiguous' | 'optical' | 'color' | 'motion';
  description: string;
  hint?: string;
  acceptableAnswers: string[];
  explanation?: string;
  illusionData?: any;
}

export interface SocialMessage {
  id: string;
  message: string;
  author: string;
  platform: string;
  timestamp?: string;
  context?: string;
  emojis?: string;
  interpretations: string[];
  correctInterpretation: string;
  culturalContext: string;
  difficulty: 'easy' | 'medium' | 'hard';
}