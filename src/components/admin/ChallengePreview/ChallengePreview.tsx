import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RefreshCw, BarChart3, Clock, Lightbulb } from 'lucide-react';
import { Challenge } from '../../../types';
import Button from '../../ui/Button/Button';
import Card from '../../ui/Card/Card';
import Modal from '../../ui/Modal/Modal';
import ChallengeRenderer from '../../widget/ChallengeRenderer/ChallengeRenderer';
import { validateAnswer } from '../../../lib/challenge-validation';

interface ChallengePreviewProps {
  challenge: Challenge | null;
  onClose: () => void;
  onComplete?: (answer: any, responseTime: number) => void;
}

const ChallengePreview = ({ challenge, onClose, onComplete }: ChallengePreviewProps) => {
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<{ 
    answer: any; 
    responseTime: number;
    validation?: {
      isCorrect: boolean;
      score: number;
      feedback: string;
      partialCredit?: number;
      detailedFeedback?: string;
    }
  } | null>(null);

  if (!challenge) return null;

  const handleStart = () => {
    setIsActive(true);
    setResult(null);
  };

  const handleComplete = (answer: any, responseTime: number) => {
    // Validate the answer using the enhanced validation system
    const validation = validateAnswer(challenge, answer);
    
    setResult({ 
      answer, 
      responseTime,
      validation
    });
    
    setIsActive(false);
    onComplete?.(answer, responseTime);
  };

  const handleReset = () => {
    setIsActive(false);
    setResult(null);
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <AnimatePresence>
      <Modal
        isOpen={!!challenge}
        onClose={onClose}
        title="Challenge Preview"
        size="large"
        closeOnOutsideClick={true}
        showCloseButton={true}
      >
        {challenge && (
          <div className="space-y-6">
            {/* Challenge Info */}
            <div className="mb-6 p-4 glass-light rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Type:</span>
                  <span className="ml-2 text-primary">{challenge.type}</span>
                </div>
                <div>
                  <span className="text-muted">Difficulty:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    challenge.difficulty === 'easy' ? 'bg-neon-green/20 text-neon-green' :
                    challenge.difficulty === 'medium' ? 'bg-neon-orange/20 text-neon-orange' :
                    'bg-neon-red/20 text-neon-red'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <div>
                  <span className="text-muted">Input Mode:</span>
                  <span className="ml-2 text-primary">{challenge.input_mode}</span>
                </div>
                <div>
                  <span className="text-muted">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    challenge.is_active 
                      ? 'bg-neon-green/20 text-neon-green' 
                      : 'bg-gray-600/20 text-gray-400'
                  }`}>
                    {challenge.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>
              
              {challenge.signal_tags && challenge.signal_tags.length > 0 && (
                <div className="mt-3">
                  <span className="text-muted text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {challenge.signal_tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Challenge Preview */}
            <div className="mb-6">
              {!isActive && !result && (
                <div className="text-center py-12 glass-light rounded-lg">
                  <Play className="w-12 h-12 text-neon-blue mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Ready to Preview
                  </h3>
                  <p className="text-muted mb-6">
                    Start the challenge to see how users will experience it
                  </p>
                  <Button onClick={handleStart} className="px-8">
                    <Play className="w-4 h-4 mr-2" />
                    Start Preview
                  </Button>
                </div>
              )}

              {isActive && (
                <div className="border border-neon-blue/30 rounded-lg p-6 bg-dark-200/50 glass-light">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-neon-blue">Live Preview</span>
                    <Button variant="ghost" size="sm" onClick={handleReset} aria-label="Reset challenge">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <ChallengeRenderer
                    challenge={challenge}
                    onComplete={handleComplete}
                  />
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="text-center py-8 glass-light rounded-lg">
                    <div className={`w-12 h-12 ${
                      result.validation?.isCorrect 
                        ? 'bg-gradient-to-r from-neon-green to-emerald-500' 
                        : 'bg-gradient-to-r from-neon-orange to-yellow-500'
                    } rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {result.validation?.isCorrect 
                        ? <Play className="w-6 h-6 text-white" />
                        : <Clock className="w-6 h-6 text-white" />
                      }
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      result.validation?.isCorrect ? 'text-neon-green' : 'text-neon-orange'
                    } mb-2`}>
                      {result.validation?.isCorrect ? 'Correct Answer' : 'Partial Credit'}
                    </h3>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm text-muted">Response Time</div>
                        <div className="text-lg font-medium">{formatResponseTime(result.responseTime)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted">Score</div>
                        <div className="text-lg font-medium">{result.validation?.score || 0}%</div>
                      </div>
                    </div>
                    <p className="text-muted">
                      {result.validation?.feedback}
                    </p>
                  </div>

                  <div className="p-4 glass-light rounded-lg">
                    <h4 className="font-medium mb-2">User Answer:</h4>
                    <div className="text-sm text-muted">
                      {typeof result.answer === 'string' ? (
                        result.answer
                      ) : (
                        <pre className="whitespace-pre-wrap overflow-x-auto bg-dark-200 p-2 rounded-md">
                          {JSON.stringify(result.answer, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>

                  {result.validation?.detailedFeedback && (
                    <div className="p-4 glass-light rounded-lg">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="w-4 h-4 text-neon-orange mr-2" />
                        <h4 className="font-medium">Detailed Feedback:</h4>
                      </div>
                      <p className="text-sm text-muted">{result.validation.detailedFeedback}</p>
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleStart} variant="secondary">
                      <Play className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button onClick={onClose}>
                      Close Preview
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6">
                <summary className="text-sm text-muted cursor-pointer hover:text-primary">
                  Debug Info (Development)
                </summary>
                <div className="mt-2 p-3 bg-dark-200 rounded-lg text-xs">
                  <div className="space-y-2">
                    <div>
                      <strong>Challenge ID:</strong> {challenge.id}
                    </div>
                    <div>
                      <strong>Content:</strong>
                      <pre className="mt-1 text-xs overflow-x-auto">
                        {JSON.stringify(challenge.content, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <strong>Correct Answer:</strong>
                      <pre className="mt-1 text-xs overflow-x-auto">
                        {JSON.stringify(challenge.correct_answer, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </details>
            )}
          </div>
        )}
      </Modal>
    </AnimatePresence>
  );
};

export default ChallengePreview;