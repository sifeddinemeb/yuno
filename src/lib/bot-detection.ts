/**
 * Advanced bot detection system with ML-based behavioral analysis
 * Implements comprehensive behavioral pattern recognition for human verification
 */

import FingerprintJS, { GetResult } from '@fingerprintjs/fingerprintjs';
import { kmeans } from 'ml-kmeans';
import { Matrix } from 'ml-matrix';
// Note: ml-distance euclidean function - using manual implementation for compatibility

// Types
import { BotDetectionResult, SessionData } from '../types';

// Session tracking
const activeSessions: Map<string, SessionData> = new Map();
const behavioralPatterns: Map<string, any[]> = new Map();

// ML model state
let mlModelTrained = false;
let mousePatternClusters: any = null;
let keyboardPatternClusters: any = null;
let timingPatternClusters: any = null;

// Initialize bot detection for a session
export const initializeBotDetection = (sessionId: string): void => {
  if (!sessionId) return;
  
  // Create new session data
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
  
  // Store session data
  activeSessions.set(sessionId, sessionData);
  behavioralPatterns.set(sessionId, []);
  
  // Initialize fingerprinting
  initializeFingerprinting(sessionId);
  
  console.log(`Bot detection initialized for session: ${sessionId}`);
};

// Track user interactions for behavioral analysis
export const trackUserInteraction = (sessionId: string, eventData: any): void => {
  if (!sessionId || !activeSessions.has(sessionId)) return;
  
  const session = activeSessions.get(sessionId);
  if (!session) return;
  
  // Add timestamp if not provided
  if (!eventData.data?.timestamp) {
    eventData.data = {
      ...eventData.data,
      timestamp: Date.now()
    };
  }
  
  // Store interaction data
  session.interactions.push(eventData);
  
  // Process behavioral patterns in real-time
  processBehavioralPatterns(sessionId, eventData);
};

// Perform comprehensive bot detection analysis
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
  
  // Extract behavioral features
  const features = extractBehavioralFeatures(session);
  
  // Analyze mouse movement patterns
  const mouseAnalysis = analyzeMouseMovements(session);
  
  // Analyze keyboard dynamics
  const keyboardAnalysis = analyzeKeyboardDynamics(session);
  
  // Analyze timing patterns
  const timingAnalysis = analyzeTimingPatterns(session, responseTime);
  
  // Analyze behavioral consistency
  const behavioralConsistency = analyzeBehavioralConsistency(session);
  
  // Analyze environmental realism
  const environmentalRealism = analyzeEnvironmentalRealism(session);
  
  // Analyze interaction naturalness
  const interactionNaturalness = analyzeInteractionNaturalness(session);
  
  // Calculate anomaly score
  const anomalyScore = calculateAnomalyScore(features);
  
  // Identify risk factors
  const riskFactors = identifyRiskFactors(
    session,
    mouseAnalysis,
    keyboardAnalysis,
    timingAnalysis,
    responseTime,
    anomalyScore
  );
  
  // Calculate final human confidence score
  let humanScore = calculateHumanConfidence(
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
  
  // Determine adaptive action based on confidence
  const adaptiveAction = determineAdaptiveAction(humanScore, riskFactors.length);
  
  // Final result
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
    adaptiveAction
  };
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
  
  const features = extractBehavioralFeatures(session);
  const patterns = behavioralPatterns.get(sessionId) || [];
  
  return {
    sessionId,
    sessionDuration: Date.now() - session.startTime,
    interactionCount: session.interactions.length,
    deviceInfo: session.deviceInfo,
    features,
    patterns: patterns.slice(-10), // Last 10 patterns
    mouseMovements: countInteractionsByType(session, 'mousemove'),
    keyboardEvents: countInteractionsByType(session, 'keydown') + countInteractionsByType(session, 'keyup'),
    clicks: countInteractionsByType(session, 'click'),
    scrolls: countInteractionsByType(session, 'scroll'),
    focusEvents: countInteractionsByType(session, 'focus') + countInteractionsByType(session, 'blur'),
    idleEvents: countInteractionsByType(session, 'idle'),
    touchEvents: countInteractionsByType(session, 'touchstart') + countInteractionsByType(session, 'touchmove')
  };
};

// Initialize fingerprinting for session
const initializeFingerprinting = async (sessionId: string): Promise<void> => {
  try {
    const session = activeSessions.get(sessionId);
    if (!session) return;
    
    // Use FingerprintJS for stable fingerprinting
    const fp = await FingerprintJS.load();
    const result: GetResult = await fp.get();
    
    // Store fingerprint
    session.fingerprint = result.visitorId;
    
    // Update session
    activeSessions.set(sessionId, session);
  } catch (error) {
    console.warn('Error initializing fingerprinting:', error);
  }
};

// Process behavioral patterns in real-time
const processBehavioralPatterns = (sessionId: string, eventData: any): void => {
  if (!sessionId || !behavioralPatterns.has(sessionId)) return;
  
  const patterns = behavioralPatterns.get(sessionId) || [];
  
  // Process different event types
  switch (eventData.type) {
    case 'mousemove':
      processMouseMovement(patterns, eventData);
      break;
    case 'keydown':
    case 'keyup':
      processKeyboardEvent(patterns, eventData);
      break;
    case 'click':
      processClickEvent(patterns, eventData);
      break;
    case 'scroll':
      processScrollEvent(patterns, eventData);
      break;
    case 'idle':
      processIdleEvent(patterns, eventData);
      break;
  }
  
  // Update patterns
  behavioralPatterns.set(sessionId, patterns);
};

