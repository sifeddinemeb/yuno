/**
 * Advanced analytics and performance tracking for challenges
 * Enhanced in Sprint 5 with behavioral analysis integration
 */

import { supabase } from './supabase';
import { Challenge } from '../types';
import { ValidationResult, calculateChallengeMetrics } from './challenge-validation';
import { BotDetectionResult } from './bot-detection';

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

/**
 * Track challenge completion with enhanced bot detection metrics
 */
export const trackChallengeCompletion = async (data: {
  challengeId: string;
  sessionId: string;
  answer: any;
  responseTime: number;
  isCorrect: boolean;
  botDetection: BotDetectionResult;
  userAgent: string;
  timestamp?: Date;
}) => {
  try {
    // Extract device information
    const deviceInfo = parseUserAgent(data.userAgent);
    
    // Track in database
    await supabase.from('user_responses').insert([{
      session_id: data.sessionId,
      challenge_id: data.challengeId,
      answer: data.answer,
      response_time_ms: data.responseTime,
      challenge_type: await getChallengeType(data.challengeId),
      input_mode: await getChallengeInputMode(data.challengeId),
      is_human: data.isCorrect && data.botDetection.isHuman,
      user_agent: data.userAgent,
      ip_address: null, // Will be handled by backend
      created_at: data.timestamp?.toISOString() || new Date().toISOString()
    }]);

    // Store detailed bot detection metrics
    await trackBotDetectionMetrics({
      sessionId: data.sessionId,
      botDetection: data.botDetection,
      challengeId: data.challengeId,
      responseTime: data.responseTime,
      userAgent: data.userAgent
    });

    // Update real-time analytics
    await updateChallengeMetrics(data.challengeId);
    
  } catch (error) {
    console.error('Error tracking challenge completion:', error);
  }
};

/**
 * Track detailed bot detection metrics for ML training
 */
export const trackBotDetectionMetrics = async (data: {
  sessionId: string;
  botDetection: BotDetectionResult;
  challengeId: string;
  responseTime: number;
  userAgent: string;
}) => {
  try {
    const deviceInfo = parseUserAgent(data.userAgent);
    const challengeType = await getChallengeType(data.challengeId);
    
    const metrics: BotDetectionMetrics = {
      sessionId: data.sessionId,
      timestamp: new Date().toISOString(),
      detectionConfidence: data.botDetection.confidence,
      isHuman: data.botDetection.isHuman,
      mouseScore: data.botDetection.signals.mouseAnalysis / 100,
      keyboardScore: data.botDetection.signals.keyboardAnalysis / 100,
      timingScore: data.botDetection.signals.timingAnalysis / 100,
      behaviorScore: data.botDetection.signals.behavioralConsistency / 100,
      environmentalScore: data.botDetection.signals.environmentalRealism / 100,
      interactionScore: data.botDetection.signals.interactionNaturalness / 100,
      anomalyScore: data.botDetection.signals.anomalyScore / 100,
      riskFactorCount: data.botDetection.riskFactors.length,
      challengeType,
      responseTime: data.responseTime,
      device: {
        type: deviceInfo.deviceType,
        platform: deviceInfo.platform,
        browser: deviceInfo.browser
      }
    };
    
    // In production, we'd store this in a dedicated analytics table
    // For now, log to console for debugging
    console.log('Bot detection metrics tracked:', metrics);
    
    // Eventually, we'll use this data to train ML models
    // await supabase.from('bot_detection_metrics').insert([metrics]);
  } catch (error) {
    console.warn('Error tracking bot detection metrics:', error);
    // Non-critical, don't throw error
  }
};

/**
 * Track user behavioral events for ML training
 */
export const trackUserInteraction = async (data: {
  sessionId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
}) => {
  try {
    // In production, we would store behavioral events for ML model training
    // For the MVP, we'll use them only for real-time analysis
    
    // Log selected events for debugging
    if (['challenge_start', 'verification_success', 'verification_failed'].includes(data.eventType)) {
      console.log(`Event: ${data.eventType}`, data.eventData);
    }
  } catch (error) {
    console.error('Error tracking user interaction:', error);
  }
};

/**
 * Get comprehensive challenge analytics for multiple challenges
 */
