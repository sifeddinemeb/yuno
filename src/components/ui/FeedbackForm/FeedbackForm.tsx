import { useState } from 'react';
import { Send, ThumbsUp, ThumbsDown, MessageSquare, X, CheckCircle } from 'lucide-react';
import Button from '../Button/Button';
import Card from '../Card/Card';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackFormProps {
  onSubmit?: (feedback: FeedbackData) => void;
  onDismiss?: () => void;
  variant?: 'floating' | 'inline';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  title?: string;
  className?: string;
}

export interface FeedbackData {
  type: 'positive' | 'negative' | 'suggestion';
  comment: string;
  metadata: {
    page: string;
    browser: string;
    timestamp: string;
  };
}

const FeedbackForm = ({
  onSubmit,
  onDismiss,
  variant = 'floating',
  position = 'bottom-right',
  title = 'Help us improve',
  className = '',
}: FeedbackFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | 'suggestion' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFeedbackType(null);
    setComment('');
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackType) return;
    
    setIsSubmitting(true);
    
    const feedbackData: FeedbackData = {
      type: feedbackType,
      comment,
      metadata: {
        page: window.location.pathname,
        browser: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
    };
    
    try {
      if (onSubmit) {
        await onSubmit(feedbackData);
      } else {
        // If no onSubmit handler, simulate a submission for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
      setIsSubmitted(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        resetForm();
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }[position];

  // Floating toggle button (visible only in floating variant)
  const toggleButton = variant === 'floating' && (
    <motion.button
      className={`fixed ${positionClasses} z-30 w-12 h-12 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 transition-transform duration-300 hover:scale-110`}
      onClick={handleToggle}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Close feedback form" : "Open feedback form"}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="w-5 h-5 text-white" />
      ) : (
        <MessageSquare className="w-5 h-5 text-white" />
      )}
    </motion.button>
  );

  const feedbackForm = (
    <AnimatePresence>
      {(variant === 'inline' || isOpen) && (
        <motion.div
          initial={variant === 'floating' ? { opacity: 0, y: 20, scale: 0.9 } : { opacity: 0 }}
          animate={variant === 'floating' ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1 }}
          exit={variant === 'floating' ? { opacity: 0, y: 20, scale: 0.9 } : { opacity: 0 }}
          className={`${variant === 'floating' ? `fixed ${positionClasses} z-20` : ''} ${className}`}
          style={variant === 'floating' ? { width: '350px', marginBottom: '4rem' } : {}}
        >
          <Card variant="glass" className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                {variant === 'inline' && onDismiss && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1" 
                    onClick={onDismiss}
                    aria-label="Close feedback form"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-neon-green" />
                    </div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Thank you for your feedback!</h4>
                    <p className="text-muted text-sm">
                      Your input helps us improve the Yuno experience for everyone.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-secondary mb-2">
                        What kind of feedback do you have?
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFeedbackType('positive')}
                          className={`flex-1 flex flex-col items-center p-3 rounded-lg transition-all ${
                            feedbackType === 'positive'
                              ? 'bg-neon-green/20 border border-neon-green/40 text-neon-green'
                              : 'glass-light hover:bg-neon-green/10'
                          }`}
                          aria-pressed={feedbackType === 'positive'}
                        >
                          <ThumbsUp className="w-5 h-5 mb-1" />
                          <span className="text-sm">Positive</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeedbackType('negative')}
                          className={`flex-1 flex flex-col items-center p-3 rounded-lg transition-all ${
                            feedbackType === 'negative'
                              ? 'bg-neon-red/20 border border-neon-red/40 text-neon-red'
                              : 'glass-light hover:bg-neon-red/10'
                          }`}
                          aria-pressed={feedbackType === 'negative'}
                        >
                          <ThumbsDown className="w-5 h-5 mb-1" />
                          <span className="text-sm">Negative</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeedbackType('suggestion')}
                          className={`flex-1 flex flex-col items-center p-3 rounded-lg transition-all ${
                            feedbackType === 'suggestion'
                              ? 'bg-neon-blue/20 border border-neon-blue/40 text-neon-blue'
                              : 'glass-light hover:bg-neon-blue/10'
                          }`}
                          aria-pressed={feedbackType === 'suggestion'}
                        >
                          <MessageSquare className="w-5 h-5 mb-1" />
                          <span className="text-sm">Suggestion</span>
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="feedback-comment" className="block text-sm font-medium text-secondary mb-2">
                        Your feedback
                      </label>
                      <textarea
                        id="feedback-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Please share your thoughts..."
                        className="input-field min-h-[100px] resize-none"
                        required={feedbackType !== null}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!feedbackType || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {toggleButton}
      {feedbackForm}
    </>
  );
};

export default FeedbackForm;