// Process mouse movement patterns
const processMouseMovement = (patterns: any[], eventData: any): void => {
  const { x, y, timestamp } = eventData.data;
  
  // Store current position
  if (patterns.length > 0) {
    const lastPattern = patterns[patterns.length - 1];
    
    if (lastPattern.type === 'mouse_trajectory' && 
        lastPattern.points.length < 100 && 
        timestamp - lastPattern.lastTimestamp < 500) {
      // Add to existing trajectory
      lastPattern.points.push({ x, y, timestamp });
      lastPattern.lastTimestamp = timestamp;
      
      // Calculate velocity and acceleration
      if (lastPattern.points.length >= 2) {
        const current = lastPattern.points[lastPattern.points.length - 1];
        const previous = lastPattern.points[lastPattern.points.length - 2];
        
        const timeDiff = current.timestamp - previous.timestamp;
        if (timeDiff > 0) {
          const dx = current.x - previous.x;
          const dy = current.y - previous.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const velocity = distance / timeDiff;
          
          lastPattern.velocities.push(velocity);
          
          // Calculate acceleration if we have at least 2 velocities
          if (lastPattern.velocities.length >= 2) {
            const currentVelocity = lastPattern.velocities[lastPattern.velocities.length - 1];
            const previousVelocity = lastPattern.velocities[lastPattern.velocities.length - 2];
            const acceleration = (currentVelocity - previousVelocity) / timeDiff;
            lastPattern.accelerations.push(acceleration);
          }
        }
      }
    } else {
      // Start new trajectory
      patterns.push({
        type: 'mouse_trajectory',
        points: [{ x, y, timestamp }],
        lastTimestamp: timestamp,
        velocities: [],
        accelerations: []
      });
    }
  } else {
    // First trajectory
    patterns.push({
      type: 'mouse_trajectory',
      points: [{ x, y, timestamp }],
      lastTimestamp: timestamp,
      velocities: [],
      accelerations: []
    });
  }
};

// Process keyboard events
const processKeyboardEvent = (patterns: any[], eventData: any): void => {
  const { key, code, repeat, timestamp } = eventData.data;
  
  // Skip modifier keys
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) return;
  
  // Store keyboard event
  if (eventData.type === 'keydown') {
    // Find existing key press or create new one
    const existingKeyPressIndex = patterns.findIndex(
      p => p.type === 'key_press' && p.key === key && !p.keyUpTimestamp
    );
    
    if (existingKeyPressIndex >= 0) {
      // Update existing key press for repeats
      if (repeat) {
        patterns[existingKeyPressIndex].repeatCount++;
      }
    } else {
      // New key press
      patterns.push({
        type: 'key_press',
        key,
        code,
        keyDownTimestamp: timestamp,
        keyUpTimestamp: null,
        repeatCount: repeat ? 1 : 0
      });
    }
  } else if (eventData.type === 'keyup') {
    // Find matching keydown event
    const keyPressIndex = patterns.findIndex(
      p => p.type === 'key_press' && p.key === key && !p.keyUpTimestamp
    );
    
    if (keyPressIndex >= 0) {
      // Complete key press data
      patterns[keyPressIndex].keyUpTimestamp = timestamp;
      patterns[keyPressIndex].duration = timestamp - patterns[keyPressIndex].keyDownTimestamp;
    }
  }
  
  // Analyze typing rhythm if we have enough key presses
  const keyPresses = patterns.filter(p => p.type === 'key_press' && p.keyUpTimestamp);
  if (keyPresses.length >= 3) {
    // Calculate inter-key intervals
    const intervals = [];
    for (let i = 1; i < keyPresses.length; i++) {
      const interval = keyPresses[i].keyDownTimestamp - keyPresses[i-1].keyDownTimestamp;
      if (interval > 0 && interval < 2000) { // Filter out unreasonable intervals
        intervals.push(interval);
      }
    }
    
    // Store typing rhythm pattern
    if (intervals.length >= 2) {
      const existingRhythmIndex = patterns.findIndex(p => p.type === 'typing_rhythm');
      
      if (existingRhythmIndex >= 0) {
        // Update existing rhythm
        patterns[existingRhythmIndex].intervals = intervals;
        patterns[existingRhythmIndex].lastUpdated = timestamp;
      } else {
        // New rhythm pattern
        patterns.push({
          type: 'typing_rhythm',
          intervals,
          lastUpdated: timestamp
        });
      }
    }
  }
};