export const getChallengeAnalytics = async (challengeIds: string[]): Promise<ChallengeAnalytics[]> => {
  try {
    if (!challengeIds || challengeIds.length === 0) {
      return [];
    }

    // Filter out any invalid IDs
    const validChallengeIds = challengeIds.filter(id => id && typeof id === 'string' && id.trim().length > 0);
    
    if (validChallengeIds.length === 0) {
      return [];
    }

    // For each challenge ID, get responses - uses individual queries to avoid UUID format issues
    const resultsPromises = validChallengeIds.map(async (challengeId) => {
      const { data: responses, error } = await supabase
        .from('user_responses')
        .select('*')
        .eq('challenge_id', challengeId);
      
      if (error) {
        console.error(`Error fetching responses for challenge ${challengeId}:`, error);
        return null;
      }
      
      return { challengeId, responses: responses || [] };
    });
    
    const results = await Promise.all(resultsPromises);
    const validResults = results.filter(result => result !== null) as { challengeId: string; responses: any[] }[];
    
    // Calculate analytics for each challenge
    const analyticsResults: ChallengeAnalytics[] = [];

    for (const result of validResults) {
      const { challengeId, responses } = result;
      
      if (responses.length === 0) {
        // No responses for this challenge
        analyticsResults.push({
          challengeId,
          challengeType: 'Unknown',
          totalAttempts: 0,
          successfulAttempts: 0,
          averageResponseTime: 0,
          difficultyRating: 0,
          userSatisfaction: 0,
          completionRate: 0,
          retryRate: 0,
          errorRate: 0,
          deviceBreakdown: {},
          timeOfDayBreakdown: {},
          botDetectionConfidence: 0
        });
        continue;
      }

      const totalAttempts = responses.length;
      const successfulAttempts = responses.filter(r => r.is_human).length;
      const averageResponseTime = responses.reduce((sum, r) => sum + (r.response_time_ms || 0), 0) / totalAttempts;
      
      // Calculate device breakdown
      const deviceBreakdown: Record<string, number> = {};
      responses.forEach(r => {
        const deviceInfo = parseUserAgent(r.user_agent);
        const deviceType = deviceInfo.deviceType;
        deviceBreakdown[deviceType] = (deviceBreakdown[deviceType] || 0) + 1;
      });

      // Calculate time of day breakdown
      const timeOfDayBreakdown: Record<string, number> = {};
      responses.forEach(r => {
        const hour = new Date(r.created_at).getHours();
        const timeSlot = getTimeSlot(hour);
        timeOfDayBreakdown[timeSlot] = (timeOfDayBreakdown[timeSlot] || 0) + 1;
      });

      const metrics = calculateChallengeMetrics(responses);

      // Calculate retry rate
      const uniqueSessions = new Set(responses.map(r => r.session_id)).size;
      const retryRate = uniqueSessions > 0 ? (totalAttempts - uniqueSessions) / uniqueSessions : 0;

      // Calculate average bot detection confidence
      // In production, this would come from bot_detection_metrics table
      const botDetectionConfidence = 0.89; // Placeholder value

      analyticsResults.push({
        challengeId,
        challengeType: responses[0].challenge_type || 'Unknown',
        totalAttempts,
        successfulAttempts,
        averageResponseTime: Math.round(averageResponseTime),
        difficultyRating: metrics.difficultyScore,
        userSatisfaction: metrics.userFeedback,
        completionRate: totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0,
        retryRate: retryRate * 100,
        errorRate: totalAttempts > 0 ? ((totalAttempts - successfulAttempts) / totalAttempts) * 100 : 0,
        deviceBreakdown,
        timeOfDayBreakdown,
        botDetectionConfidence
      });
    }

    return analyticsResults;

  } catch (error) {
    console.error('Error getting challenge analytics:', error);
    throw error;
  }
};

/**
 * Get comprehensive user session analytics
 */
