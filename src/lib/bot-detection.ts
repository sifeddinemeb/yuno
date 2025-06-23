/**
 * Simplified bot detection system with behavioral analysis
 * Streamlined for production use with core functionality preserved
 */

import FingerprintJS, { GetResult } from '@fingerprintjs/fingerprintjs';
import { BotDetectionResult, SessionData } from '../types';

// Session tracking
const activeSessions: Map<string, SessionData> = new Map();
const behavioralPatterns: Map<string, any[]> = new Map();

// Initialize bot detection for a session
export const initializeBotDetection = (sessionId: string): void => {
  if (!sessionId) return;
  
  const sessionData: SessionData = {
    id: sessionId,
    fingerprint: '',
    startTime: Date.now(),
    interactions: [],
    deviceInfo: {
      platform: navigator.platform,
      browser: getBrowserInfo(),
      deviceType: getDeviceType()
    }
  };
  
  activeSessions.set(sessionId, sessionData);
  behavioralPatterns.set(sessionId, []);
  
  initializeFingerprinting(sessionId);
  console.log(`Bot detection initialized for session: ${sessionId}`);
};

// Track user interactions for behavioral analysis
export const trackUserInteraction = (sessionId: string, eventData: any): void => {
  if (!sessionId || !activeSessions.has(sessionId)) return;
  
  const session = activeSessions.get(sessionId);
  if (!session) return;
  
  if (!eventData.data?.timestamp) {
    eventData.data = {
      ...eventData.data,
      timestamp: Date.now()
    };
  }
  
  session.interactions.push(eventData);
  processBehavioralPatterns(sessionId, eventData);
};

// Simplified bot detection analysis
export const performBotDetection = (
  sessionId: string,
  responseTime: number,
  challengeType: string
): BotDetectionResult => {
  if (!sessionId || !activeSessions.has(sessionId)) {
    return createDefaultBotDetectionResult();
  }
  
  const session = activeSessions.get(sessionId);
  if (!session) {
    return createDefaultBotDetectionResult();
  }
  
  // Core behavioral analysis
  const mouseAnalysis = analyzeMouseMovements(session);
  const keyboardAnalysis = analyzeKeyboardDynamics(session);
  const timingAnalysis = analyzeTimingPatterns(session, responseTime);
  const behavioralConsistency = analyzeBehavioralConsistency(session);
  const environmentalRealism = analyzeEnvironmentalRealism(session);
  const interactionNaturalness = analyzeInteractionNaturalness(session);
  const anomalyScore = calculateAnomalyScore(session);
  
  const riskFactors = identifyRiskFactors(
    session,
    mouseAnalysis,
    keyboardAnalysis,
    timingAnalysis,
    responseTime,
    anomalyScore
  );
  
  const humanScore = calculateHumanConfidence(
    mouseAnalysis,
    keyboardAnalysis,
    timingAnalysis,
    behavioralConsistency,
    environmentalRealism,
    interactionNaturalness,
    anomalyScore,
    riskFactors.length,
    challengeType
  );
  
  return {
    isHuman: humanScore > 0.5,
    confidence: humanScore,
    signals: {
      mouseAnalysis,
      keyboardAnalysis,
      timingAnalysis,
      behavioralConsistency,
      environmentalRealism,
      interactionNaturalness,
      anomalyScore
    },
    riskFactors,
    adaptiveAction: humanScore > 0.8 ? 'increase_difficulty' : humanScore < 0.4 ? 'decrease_difficulty' : 'maintain_difficulty'
  };
};

// Simplified behavioral pattern processing
const processBehavioralPatterns = (sessionId: string, eventData: any): void => {
  if (!sessionId || !behavioralPatterns.has(sessionId)) return;
  
  const patterns = behavioralPatterns.get(sessionId) || [];
  
  switch (eventData.type) {
    case 'mousemove':
      patterns.push({
        type: 'mouse',
        timestamp: eventData.data.timestamp,
        x: eventData.data.x,
        y: eventData.data.y
      });
      break;
    case 'keydown':
    case 'keyup':
      patterns.push({
        type: 'keyboard',
        timestamp: eventData.data.timestamp,
        key: eventData.data.key,
        eventType: eventData.type
      });
      break;
    case 'click':
      patterns.push({
        type: 'click',
        timestamp: eventData.data.timestamp,
        x: eventData.data.x,
        y: eventData.data.y
      });
      break;
  }
  
  // Keep only recent patterns (last 100)
  if (patterns.length > 100) {
    patterns.splice(0, patterns.length - 100);
  }
  
  behavioralPatterns.set(sessionId, patterns);
};