// Process click events
const processClickEvent = (patterns: any[], eventData: any): void => {
  const { x, y, button, timestamp } = eventData.data;
  
  // Store click event
  patterns.push({
    type: 'click',
    x,
    y,
    button,
    timestamp
  });
  
  // Analyze click patterns
  const clicks = patterns.filter(p => p.type === 'click');
  if (clicks.length >= 3) {
    // Calculate click intervals
    const intervals = [];
    for (let i = 1; i < clicks.length; i++) {
      const interval = clicks[i].timestamp - clicks[i-1].timestamp;
      if (interval > 0 && interval < 10000) { // Filter out unreasonable intervals
        intervals.push(interval);
      }
    }
    
    // Store click pattern
    if (intervals.length >= 2) {
      const existingPatternIndex = patterns.findIndex(p => p.type === 'click_pattern');
      
      if (existingPatternIndex >= 0) {
        // Update existing pattern
        patterns[existingPatternIndex].intervals = intervals;
        patterns[existingPatternIndex].lastUpdated = timestamp;
      } else {
        // New pattern
        patterns.push({
          type: 'click_pattern',
          intervals,
          lastUpdated: timestamp
        });
      }
    }
  }
};

// Process scroll events
const processScrollEvent = (patterns: any[], eventData: any): void => {
  const { scrollTop, scrollLeft, timestamp } = eventData.data;
  
  // Store scroll event
  patterns.push({
    type: 'scroll',
    scrollTop,
    scrollLeft,
    timestamp
  });
};

// Process idle events
const processIdleEvent = (patterns: any[], eventData: any): void => {
  const { duration, timestamp } = eventData.data;
  
  // Store idle event
  patterns.push({
    type: 'idle',
    duration,
    timestamp
  });
};

// Extract behavioral features for ML analysis
const extractBehavioralFeatures = (session: SessionData): number[] => {
  const features = [];
  
  // Mouse movement features
  const mouseTrajectories = session.interactions.filter(i => i.type === 'mousemove');
  const mouseFeatures = extractMouseFeatures(mouseTrajectories);
  features.push(...mouseFeatures);
  
  // Keyboard features
  const keyboardEvents = session.interactions.filter(i => i.type === 'keydown' || i.type === 'keyup');
  const keyboardFeatures = extractKeyboardFeatures(keyboardEvents);
  features.push(...keyboardFeatures);
  
  // Timing features
  const timingFeatures = extractTimingFeatures(session.interactions);
  features.push(...timingFeatures);
  
  // Interaction density features
  const interactionFeatures = extractInteractionFeatures(session);
  features.push(...interactionFeatures);
  
  return features;
};

// Extract mouse movement features
const extractMouseFeatures = (mouseEvents: any[]): number[] => {
  if (mouseEvents.length < 5) {
    return [0, 0, 0, 0, 0]; // Default values if not enough data
  }
  
  // Calculate velocities
  const velocities = [];
  for (let i = 1; i < mouseEvents.length; i++) {
    const current = mouseEvents[i].data;
    const previous = mouseEvents[i-1].data;
    
    const timeDiff = current.timestamp - previous.timestamp;
    if (timeDiff > 0) {
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = distance / timeDiff;
      
      velocities.push(velocity);
    }
  }
  
  // Calculate accelerations
  const accelerations = [];
  for (let i = 1; i < velocities.length; i++) {
    const timeDiff = mouseEvents[i+1].data.timestamp - mouseEvents[i].data.timestamp;
    if (timeDiff > 0) {
      const acceleration = (velocities[i] - velocities[i-1]) / timeDiff;
      accelerations.push(acceleration);
    }
  }
  
  // Calculate jerk (rate of change of acceleration)
  const jerks = [];
  for (let i = 1; i < accelerations.length; i++) {
    const timeDiff = mouseEvents[i+2].data.timestamp - mouseEvents[i+1].data.timestamp;
    if (timeDiff > 0) {
      const jerk = (accelerations[i] - accelerations[i-1]) / timeDiff;
      jerks.push(jerk);
    }
  }
  
  // Calculate curvature
  const curvatures = [];
  for (let i = 2; i < mouseEvents.length; i++) {
    const p1 = mouseEvents[i-2].data;
    const p2 = mouseEvents[i-1].data;
    const p3 = mouseEvents[i].data;
    
    const dx1 = p2.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dx2 = p3.x - p2.x;
    const dy2 = p3.y - p2.y;
    
    // Avoid division by zero
    if (dx1 === 0 || dy1 === 0 || dx2 === 0 || dy2 === 0) continue;
    
    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);
    const angleDiff = Math.abs(angle2 - angle1);
    
    curvatures.push(angleDiff);
  }
  
  // Calculate statistics
  const avgVelocity = velocities.length > 0 
    ? velocities.reduce((sum, v) => sum + v, 0) / velocities.length 
    : 0;
  
  const avgAcceleration = accelerations.length > 0 
    ? accelerations.reduce((sum, a) => sum + a, 0) / accelerations.length 
    : 0;
  
  const avgJerk = jerks.length > 0 
    ? jerks.reduce((sum, j) => sum + j, 0) / jerks.length 
    : 0;
  
  const avgCurvature = curvatures.length > 0 
    ? curvatures.reduce((sum, c) => sum + c, 0) / curvatures.length 
    : 0;
  
  const velocityVariance = calculateVariance(velocities, avgVelocity);
  
  return [
    avgVelocity,
    avgAcceleration,
    avgJerk,
    avgCurvature,
    velocityVariance
  ];
};