export const getSessionAnalytics = async (sessionId: string): Promise<SessionAnalytics | null> => {
  try {
    // Get all responses for this session
    const { data: responses, error } = await supabase
      .from('user_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!responses || responses.length === 0) return null;

    // Basic session metrics
    const startTime = new Date(responses[0].created_at).toISOString();
    const endTime = new Date(responses[responses.length - 1].created_at).toISOString();
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
    const totalChallenges = responses.length;
    const successfulAttempts = responses.filter(r => r.is_human).length;
    const successRate = (successfulAttempts / totalChallenges) * 100;
    const averageResponseTime = responses.reduce((sum, r) => sum + r.response_time_ms, 0) / totalChallenges;

    // Challenge type breakdown
    const challengeBreakdown: Record<string, number> = {};
    responses.forEach(r => {
      const type = r.challenge_type;
      challengeBreakdown[type] = (challengeBreakdown[type] || 0) + 1;
    });

    // Get device info from user agent
    const deviceInfo = parseUserAgent(responses[0].user_agent);

    // In production, we'd get this from our bot_detection_metrics table
    // For now, use mock data based on the actual results
    const botDetectionVerdict = successfulAttempts / totalChallenges > 0.7 ? 'human' : 'bot';
    const botConfidence = successfulAttempts / totalChallenges > 0.7 ? 0.92 : 0.85;

    return {
      sessionId,
      startTime,
      endTime,
      duration,
      totalChallenges,
      challengeBreakdown,
      successRate,
      averageResponseTime,
      behaviorMetrics: {
        mouseMovements: 157, // Mock values - in production from bot_detection_metrics
        clicks: 8,
        keystrokes: 32,
        pauseFrequency: 1.2,
        interactionDensity: 0.8
      },
      deviceInfo: {
        platform: deviceInfo.platform,
        browser: deviceInfo.browser,
        screenSize: '1920x1080', // Mocked
        isMobile: deviceInfo.deviceType === 'Mobile'
      },
      botDetection: {
        finalVerdict: botDetectionVerdict as 'human' | 'bot' | 'uncertain',
        confidence: botConfidence,
        flaggedSignals: botDetectionVerdict === 'human' ? [] : ['response_time', 'mouse_patterns']
      }
    };

  } catch (error) {
    console.error('Error getting session analytics:', error);
    return null;
  }
};

/**
 * Initialize A/B testing framework
 */
export const initializeABTest = async (testConfig: {
  testId: string;
  challengeIds: string[];
  variantA: any;
  variantB: any;
  metricName: string;
  trafficSplit: number; // 0.5 = 50/50 split
}) => {
  try {
    // Store A/B test configuration
    const testData = {
      test_id: testConfig.testId,
      challenge_ids: testConfig.challengeIds,
      variant_a: testConfig.variantA,
      variant_b: testConfig.variantB,
      metric_name: testConfig.metricName,
      traffic_split: testConfig.trafficSplit,
      start_date: new Date().toISOString(),
      is_active: true
    };

    // In production, this would be stored in an A/B testing table
    console.log('A/B test initialized:', testData);

    return testConfig.testId;
  } catch (error) {
    console.error('Error initializing A/B test:', error);
    return null;
  }
};

/**
 * Get A/B test variant for user with consistent assignment
 */
export const getABTestVariant = (sessionId: string, testId: string): 'A' | 'B' => {
  // Use a seeded random number generator for consistent assignment
  const seed = hashString(`${sessionId}_${testId}`);
  const randomValue = seededRandom(seed);
  
  return randomValue < 0.5 ? 'A' : 'B';
};

/**
 * Calculate A/B test results with statistical significance
 */
export const calculateABTestResults = async (testId: string): Promise<A_BTestResult | null> => {
  try {
    // In production, this would query A/B test results from the database
    // For now, return mock results that demonstrate statistical concepts
    
    // Example A/B test for challenge completion rates
    const variantAData = {
      attempts: 524,
      successes: 441,
      responseTime: 9800
    };
    
    const variantBData = {
      attempts: 531,
      successes: 470,
      responseTime: 8300
    };
    
    // Calculate success rates
    const variantAValue = (variantAData.successes / variantAData.attempts) * 100;
    const variantBValue = (variantBData.successes / variantBData.attempts) * 100;
    
    // Simple statistical significance calculation
    // In production would use proper hypothesis testing (z-test)
    const pValue = calculatePValue(
      variantAData.successes, variantAData.attempts,
      variantBData.successes, variantBData.attempts
    );
    
    const isSignificant = pValue < 0.05; // Standard threshold
    const confidenceLevel = (1 - pValue) * 100;
    
    return {
      testId,
      variantA: 'Original Challenge',
      variantB: 'Modified Challenge',
      metricName: 'Completion Rate',
      variantAValue,
      variantBValue,
      confidenceLevel: Math.min(99.9, confidenceLevel), // Cap at 99.9%
      isSignificant,
      winningVariant: isSignificant ? (variantBValue > variantAValue ? 'B' : 'A') : null,
      pValue
    };
  } catch (error) {
    console.error('Error calculating A/B test results:', error);
    return null;
  }
};

/**
 * Advanced ML model training feedback for bot detection
 */
export const trainBotDetectionModel = async (data: {
  sessionId: string;
  isHuman: boolean;
  confidence: number;
  signals: Record<string, number>;
  timestamp: Date;
}) => {
  try {
    // In production, this would send behavioral data to ML training pipeline
    // For now, log training data for demonstration
    console.log('ML model training data:', {
      label: data.isHuman ? 'human' : 'bot',
      confidence: data.confidence,
      features: data.signals,
      timestamp: data.timestamp
    });
    
    // Simulate model update confirmation
    return {
      modelUpdated: true,
      modelVersion: '1.0.5',
      dataPointsProcessed: 1
    };
  } catch (error) {
    console.error('Error sending ML training data:', error);
    return {
      modelUpdated: false,
      error: 'Failed to process training data'
    };
  }
};

/**
 * Helper functions for analytics processing
 */

const parseUserAgent = (userAgent: string) => {
  if (!userAgent) return { 
    deviceType: 'Unknown', 
    browser: 'Unknown',
    platform: 'Unknown' 
  };
  
  // Determine device type
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);
  
  let deviceType = 'Desktop';
  if (isTablet) deviceType = 'Tablet';
  else if (isMobile) deviceType = 'Mobile';
  
  // Determine browser
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
  else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) browser = 'Internet Explorer';
  
  // Determine platform
  let platform = 'Unknown';
  if (userAgent.includes('Win')) platform = 'Windows';
  else if (userAgent.includes('Mac')) platform = 'MacOS';
  else if (userAgent.includes('Linux') || userAgent.includes('X11')) platform = 'Linux';
  else if (userAgent.includes('Android')) platform = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) platform = 'iOS';

  return { 
    deviceType, 
    browser,
    platform,
    userAgent: userAgent.substring(0, 200) // Truncate for storage
  };
};