// Simplified analysis functions
const analyzeMouseMovements = (session: SessionData): number => {
  const mouseEvents = session.interactions.filter(i => i.type === 'mousemove');
  if (mouseEvents.length < 5) return 50;
  
  // Basic movement pattern analysis
  let naturalScore = 50;
  
  // Check for varied movement patterns
  const movements = mouseEvents.map(e => ({ x: e.data.x, y: e.data.y }));
  let variance = 0;
  
  for (let i = 1; i < movements.length; i++) {
    const dx = movements[i].x - movements[i-1].x;
    const dy = movements[i].y - movements[i-1].y;
    variance += Math.abs(dx) + Math.abs(dy);
  }
  
  const avgVariance = variance / movements.length;
  if (avgVariance > 10 && avgVariance < 100) naturalScore += 20;
  
  return Math.max(0, Math.min(100, naturalScore));
};

const analyzeKeyboardDynamics = (session: SessionData): number => {
  const keyEvents = session.interactions.filter(i => i.type === 'keydown' || i.type === 'keyup');
  if (keyEvents.length < 3) return 50;
  
  let naturalScore = 50;
  
  // Check for natural typing patterns
  const intervals = [];
  for (let i = 1; i < keyEvents.length; i++) {
    const interval = keyEvents[i].data.timestamp - keyEvents[i-1].data.timestamp;
    if (interval > 0 && interval < 2000) intervals.push(interval);
  }
  
  if (intervals.length > 0) {
    const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    if (avgInterval > 100 && avgInterval < 500) naturalScore += 20;
  }
  
  return Math.max(0, Math.min(100, naturalScore));
};

const analyzeTimingPatterns = (session: SessionData, responseTime: number): number => {
  let score = 50;
  
  // Natural response time ranges
  if (responseTime > 2000 && responseTime < 30000) score += 20;
  if (responseTime < 1000) score -= 30; // Too fast
  if (responseTime > 60000) score -= 20; // Too slow
  
  return Math.max(0, Math.min(100, score));
};

const analyzeBehavioralConsistency = (session: SessionData): number => {
  const interactions = session.interactions;
  if (interactions.length < 5) return 50;
  
  let score = 50;
  
  // Check for natural pauses
  const hasNaturalPauses = interactions.some(i => i.type === 'idle');
  if (hasNaturalPauses) score += 10;
  
  // Check for varied interaction types
  const types = new Set(interactions.map(i => i.type));
  if (types.size >= 3) score += 10;
  
  return Math.max(0, Math.min(100, score));
};

const analyzeEnvironmentalRealism = (session: SessionData): number => {
  let score = 50;
  
  const userAgent = navigator.userAgent;
  
  // Check for automation indicators
  if (userAgent.includes('Headless') || userAgent.includes('Selenium') || 
      userAgent.includes('Puppeteer') || userAgent.includes('PhantomJS')) {
    score -= 30;
  }
  
  // Check for WebDriver
  if ('webdriver' in navigator && (navigator as any).webdriver) {
    score -= 30;
  }
  
  // Check for plugins
  if (navigator.plugins.length > 0) score += 10;
  
  return Math.max(0, Math.min(100, score));
};

const analyzeInteractionNaturalness = (session: SessionData): number => {
  const interactions = session.interactions;
  if (interactions.length < 3) return 50;
  
  let score = 50;
  
  // Check for mouse movement before clicks
  const clicks = interactions.filter(i => i.type === 'click');
  let naturalClicks = 0;
  
  for (const click of clicks) {
    const priorMoves = interactions.filter(i => 
      i.type === 'mousemove' && 
      i.data.timestamp < click.data.timestamp && 
      i.data.timestamp > click.data.timestamp - 1000
    );
    if (priorMoves.length > 0) naturalClicks++;
  }
  
  if (clicks.length > 0) {
    const naturalRatio = naturalClicks / clicks.length;
    if (naturalRatio > 0.5) score += 15;
  }
  
  return Math.max(0, Math.min(100, score));
};

const calculateAnomalyScore = (session: SessionData): number => {
  // Simplified anomaly detection
  let anomalies = 0;
  
  const interactions = session.interactions;
  if (interactions.length === 0) return 50;
  
  // Check for too regular timing
  const timestamps = interactions.map(i => i.data.timestamp);
  const intervals = [];
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i-1]);
  }
  
  if (intervals.length > 3) {
    const variance = calculateVariance(intervals);
    if (variance < 1000) anomalies++; // Too regular
  }
  
  return Math.min(100, anomalies * 25);
};