// Extract keyboard dynamics features
const extractKeyboardFeatures = (keyboardEvents: any[]): number[] => {
  if (keyboardEvents.length < 5) {
    return [0, 0, 0]; // Default values if not enough data
  }
  
  // Find key press pairs (keydown + keyup)
  const keyPresses = [];
  const keyDownEvents = keyboardEvents.filter(e => e.type === 'keydown');
  
  for (const keyDown of keyDownEvents) {
    const keyUp = keyboardEvents.find(e => 
      e.type === 'keyup' && 
      e.data.key === keyDown.data.key && 
      e.data.timestamp > keyDown.data.timestamp
    );
    
    if (keyUp) {
      keyPresses.push({
        key: keyDown.data.key,
        duration: keyUp.data.timestamp - keyDown.data.timestamp,
        keyDownTime: keyDown.data.timestamp,
        keyUpTime: keyUp.data.timestamp
      });
    }
  }
  
  // Calculate key press durations
  const durations = keyPresses.map(kp => kp.duration);
  
  // Calculate inter-key intervals
  const intervals = [];
  for (let i = 1; i < keyPresses.length; i++) {
    const interval = keyPresses[i].keyDownTime - keyPresses[i-1].keyUpTime;
    if (interval > 0 && interval < 2000) { // Filter out unreasonable intervals
      intervals.push(interval);
    }
  }
  
  // Calculate statistics
  const avgDuration = durations.length > 0 
    ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
    : 0;
  
  const avgInterval = intervals.length > 0 
    ? intervals.reduce((sum, i) => sum + i, 0) / intervals.length 
    : 0;
  
  const durationVariance = calculateVariance(durations, avgDuration);
  
  return [
    avgDuration,
    avgInterval,
    durationVariance
  ];
};

// Extract timing features
const extractTimingFeatures = (interactions: any[]): number[] => {
  if (interactions.length < 5) {
    return [0, 0]; // Default values if not enough data
  }
  
  // Calculate intervals between all interactions
  const intervals = [];
  for (let i = 1; i < interactions.length; i++) {
    const current = interactions[i];
    const previous = interactions[i-1];
    
    const currentTime = current.data?.timestamp || 0;
    const previousTime = previous.data?.timestamp || 0;
    
    if (currentTime > previousTime) {
      intervals.push(currentTime - previousTime);
    }
  }
  
  // Calculate statistics
  const avgInterval = intervals.length > 0 
    ? intervals.reduce((sum, i) => sum + i, 0) / intervals.length 
    : 0;
  
  const intervalVariance = calculateVariance(intervals, avgInterval);
  
  return [
    avgInterval,
    intervalVariance
  ];
};

// Extract interaction density features
const extractInteractionFeatures = (session: SessionData): number[] => {
  const interactions = session.interactions;
  if (interactions.length < 5) {
    return [0, 0]; // Default values if not enough data
  }
  
  // Calculate session duration
  const sessionDuration = Date.now() - session.startTime;
  
  // Calculate interaction density (interactions per second)
  const density = interactions.length / (sessionDuration / 1000);
  
  // Count interaction types
  const mouseEvents = interactions.filter(i => i.type === 'mousemove').length;
  const keyboardEvents = interactions.filter(i => i.type === 'keydown' || i.type === 'keyup').length;
  const clickEvents = interactions.filter(i => i.type === 'click').length;
  const scrollEvents = interactions.filter(i => i.type === 'scroll').length;
  
  // Calculate interaction type ratio
  const mouseRatio = mouseEvents / interactions.length;
  const keyboardRatio = keyboardEvents / interactions.length;
  
  return [
    density,
    mouseRatio,
    keyboardRatio
  ];
};

// Analyze mouse movements for bot detection
const analyzeMouseMovements = (session: SessionData): number => {
  const mouseTrajectories = session.interactions.filter(i => i.type === 'mousemove');
  
  if (mouseTrajectories.length < 10) {
    return 50; // Not enough data, return neutral score
  }
  
  // Extract features
  const features = extractMouseFeatures(mouseTrajectories);
  
  // Compare to known human patterns
  let humanScore = compareToMousePatterns(features);
  
  // Adjust score based on specific bot indicators
  
  // Check for perfectly straight lines
  if (features[3] < 0.01) { // Very low curvature
    humanScore -= 20;
  }
  
  // Check for uniform velocity (bot-like)
  if (features[4] < 0.1) { // Very low velocity variance
    humanScore -= 20;
  }
  
  // Check for natural mouse acceleration
  if (features[1] > 0.01 && features[1] < 0.5) { // Natural acceleration range
    humanScore += 10;
  }
  
  // Check for natural jerk (human-like)
  if (features[2] > 0.001 && features[2] < 0.1) { // Natural jerk range
    humanScore += 10;
  }
  
  // Bound score to 0-100 range
  return Math.max(0, Math.min(100, humanScore));
};

