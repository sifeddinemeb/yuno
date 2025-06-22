/**
 * Core application type definitions
 */

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  content: any;
  correct_answer: any;
  signal_tags: string[];
  input_mode: InputMode;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ChallengeType = 
  | 'MemeTimeWarp'
  | 'SentimentSpectrum'
  | 'EthicsPing'
  | 'PatternPlay'
  | 'PerceptionFlip'
  | 'SocialDecoder'
  | 'CreativeReasoning'
  | 'CulturalVibes'
  | 'VoiceCheck';

export type InputMode = 
  | 'drag-and-drop'
  | 'multiple-choice'
  | 'text-input'
  | 'voice-input'
  | 'slider'
  | 'selection';

export interface UserResponse {
  id?: string;
  sessionId: string;
  challengeId: string | null;
  answer: any;
  responseTimeMs: number;
  challengeType: ChallengeType;
  inputMode: InputMode;
  signalTags?: string[];
  isHuman?: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: string;
}

export interface ApiKey {
  id: string;
  clientName: string;
  apiKey: string;
  status: 'active' | 'inactive' | 'revoked';
  permissions: {
    read: boolean;
    write: boolean;
  };
  usageMetrics: {
    totalRequests?: number;
    successfulVerifications?: number;
    failedVerifications?: number;
  };
  createdAt: string;
  lastUsedAt?: string | null;
  createdBy: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  preferences?: Record<string, any>;
}

export interface AnalyticsData {
  humanPassRate: number;
  botDetectionRate: number;
  avgResponseTime: number;
  totalAttempts: number;
  activeChallenges?: number;
  activeIntegrations?: number;
  recentActivity?: Array<{
    timestamp: string;
    action: string;
    details: string;
  }>;
}

export interface ValidationResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  difficulty: 'easy' | 'medium' | 'hard';
  partialCredit?: number;
  detailedFeedback?: string;
}

export interface BotDetectionResult {
  isHuman: boolean;
  confidence: number;
  signals: Record<string, number>;
  riskFactors: string[];
  adaptiveAction?: string;
}

export interface SessionData {
  id: string;
  fingerprint: string;
  startTime: number;
  interactions: any[];
  deviceInfo: {
    platform: string;
    browser: string;
    deviceType: string;
  };
}

// Add missing validation types
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