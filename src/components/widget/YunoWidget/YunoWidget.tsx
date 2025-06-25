import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { Challenge } from '../../../types';
import ChallengeRenderer from '../ChallengeRenderer/ChallengeRenderer';
import { widgetApi } from '../../../lib/widget-api';
import BehaviorTracker from '../BehaviorTracker/BehaviorTracker';
import { 
  initializeBotDetection, 
  performBotDetection, 
  getDetailedBehaviorAnalysis
} from '../../../lib/bot-detection';

interface YunoWidgetProps {
  onVerified?: (sessionId: string) => void;
  onFailed?: (sessionId: string) => void;
  onError?: (error: string) => void;
  theme?: 'auto' | 'dark' | 'light';
}

const YunoWidget = ({ onVerified, onFailed, onError, theme = 'auto' }: YunoWidgetProps) => {
  // Accessibility: manage focus when state changes
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<'idle' | 'loading' | 'challenge' | 'success' | 'failed' | 'error'>('idle');
  const [sessionId, setSessionId] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [botDetectionResults, setBotDetectionResults] = useState<any>(null);
  
  // Track start time for performance monitoring
  const startTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());
  const interactionStartedRef = useRef<boolean>(false);

  const maxRetries = 3;

  // Focus the container whenever the visual state changes for better screen-reader context
  useEffect(() => {
    if (containerRef.current) {
      // Use preventScroll where supported to avoid page jump on mount
      try {
        (containerRef.current as HTMLElement).focus({ preventScroll: true } as any);
      } catch {
        containerRef.current.focus();
      }
    }
  }, [state]);

  useEffect(() => {
    // Initialize session with enhanced fingerprinting
    const initializeSession = async () => {
      try {
        // Generate session ID
        const newSessionId = crypto.randomUUID();
        setSessionId(newSessionId);
        sessionStartTimeRef.current = Date.now();
        
        // Initialize advanced bot detection
        initializeBotDetection(newSessionId);
        
        // Generate enhanced session fingerprint for bot detection
        const fingerprint = widgetApi.generateSessionFingerprint();
        console.log('Enhanced session fingerprint:', fingerprint.substring(0, 10) + '...');
        
        // Get initial challenge difficulty based on device characteristics
        const initialDifficulty = await widgetApi.getAdaptiveChallengeDifficulty(newSessionId);
        setCurrentDifficulty(initialDifficulty);
      } catch (err) {
        console.error('Session initialization error:', err);
      }
    };

    initializeSession();

    // Setup resize event tracking
    const handleResize = () => {
      if (sessionId && interactionStartedRef.current) {
        trackUserInteraction(sessionId, {
          type: 'resize',
          data: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Simplified function to forward trackUserInteraction calls
  const trackUserInteraction = (sessionId: string, eventData: any) => {
    import('../../../lib/bot-detection').then(({ trackUserInteraction }) => {
      trackUserInteraction(sessionId, eventData);
    });
  };

  const startChallenge = async () => {
    try {
      setState('loading');
      setError(null);
      interactionStartedRef.current = true;
      startTimeRef.current = Date.now();
      
      // Track challenge start event
      trackUserInteraction(sessionId, {
        type: 'challenge_start',
        data: { difficulty: currentDifficulty }
      });
      
      // Fetch random challenge with adaptive difficulty
      const challenge = await widgetApi.getRandomChallenge();
      
      if (!challenge) {
        throw new Error('No active challenges available');
      }
      
      setCurrentChallenge(challenge);
      setState('challenge');
      
      // Performance logging
      const loadTime = Date.now() - startTimeRef.current;
      console.log(`Challenge loaded in ${loadTime}ms`);
    } catch (err: any) {
      console.error('Error loading challenge:', err);
      const errorMessage = err.message || 'Failed to load challenge';
      setError(errorMessage);
      setState('error');
      onError?.(errorMessage);
    }
  };

  const handleChallengeComplete = async (answer: any, responseTime: number) => {
    if (!currentChallenge) return;

    try {
      setState('loading');

      // Perform enhanced bot detection
      const botDetectionStart = Date.now();
      const botDetectionResult = performBotDetection(
        sessionId, 
        responseTime, 
        currentChallenge.type
      );
      const botDetectionTime = Date.now() - botDetectionStart;
      
      // Store results for debugging if needed
      setBotDetectionResults(botDetectionResult);
      console.log(`Bot detection completed in ${botDetectionTime}ms with confidence: ${botDetectionResult.confidence.toFixed(2)}`);
      
      // Submit response to backend for validation and storage
      const result = await widgetApi.submitResponse({
        sessionId,
        challengeId: currentChallenge.id,
        answer,
        responseTimeMs: responseTime,
        challengeType: currentChallenge.type,
        inputMode: currentChallenge.input_mode,
        signalTags: currentChallenge.signal_tags,
        userAgent: navigator.userAgent
      });

      // Determine next challenge difficulty based on behavior
      const nextDifficulty = await widgetApi.getAdaptiveChallengeDifficulty(sessionId);
      setCurrentDifficulty(nextDifficulty);
      
      // Validate final result
      if (result.isHuman) {
        setState('success');
        setTimeout(() => {
          onVerified?.(sessionId);
        }, 1500);
        
        // Track successful verification
        trackUserInteraction(sessionId, {
          type: 'verification_success',
          data: { 
            confidence: result.confidence,
            difficulty: currentChallenge.difficulty,
            challengeType: currentChallenge.type,
            totalSessionTime: Date.now() - sessionStartTimeRef.current
          }
        });
      } else {
        setState('failed');
        setTimeout(() => {
          setState('idle');
          onFailed?.(sessionId);
        }, 2000);
        
        // Track failed verification
        trackUserInteraction(sessionId, {
          type: 'verification_failed',
          data: { 
            confidence: result.confidence,
            signals: result.signals,
            difficulty: currentChallenge.difficulty,
            challengeType: currentChallenge.type
          }
        });
      }
    } catch (err: any) {
      console.error('Error submitting response:', err);
      const errorMessage = err.message || 'Failed to submit response';
      setError(errorMessage);
      setState('error');
      onError?.(errorMessage);
    }
  };

  const retry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setState('idle');
      setCurrentChallenge(null);
      setError(null);
      
      // Track retry attempt
      trackUserInteraction(sessionId, {
        type: 'retry_attempt',
        data: { 
          retryCount: retryCount + 1,
          maxRetries,
          previousDifficulty: currentDifficulty
        }
      });
      
      // Adjust difficulty for retries
      setCurrentDifficulty(prev => {
        if (prev === 'hard') return 'medium';
        if (prev === 'medium') return 'easy';
        return 'easy';
      });
    } else {
      const errorMessage = 'Maximum retry attempts reached';
      setError(errorMessage);
      setState('error');
      onError?.(errorMessage);
      
      // Track max retries reached
      trackUserInteraction(sessionId, {
        type: 'max_retries_reached',
        data: { maxRetries }
      });
    }
  };

  const resetWidget = () => {
    setState('idle');
    setCurrentChallenge(null);
    setError(null);
    setRetryCount(0);
    setCurrentDifficulty('medium');
    
    // Track widget reset
    trackUserInteraction(sessionId, {
      type: 'widget_reset',
      data: { timestamp: Date.now() }
    });
  };

  return (
    <div 
      className="w-full max-w-md mx-auto"
      role="complementary"
      aria-label="Human verification widget"
      ref={containerRef}
      tabIndex={-1}
    >
      <BehaviorTracker 
        sessionId={sessionId} 
        isActive={state === 'challenge' || state === 'idle'}
      >
        <motion.div
          className="glass-real rounded-xl p-6 min-h-[320px] flex flex-col justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verify Your Humanity</h3>
                <p className="text-gray-400 mb-6">Complete a quick cognitive challenge to continue</p>
                {retryCount > 0 && (
                  <p className="text-sm text-neon-orange mb-4">
                    Attempt {retryCount + 1} of {maxRetries + 1}
                  </p>
                )}
                <motion.button
                  className="btn-primary"
                  onClick={startChallenge}
                  aria-label="Start verification challenge"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Challenge
                </motion.button>
              </motion.div>
            )}

            {state === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-neon-blue" />
                <p className="text-muted" aria-live="polite">
                  {currentChallenge ? 'Processing response...' : 'Loading challenge...'}
                </p>
              </motion.div>
            )}

            {state === 'challenge' && currentChallenge && (
              <motion.div
                key="challenge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <ChallengeRenderer
                  challenge={currentChallenge}
                  onComplete={handleChallengeComplete}
                />
              </motion.div>
            )}

            {state === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
                role="alert"
                aria-live="assertive"
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-neon-green to-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle className="w-8 h-8 text-white" aria-hidden="true" />
                </motion.div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">Verified!</h3>
                <p className="text-gray-400">You're human! Welcome aboard.</p>
                
                {botDetectionResults && botDetectionResults.confidence > 0.85 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-xs text-neon-green/70"
                  >
                    Verified with {Math.round(botDetectionResults.confidence * 100)}% confidence
                  </motion.div>
                )}
              </motion.div>
            )}

            {state === 'failed' && (
              <motion.div
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
                role="alert"
                aria-live="assertive"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-neon-red to-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neon-red mb-2">Try Again</h3>
                <p className="text-gray-400 mb-6">That wasn't quite right. Let's try another challenge.</p>
                <motion.button
                  className="btn-secondary"
                  onClick={retry}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={retryCount >= maxRetries}
                >
                  {retryCount >= maxRetries ? 'Max Attempts Reached' : 'Try Again'}
                </motion.button>
              </motion.div>
            )}

            {state === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-neon-red to-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neon-red mb-2">Error</h3>
                <p className="text-gray-400 mb-6 text-sm">{error}</p>
                <div className="flex gap-3 justify-center">
                  <motion.button
                    className="btn-secondary text-sm px-4 py-2"
                    onClick={retry}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={retryCount >= maxRetries}
                  >
                    Retry
                  </motion.button>
                  <motion.button
                    className="btn-ghost text-sm px-4 py-2"
                    onClick={resetWidget}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </BehaviorTracker>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-dark-200 rounded-lg text-xs text-gray-400 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div>Session: {sessionId.substring(0, 8)}...</div>
              <div>State: {state} | Difficulty: {currentDifficulty}</div>
              <div>Retries: {retryCount}/{maxRetries}</div>
            </div>
            <div>
              <div className="font-semibold text-neon-blue">Bot Detection: Active</div>
              {currentChallenge && <div>Challenge: {currentChallenge.type}</div>}
            </div>
          </div>
          
          {botDetectionResults && (
            <details>
              <summary className="cursor-pointer text-neon-blue hover:text-neon-purple transition-colors">
                Bot Detection Details
              </summary>
              <div className="mt-2 p-2 bg-dark-300 rounded text-xs">
                <div>Result: {botDetectionResults.isHuman ? 'Human' : 'Bot'} (Confidence: {(botDetectionResults.confidence * 100).toFixed(1)}%)</div>
                <div>Mouse: {botDetectionResults.signals.mouseAnalysis}% | Keyboard: {botDetectionResults.signals.keyboardAnalysis}%</div>
                <div>Timing: {botDetectionResults.signals.timingAnalysis}% | Behavior: {botDetectionResults.signals.behavioralConsistency}%</div>
                <div>Anomaly Score: {botDetectionResults.signals.anomalyScore}%</div>
                {botDetectionResults.riskFactors.length > 0 && (
                  <div className="mt-1">
                    <span className="text-neon-red">Risk Factors:</span>
                    <ul className="ml-3 text-gray-400">
                      {botDetectionResults.riskFactors.map((factor: string, index: number) => (
                        <li key={index}>• {factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default YunoWidget;