// Compare mouse features to known patterns
const compareToMousePatterns = (features: number[]): number => {
  // Default human-like score
  let humanScore = 50;
  
  // If ML model is trained, use it
  if (mlModelTrained && mousePatternClusters) {
    try {
      // Find closest cluster
      const distances = mousePatternClusters.centroids.map((centroid: number[]) => 
        calculateEuclideanDistance(features, centroid)
      );
      
      const closestCluster = distances.indexOf(Math.min(...distances));
      
      // Adjust score based on cluster (0 = bot-like, 1 = human-like)
      if (closestCluster === 1) {
        humanScore += 20;
      } else {
        humanScore -= 20;
      }
    } catch (error) {
      console.warn('Error comparing mouse patterns:', error);
    }
  } else {
    // Use heuristics if ML model not trained
    
    // Check velocity (pixels/ms)
    if (features[0] > 0.1 && features[0] < 1.0) {
      humanScore += 10; // Natural velocity range
    }
    
    // Check acceleration
    if (features[1] > 0.0001 && features[1] < 0.01) {
      humanScore += 10; // Natural acceleration range
    }
    
    // Check curvature
    if (features[3] > 0.05) {
      humanScore += 10; // Natural curvature (not too straight)
    }
    
    // Check velocity variance
    if (features[4] > 0.2) {
      humanScore += 10; // Natural variance in speed
    }
  }
  
  return humanScore;
};

// Analyze keyboard dynamics for bot detection
const analyzeKeyboardDynamics = (session: SessionData): number => {
  const keyboardEvents = session.interactions.filter(i => i.type === 'keydown' || i.type === 'keyup');
  
  if (keyboardEvents.length < 5) {
    return 50; // Not enough data, return neutral score
  }
  
  // Extract features
  const features = extractKeyboardFeatures(keyboardEvents);
  
  // Default human-like score
  let humanScore = 50;
  
  // If ML model is trained, use it
  if (mlModelTrained && keyboardPatternClusters) {
    try {
      // Find closest cluster
      const distances = keyboardPatternClusters.centroids.map((centroid: number[]) => 
        calculateEuclideanDistance(features, centroid)
      );
      
      const closestCluster = distances.indexOf(Math.min(...distances));
      
      // Adjust score based on cluster (0 = bot-like, 1 = human-like)
      if (closestCluster === 1) {
        humanScore += 20;
      } else {
        humanScore -= 20;
      }
    } catch (error) {
      console.warn('Error comparing keyboard patterns:', error);
    }
  } else {
    // Use heuristics if ML model not trained
    
    // Check key press duration
    if (features[0] > 50 && features[0] < 200) {
      humanScore += 10; // Natural key press duration range (ms)
    }
    
    // Check inter-key interval
    if (features[1] > 100 && features[1] < 500) {
      humanScore += 10; // Natural typing rhythm range (ms)
    }
    
    // Check duration variance
    if (features[2] > 100) {
      humanScore += 10; // Natural variance in key press duration
    }
  }
  
  return humanScore;
};

// Analyze timing patterns for bot detection
const analyzeTimingPatterns = (session: SessionData, responseTime: number): number => {
  const interactions = session.interactions;
  
  if (interactions.length < 5) {
    return 50; // Not enough data, return neutral score
  }
  
  // Extract features
  const features = extractTimingFeatures(interactions);
  
  // Default human-like score
  let humanScore = 50;
  
  // If ML model is trained, use it
  if (mlModelTrained && timingPatternClusters) {
    try {
      // Find closest cluster
      const distances = timingPatternClusters.centroids.map((centroid: number[]) => 
        calculateEuclideanDistance([...features, responseTime], [...centroid, 0])
      );
      
      const closestCluster = distances.indexOf(Math.min(...distances));
      
      // Adjust score based on cluster (0 = bot-like, 1 = human-like)
      if (closestCluster === 1) {
        humanScore += 20;
      } else {
        humanScore -= 20;
      }
    } catch (error) {
      console.warn('Error comparing timing patterns:', error);
    }
  } else {
    // Use heuristics if ML model not trained
    
    // Check average interval between interactions
    if (features[0] > 100 && features[0] < 2000) {
      humanScore += 10; // Natural interaction interval range (ms)
    }
    
    // Check interval variance
    if (features[1] > 10000) {
      humanScore += 10; // Natural variance in interaction timing
    }
    
    // Check response time
    if (responseTime > 2000 && responseTime < 30000) {
      humanScore += 10; // Natural response time range (ms)
    }
  }
  
  return humanScore;
};