const identifyRiskFactors = (
  session: SessionData,
  mouseScore: number,
  keyboardScore: number,
  timingScore: number,
  responseTime: number,
  anomalyScore: number
): string[] => {
  const riskFactors = [];
  
  if (mouseScore < 30) riskFactors.push('Suspicious mouse patterns');
  if (keyboardScore < 30) riskFactors.push('Unusual keyboard behavior');
  if (timingScore < 30) riskFactors.push('Abnormal timing patterns');
  if (responseTime < 500) riskFactors.push('Response too fast');
  if (anomalyScore > 70) riskFactors.push('High anomaly score');
  
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Headless') || userAgent.includes('Selenium')) {
    riskFactors.push('Automation framework detected');
  }
  
  return riskFactors;
};

const calculateHumanConfidence = (
  mouseScore: number,
  keyboardScore: number,
  timingScore: number,
  behavioralConsistency: number,
  environmentalRealism: number,
  interactionNaturalness: number,
  anomalyScore: number,
  riskFactorCount: number,
  challengeType: string
): number => {
  // Weighted scoring
  const weights = {
    mouse: 0.25,
    keyboard: 0.15,
    timing: 0.15,
    behavioral: 0.15,
    environmental: 0.1,
    interaction: 0.1,
    anomaly: 0.1
  };
  
  const normalizedScores = {
    mouse: mouseScore / 100,
    keyboard: keyboardScore / 100,
    timing: timingScore / 100,
    behavioral: behavioralConsistency / 100,
    environmental: environmentalRealism / 100,
    interaction: interactionNaturalness / 100,
    anomaly: 1 - (anomalyScore / 100)
  };
  
  let weightedScore = 
    normalizedScores.mouse * weights.mouse +
    normalizedScores.keyboard * weights.keyboard +
    normalizedScores.timing * weights.timing +
    normalizedScores.behavioral * weights.behavioral +
    normalizedScores.environmental * weights.environmental +
    normalizedScores.interaction * weights.interaction +
    normalizedScores.anomaly * weights.anomaly;
  
  // Risk factor penalty
  const riskPenalty = riskFactorCount * 0.05;
  weightedScore = Math.max(0, weightedScore - riskPenalty);
  
  return weightedScore;
};

const createDefaultBotDetectionResult = (): BotDetectionResult => {
  return {
    isHuman: false,
    confidence: 0.5,
    signals: {
      mouseAnalysis: 50,
      keyboardAnalysis: 50,
      timingAnalysis: 50,
      behavioralConsistency: 50,
      environmentalRealism: 50,
      interactionNaturalness: 50,
      anomalyScore: 50
    },
    riskFactors: ['Insufficient data for analysis'],
    adaptiveAction: 'maintain_difficulty'
  };
};

// Helper functions
const initializeFingerprinting = async (sessionId: string): Promise<void> => {
  try {
    const session = activeSessions.get(sessionId);
    if (!session) return;
    
    const fp = await FingerprintJS.load();
    const result: GetResult = await fp.get();
    
    session.fingerprint = result.visitorId;
    activeSessions.set(sessionId, session);
  } catch (error) {
    console.warn('Error initializing fingerprinting:', error);
  }
};

const getBrowserInfo = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  
  return 'Unknown';
};

const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iPad/.test(userAgent) || (/Android/.test(userAgent) && !/Mobile/.test(userAgent))) {
    return 'Tablet';
  }
  if (/iPhone|iPod|Android|Windows Phone/.test(userAgent) && /Mobile/.test(userAgent)) {
    return 'Mobile';
  }
  
  return 'Desktop';
};

const calculateVariance = (numbers: number[]): number => {
  if (numbers.length <= 1) return 0;
  
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
};

// Get detailed behavior analysis for debugging
export const getDetailedBehaviorAnalysis = (sessionId: string): any => {
  if (!sessionId || !activeSessions.has(sessionId)) {
    return { error: 'Session not found' };
  }
  
  const session = activeSessions.get(sessionId);
  if (!session) {
    return { error: 'Session data not available' };
  }
  
  const patterns = behavioralPatterns.get(sessionId) || [];
  
  return {
    sessionId,
    sessionDuration: Date.now() - session.startTime,
    interactionCount: session.interactions.length,
    deviceInfo: session.deviceInfo,
    patterns: patterns.slice(-10),
    mouseMovements: session.interactions.filter(i => i.type === 'mousemove').length,
    keyboardEvents: session.interactions.filter(i => i.type === 'keydown' || i.type === 'keyup').length,
    clicks: session.interactions.filter(i => i.type === 'click').length,
    scrolls: session.interactions.filter(i => i.type === 'scroll').length
  };
};