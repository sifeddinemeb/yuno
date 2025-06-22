/**
 * Analytics tracking type definitions
 * Extracted from analytics-tracking.ts for better organization
 */

export interface ChallengeAnalytics {
  challengeId: string;
  challengeType: string;
  totalAttempts: number;
  successfulAttempts: number;
  averageResponseTime: number;
  difficultyRating: number;
  userSatisfaction: number;
  completionRate: number;
  retryRate: number;
  errorRate: number;
  deviceBreakdown: Record<string, number>;
  timeOfDayBreakdown: Record<string, number>;
  botDetectionConfidence: number;
}

export interface UserPerformance {
  userId?: string;
  sessionId: string;
  challengesCompleted: number;
  averageScore: number;
  averageTime: number;
  strongestCategory: string;
  weakestCategory: string;
  adaptiveDifficulty: 'easy' | 'medium' | 'hard';
  behavioralTrustScore: number;
  anomalyScore: number;
}

export interface BotDetectionMetrics {
  sessionId: string;
  timestamp: string;
  detectionConfidence: number;
  isHuman: boolean;
  mouseScore: number;
  keyboardScore: number;
  timingScore: number;
  behaviorScore: number;
  environmentalScore: number;
  interactionScore: number;
  anomalyScore: number;
  riskFactorCount: number;
  challengeType: string;
  responseTime: number;
  device: {
    type: string;
    platform: string;
    browser: string;
  };
}

export interface SessionAnalytics {
  sessionId: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalChallenges: number;
  challengeBreakdown: Record<string, number>;
  successRate: number;
  averageResponseTime: number;
  behaviorMetrics: {
    mouseMovements: number;
    clicks: number;
    keystrokes: number;
    pauseFrequency: number;
    interactionDensity: number;
  };
  deviceInfo: {
    platform: string;
    browser: string;
    screenSize: string;
    isMobile: boolean;
  };
  geolocation?: {
    country?: string;
    region?: string;
    city?: string;
  };
  botDetection: {
    finalVerdict: 'human' | 'bot' | 'uncertain';
    confidence: number;
    flaggedSignals: string[];
  };
}

export interface A_BTestResult {
  testId: string;
  variantA: string;
  variantB: string;
  metricName: string;
  variantAValue: number;
  variantBValue: number;
  confidenceLevel: number;
  isSignificant: boolean;
  winningVariant: string | null;
  pValue: number;
}