// Analyze behavioral consistency
const analyzeBehavioralConsistency = (session: SessionData): number => {
  const interactions = session.interactions;
  
  if (interactions.length < 10) {
    return 50; // Not enough data, return neutral score
  }
  
  // Default human-like score
  let humanScore = 50;
  
  // Check for consistent behavior patterns
  
  // Check for pauses/thinking time
  const hasNaturalPauses = interactions.some(i => i.type === 'idle' && i.data.duration > 1000);
  if (hasNaturalPauses) {
    humanScore += 10;
  }
  
  // Check for corrections (backspace usage)
  const hasCorrections = interactions.some(i => i.type === 'keydown' && i.data.key === 'Backspace');
  if (hasCorrections) {
    humanScore += 10;
  }
  
  // Check for natural focus/blur patterns
  const hasFocusEvents = interactions.some(i => i.type === 'focus' || i.type === 'blur');
  if (hasFocusEvents) {
    humanScore += 5;
  }
  
  // Check for varied interaction types
  const interactionTypes = new Set(interactions.map(i => i.type));
  if (interactionTypes.size >= 3) {
    humanScore += 5;
  }
  
  // Check for bot-like patterns
  
  // Check for too regular intervals
  const intervals = [];
  for (let i = 1; i < interactions.length; i++) {
    const current = interactions[i];
    const previous = interactions[i-1];
    
    const currentTime = current.data?.timestamp || 0;
    const previousTime = previous.data?.timestamp || 0;
    
    if (currentTime > previousTime) {
      intervals.push(currentTime - previousTime);
    }
  }
  
  if (intervals.length > 5) {
    const intervalVariance = calculateVariance(intervals, 
      intervals.reduce((sum, i) => sum + i, 0) / intervals.length
    );
    
    // Too regular intervals (low variance) are bot-like
    if (intervalVariance < 1000) {
      humanScore -= 20;
    }
  }
  
  return Math.max(0, Math.min(100, humanScore));
};

// Analyze environmental realism
const analyzeEnvironmentalRealism = (session: SessionData): number => {
  // Default human-like score
  let humanScore = 50;
  
  // Check for browser/device consistency
  const { platform, browser, deviceType } = session.deviceInfo;
  
  // Check for browser inconsistencies
  const userAgent = navigator.userAgent;
  
  // Check for automation frameworks
  const hasAutomationIndicators = 
    userAgent.includes('Headless') || 
    userAgent.includes('Selenium') || 
    userAgent.includes('Puppeteer') || 
    userAgent.includes('PhantomJS') || 
    userAgent.includes('Playwright');
  
  if (hasAutomationIndicators) {
    humanScore -= 30;
  }
  
  // Check for WebDriver
  if ('webdriver' in navigator && (navigator as any).webdriver) {
    humanScore -= 30;
  }
  
  // Check for plugins (bots typically have none)
  const hasPlugins = navigator.plugins.length > 0;
  if (hasPlugins) {
    humanScore += 10;
  }
  
  // Check for touch support on mobile
  const isMobile = deviceType === 'Mobile' || deviceType === 'Tablet';
  const hasTouch = 'ontouchstart' in window;
  
  if ((isMobile && !hasTouch) || (!isMobile && hasTouch && !isModernDevice())) {
    humanScore -= 10; // Inconsistent touch capability
  }
  
  // Check for reasonable screen dimensions
  const hasReasonableScreen = screen.width > 320 && screen.height > 320;
  if (hasReasonableScreen) {
    humanScore += 10;
  } else {
    humanScore -= 10;
  }
  
  return Math.max(0, Math.min(100, humanScore));
};

// Analyze interaction naturalness
const analyzeInteractionNaturalness = (session: SessionData): number => {
  const interactions = session.interactions;
  
  if (interactions.length < 5) {
    return 50; // Not enough data, return neutral score
  }
  
  // Default human-like score
  let humanScore = 50;
  
  // Check for natural interaction patterns
  
  // Check for hover before click
  const clicks = interactions.filter(i => i.type === 'click');
  let naturalClickCount = 0;
  
  for (const click of clicks) {
    // Find mousemove events just before this click
    const priorMoves = interactions.filter(i => 
      i.type === 'mousemove' && 
      i.data.timestamp < click.data.timestamp && 
      i.data.timestamp > click.data.timestamp - 1000 // Within 1 second
    );
    
    if (priorMoves.length > 0) {
      naturalClickCount++;
    }
  }
  
  if (clicks.length > 0) {
    const naturalClickRatio = naturalClickCount / clicks.length;
    if (naturalClickRatio > 0.7) {
      humanScore += 15;
    }
  }
  
  // Check for natural scroll behavior
  const scrolls = interactions.filter(i => i.type === 'scroll');
  if (scrolls.length >= 2) {
    let naturalScrollCount = 0;
    
    for (let i = 1; i < scrolls.length; i++) {
      const current = scrolls[i];
      const previous = scrolls[i-1];
      
      // Natural scrolling has some variation but not too much
      const scrollDiff = Math.abs(current.data.scrollTop - previous.data.scrollTop);
      if (scrollDiff > 5 && scrollDiff < 1000) {
        naturalScrollCount++;
      }
    }
    
    const naturalScrollRatio = naturalScrollCount / (scrolls.length - 1);
    if (naturalScrollRatio > 0.7) {
      humanScore += 10;
    }
  }
  
  // Check for varied interaction sequence
  const interactionSequence = interactions.map(i => i.type).join('|');
  const hasRepeatingPattern = detectRepeatingPattern(interactionSequence);
  
  if (hasRepeatingPattern) {
    humanScore -= 20; // Bot-like repeating pattern
  }
  
  return Math.max(0, Math.min(100, humanScore));
};