const getTimeSlot = (hour: number): string => {
  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 22) return 'Evening';
  return 'Night';
};

const getChallengeType = async (challengeId: string): Promise<string> => {
  if (!challengeId) return 'Unknown';
  
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('type')
      .eq('id', challengeId)
      .single();
    
    return data?.type || 'Unknown';
  } catch {
    return 'Unknown';
  }
};

const getChallengeInputMode = async (challengeId: string): Promise<string> => {
  if (!challengeId) return 'Unknown';
  
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('input_mode')
      .eq('id', challengeId)
      .single();
    
    return data?.input_mode || 'Unknown';
  } catch {
    return 'Unknown';
  }
};

const updateChallengeMetrics = async (challengeId: string) => {
  // In production, this would update real-time metrics
  console.log('Updating metrics for challenge:', challengeId);
};

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Seeded random number generator for consistent A/B testing
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Calculate p-value for A/B test statistical significance
const calculatePValue = (
  successesA: number, 
  totalA: number, 
  successesB: number, 
  totalB: number
): number => {
  // Simple z-test implementation
  const propA = successesA / totalA;
  const propB = successesB / totalB;
  const pooledProp = (successesA + successesB) / (totalA + totalB);
  
  const standardError = Math.sqrt(
    pooledProp * (1 - pooledProp) * (1/totalA + 1/totalB)
  );
  
  // Z-score
  const z = Math.abs((propA - propB) / standardError);
  
  // Approximate p-value from z-score
  // This is a simplification; in production would use proper statistical libraries
  const p = 1 - 0.5 * (1 + Math.tanh((Math.sqrt(Math.PI/8) * z) / (1 + z*z/2)));
  
  return p;
};