// Calculate anomaly score
const calculateAnomalyScore = (features: number[]): number => {
  // Default anomaly score (0-100, higher means more anomalous)
  let anomalyScore = 0;
  
  // If we have enough data, use ML-based anomaly detection
  if (features.length >= 5 && mlModelTrained) {
    try {
      // Calculate distance to human cluster centroid
      const humanCentroid = [0.5, 0.005, 0.0005, 0.1, 1000, 150, 200, 5000, 0.5, 0.3, 0.2];
      const distance = calculateEuclideanDistance(
        features.slice(0, Math.min(features.length, humanCentroid.length)),
        humanCentroid.slice(0, Math.min(features.length, humanCentroid.length))
      );
      
      // Normalize distance to 0-100 scale
      anomalyScore = Math.min(100, distance * 20);
    } catch (error) {
      console.warn('Error calculating anomaly score:', error);
      
      // Fallback to heuristic approach
      anomalyScore = 50; // Neutral score
    }
  } else {
    // Use heuristic approach for anomaly detection
    
    // Check for extreme values in features
    let extremeValueCount = 0;
    
    // Mouse velocity (pixels/ms)
    if (features[0] > 2.0 || features[0] < 0.01) extremeValueCount++;
    
    // Mouse acceleration
    if (features[1] > 0.05 || features[1] < 0.00001) extremeValueCount++;
    
    // Mouse jerk
    if (features[2] > 0.01 || features[2] < 0.000001) extremeValueCount++;
    
    // Mouse curvature
    if (features[3] < 0.01) extremeValueCount++; // Too straight
    
    // Keyboard timing
    if (features.length > 5) {
      // Key press duration
      if (features[5] < 10 || features[5] > 500) extremeValueCount++;
      
      // Inter-key interval
      if (features[6] < 50 || features[6] > 1000) extremeValueCount++;
    }
    
    // Calculate anomaly score based on extreme values
    anomalyScore = extremeValueCount * 20;
  }
  
  return Math.max(0, Math.min(100, anomalyScore));
};

// Identify risk factors for bot detection
const identifyRiskFactors = (
  session: SessionData,
  mouseScore: number,
  keyboardScore: number,
  timingScore: number,
  responseTime: number,
  anomalyScore: number
): string[] => {
  const riskFactors = [];
  
  // Mouse movement risk factors
  if (mouseScore < 30) {
    riskFactors.push('Suspicious mouse movement patterns');
  }
  
  // Keyboard dynamics risk factors
  if (keyboardScore < 30) {
    riskFactors.push('Unusual keyboard interaction patterns');
  }
  
  // Timing risk factors
  if (timingScore < 30) {
    riskFactors.push('Abnormal timing patterns');
  }
  
  // Response time risk factors
  if (responseTime < 500) {
    riskFactors.push('Response time too fast for human');
  }
  
  // Behavioral consistency risk factors
  const interactions = session.interactions;
  
  // Check for lack of natural pauses
  const hasNoPauses = !interactions.some(i => i.type === 'idle');
  if (hasNoPauses && interactions.length > 20) {
    riskFactors.push('No natural pauses in interaction');
  }
  
  // Check for too regular intervals
  const intervals = [];
  for (let i = 1; i < interactions.length; i++) {
    const current = interactions[i];
    const previous = interactions[i-1];
    
    const currentTime = current.data?.timestamp || 0;
    const previousTime = previous.data?.timestamp || 0;
    
    if (currentTime > previousTime) {
      intervals.push(currentTime - previousTime);
    }
  }
  
  if (intervals.length > 5) {
    const intervalVariance = calculateVariance(intervals, 
      intervals.reduce((sum, i) => sum + i, 0) / intervals.length
    );
    
    // Too regular intervals (low variance) are bot-like
    if (intervalVariance < 1000) {
      riskFactors.push('Too regular interaction timing');
    }
  }
  
  // Check for perfect straight line mouse movements
  const mouseTrajectories = interactions.filter(i => i.type === 'mousemove');
  if (mouseTrajectories.length > 10) {
    const straightLineCount = countStraightLines(mouseTrajectories);
    if (straightLineCount > 3) {
      riskFactors.push('Unnaturally straight mouse movements');
    }
  }
  
  // Check for anomaly score
  if (anomalyScore > 70) {
    riskFactors.push('High behavioral anomaly score');
  }
  
  // Environmental risk factors
  
  // Check for automation frameworks
  const userAgent = navigator.userAgent;
  if (
    userAgent.includes('Headless') || 
    userAgent.includes('Selenium') || 
    userAgent.includes('Puppeteer') || 
    userAgent.includes('PhantomJS') || 
    userAgent.includes('Playwright')
  ) {
    riskFactors.push('Automation framework detected');
  }
  
  // Check for WebDriver
  if ('webdriver' in navigator && (navigator as any).webdriver) {
    riskFactors.push('WebDriver detected');
  }
  
  return riskFactors;
};

// Calculate final human confidence score
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
  // Base weights
  let weights = {
    mouse: 0.25,
    keyboard: 0.15,
    timing: 0.15,
    behavioral: 0.15,
    environmental: 0.1,
    interaction: 0.1,
    anomaly: 0.1
  };
  
  // Adjust weights based on challenge type
  switch (challengeType) {
    case 'PatternPlay':
    case 'PerceptionFlip':
      // Visual challenges rely more on mouse
      weights.mouse = 0.3;
      weights.keyboard = 0.1;
      break;
    case 'SocialDecoder':
    case 'EthicsPing':
      // Text-heavy challenges rely more on keyboard
      weights.keyboard = 0.25;
      weights.mouse = 0.15;
      break;
  }
  
  // Normalize scores to 0-1 range
  const normalizedScores = {
    mouse: mouseScore / 100,
    keyboard: keyboardScore / 100,
    timing: timingScore / 100,
    behavioral: behavioralConsistency / 100,
    environmental: environmentalRealism / 100,
    interaction: interactionNaturalness / 100,
    anomaly: 1 - (anomalyScore / 100) // Invert anomaly score
  };
  
  // Calculate weighted score
  let weightedScore = 
    normalizedScores.mouse * weights.mouse +
    normalizedScores.keyboard * weights.keyboard +
    normalizedScores.timing * weights.timing +
    normalizedScores.behavioral * weights.behavioral +
    normalizedScores.environmental * weights.environmental +
    normalizedScores.interaction * weights.interaction +
    normalizedScores.anomaly * weights.anomaly;
  
  // Penalize for risk factors
  const riskPenalty = riskFactorCount * 0.05;
  weightedScore = Math.max(0, weightedScore - riskPenalty);
  
  return weightedScore;
};

// Determine adaptive action based on confidence
const determineAdaptiveAction = (confidence: number, riskFactorCount: number): string => {
  if (confidence > 0.8 && riskFactorCount === 0) {
    return 'increase_difficulty';
  } else if (confidence < 0.4 || riskFactorCount > 2) {
    return 'decrease_difficulty';
  } else {
    return 'maintain_difficulty';
  }
};

// Create default bot detection result
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

// Calculate variance of an array
const calculateVariance = (array: number[], mean: number): number => {
  if (array.length <= 1) return 0;
  
  const squaredDiffs = array.map(value => {
    const diff = value - mean;
    return diff * diff;
  });
  
  const sum = squaredDiffs.reduce((sum, value) => sum + value, 0);
  return sum / array.length;
};

// Count interactions by type
const countInteractionsByType = (session: SessionData, type: string): number => {
  return session.interactions.filter(i => i.type === type).length;
};

// Count straight line segments in mouse movements
const countStraightLines = (mouseEvents: any[]): number => {
  let straightLineCount = 0;
  let currentLinePoints = [];
  
  for (let i = 0; i < mouseEvents.length; i++) {
    const current = mouseEvents[i].data;
    
    // Add point to current line
    currentLinePoints.push({ x: current.x, y: current.y });
    
    // Check if we have enough points to evaluate
    if (currentLinePoints.length >= 3) {
      // Check if points are collinear
      const isCollinear = checkCollinearity(currentLinePoints);
      
      if (!isCollinear) {
        // Line is not straight, start a new line
        currentLinePoints = [{ x: current.x, y: current.y }];
      } else if (currentLinePoints.length >= 10) {
        // Found a straight line with at least 10 points
        straightLineCount++;
        currentLinePoints = []; // Start fresh
      }
    }
  }
  
  return straightLineCount;
};

// Check if points are collinear (form a straight line)
const checkCollinearity = (points: { x: number, y: number }[]): boolean => {
  if (points.length < 3) return true;
  
  // Use first two points to establish a line
  const p1 = points[0];
  const p2 = points[1];
  
  // Check if all other points are on this line
  for (let i = 2; i < points.length; i++) {
    const p3 = points[i];
    
    // Calculate area of triangle formed by three points
    // If area is close to 0, points are collinear
    const area = Math.abs(
      (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2
    );
    
    // Allow small deviation due to pixel rounding
    if (area > 5) {
      return false;
    }
  }
  
  return true;
};

// Detect repeating patterns in a string
const detectRepeatingPattern = (str: string): boolean => {
  if (str.length < 10) return false;
  
  // Check for repeating substrings
  for (let len = 3; len <= str.length / 2; len++) {
    for (let i = 0; i <= str.length - 2 * len; i++) {
      const pattern = str.substring(i, i + len);
      const nextChunk = str.substring(i + len, i + 2 * len);
      
      if (pattern === nextChunk) {
        return true;
      }
    }
  }
  
  return false;
};

// Get browser information
const getBrowserInfo = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
  
  return 'Unknown';
};

// Get device type
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
  if (/Android/.test(userAgent)) return 'Android';
  if (/Windows Phone/.test(userAgent)) return 'Windows Phone';
  
  // Check for tablets
  if (/iPad/.test(userAgent) || (/Android/.test(userAgent) && !/Mobile/.test(userAgent))) {
    return 'Tablet';
  }
  
  // Check for mobile
  if (/iPhone|iPod|Android|Windows Phone/.test(userAgent) && /Mobile/.test(userAgent)) {
    return 'Mobile';
  }
  
  return 'Desktop';
};

// Check if device is a modern device that might have touch even if not mobile
const isModernDevice = (): boolean => {
  const modernBrowsers = [
    'Chrome/8', 'Chrome/9', 'Firefox/9', 'Safari/15', 'Edge/9'
  ];
  
  return modernBrowsers.some(browser => navigator.userAgent.includes(browser));
};

// Manual euclidean distance calculation for compatibility
const calculateEuclideanDistance = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
};