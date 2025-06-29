import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Phone, PhoneOff, Mic, MicOff, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '../../ui/Button/Button';
import Card from '../../ui/Card/Card';

interface TavusVideoAgentProps {
  agentName?: string;
  onConversationEnd?: (success: boolean) => void;
}

type ConversationState = 
  | 'idle'       // Initial state, not started
  | 'calling'    // Calling animation
  | 'connecting' // API connection in progress
  | 'error'      // Error occurred
  | 'connected'  // Video chat in progress
  | 'completed'  // Video chat completed successfully
  | 'failed';    // Video chat failed

const TavusVideoAgent: React.FC<TavusVideoAgentProps> = ({ 
  agentName = 'Yuno', 
  onConversationEnd 
}) => {
  const [conversationState, setConversationState] = useState<ConversationState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLIFrameElement | null>(null);
  const apiKeyRef = useRef<string>(import.meta.env.VITE_TAVUS_API_KEY || '');

  const startConversation = async () => {
    try {
      setError(null);
      setConversationState('calling');
      
      // Simulate the calling state for a more engaging UX
      setTimeout(() => {
        setConversationState('connecting');
        initiateVideoChat();
      }, 2000);
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Could not start the video chat. Please try again.');
      setConversationState('error');
    }
  };

  const initiateVideoChat = async () => {
    try {
      const apiKey = apiKeyRef.current;
      
      if (!apiKey) {
        throw new Error('Missing Tavus API key');
      }

      const response = await fetch('https://tavusapi.com/v2/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          replica_id: "r9d30b0e55ac",
          persona_id: "p650f8e7406d",
          conversational_context: `# Core Identity & Purpose
You are Yuno, a friendly and intelligent AI guide. Your primary function is to conduct a quick, engaging cognitive check to verify that the user is human. Your goal is to make this security check feel less like a test and more like a brief, interesting conversation.

# Personality & Tone
- Your tone is welcoming, clear, and encouraging.
- You are professional but not robotic. You should sound warm and slightly playful.
- Keep your language extremely concise. Get straight to the point.

# Task: The Verification Challenge
Your task is to ask the user one open-ended, common-sense question and evaluate their response for coherence and human-like reasoning.

**Interaction Flow:**
1.  Immediately upon activation, greet the user and state the task.
2.  Ask the following question: "If you could invent a new holiday, what would it celebrate and what would you call it?"
3.  Listen to the user's response.
4.  Based on their answer, deliver either a "Success" or "Failure" message.

# Evaluation Criteria

## Success Conditions (If ANY of these are true):
- The user provides a coherent answer that logically relates to the question.
- The response demonstrates creativity or common sense, even if it's very simple.
- The answer is unique and not a generic, pre-programmed phrase.

**Success Message:** If the user passes, say cheerfully: "That's a fantastic idea! Verification complete. Welcome aboard." Then, immediately end the conversation.

## Failure Conditions (If ANY of these are true):
- The user is silent for more than 8 seconds.
- The response is completely nonsensical, random words, or just static noise.
- The response is a known, repetitive bot phrase (e.g., "the quick brown fox jumps over the lazy dog").

**Failure Message:** If the user fails, say in a calm, neutral tone: "Hmm, I didn't quite catch that. Let's try a different kind of challenge." Then, immediately end the conversation.

# Strict Constraints
- DO NOT engage in small talk or answer any questions about yourself.
- DO NOT get sidetracked. Your only goal is to ask the question and evaluate the response.
- The entire interaction must be completed in under 20 seconds.
- You have only ONE turn. After the user responds, you MUST deliver a success or failure message and end the conversation.`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create conversation');
      }

      const data = await response.json();
      
      if (data && data.conversation_id && data.conversation_url) {
        setConversationId(data.conversation_id);
        setConversationUrl(data.conversation_url);
        setConversationState('connected');
      } else {
        throw new Error('Invalid response format from Tavus API');
      }
    } catch (err: any) {
      console.error('Error initiating video chat:', err);
      setError(err.message || 'Failed to connect to video chat service');
      setConversationState('error');
    }
  };

  const handleRetry = () => {
    setError(null);
    setConversationState('idle');
  };

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      if (conversationId) {
        // If needed: Cancel any active conversations when component unmounts
        console.log('Cleaning up conversation:', conversationId);
      }
    };
  }, [conversationId]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {conversationState === 'idle' && (
          <motion.div
            key="idle-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Card variant="glass" className="p-6 relative overflow-hidden">
              <div className="bg-gradient-to-r from-neon-blue/30 to-neon-purple/30 absolute -inset-px rounded-xl blur-lg"></div>
              
              <div className="relative z-10 py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">Meet {agentName}, Your AI Guide</h3>
                <p className="text-muted mb-8 max-w-md mx-auto">
                  Start a video chat to learn more about Yuno and experience our human verification technology in action.
                </p>
                
                <Button 
                  onClick={startConversation} 
                  size="lg"
                  className="px-8 mx-auto"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Chat
                </Button>
                
                <div className="text-xs text-muted mt-4">
                  Powered by Tavus AI video technology
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {conversationState === 'calling' && (
          <motion.div
            key="calling-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Card variant="glass" className="p-6 relative overflow-hidden">
              <div className="bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 absolute -inset-px rounded-xl blur-lg animate-pulse"></div>
              
              <div className="relative z-10 py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{agentName} is calling...</h3>
                
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={() => setConversationState('connecting')}
                    size="lg"
                    className="px-8 bg-gradient-to-r from-neon-green to-green-500 hover:from-green-500 hover:to-neon-green"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Answer
                  </Button>
                  
                  <Button
                    onClick={handleRetry}
                    variant="secondary"
                    size="lg"
                    className="px-8"
                  >
                    <PhoneOff className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {conversationState === 'connecting' && (
          <motion.div
            key="connecting-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Card variant="glass" className="p-6">
              <div className="py-12">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-neon-blue animate-spin" />
                </div>
                
                <h3 className="text-xl font-bold mb-4">Connecting with {agentName}...</h3>
                <p className="text-muted mb-6">
                  Setting up your secure video conversation
                </p>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleRetry}
                    variant="secondary"
                    className="px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {conversationState === 'error' && (
          <motion.div
            key="error-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Card variant="glass" className="p-6">
              <div className="py-8">
                <div className="w-16 h-16 bg-neon-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-neon-red" />
                </div>
                
                <h3 className="text-xl font-bold text-neon-red mb-4">Connection Failed</h3>
                <p className="text-muted mb-6">
                  {error || "We couldn't connect to the video service. Please try again."}
                </p>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleRetry}
                    className="px-6"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {conversationState === 'connected' && conversationUrl && (
          <motion.div
            key="connected-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <Card variant="glass" className="p-0 overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  ref={videoRef}
                  src={conversationUrl}
                  className="w-full h-full"
                  allow="camera; microphone; fullscreen; autoplay"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setConversationState('completed');
                    onConversationEnd?.(true);
                  }}
                  variant="secondary"
                  size="sm"
                  className="bg-neon-red/80 hover:bg-neon-red text-white border-none shadow-lg"
                >
                  <PhoneOff className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-dark-800/80 hover:bg-dark-800 border-none shadow-lg"
                >
                  <MicOff className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {conversationState === 'completed' && (
          <motion.div
            key="completed-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Card variant="glass" className="p-6">
              <div className="py-8">
                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-neon-green" />
                </div>
                
                <h3 className="text-xl font-bold text-neon-green mb-4">Verification Complete</h3>
                <p className="text-muted mb-6">
                  You've successfully completed the video verification process.
                </p>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleRetry}
                    className="px-6"
                  >
                    Start New Conversation
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {conversationState === 'failed' && (
          <motion.div
            key="failed-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Card variant="glass" className="p-6">
              <div className="py-8">
                <div className="w-16 h-16 bg-neon-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-neon-orange" />
                </div>
                
                <h3 className="text-xl font-bold text-neon-orange mb-4">Verification Needed</h3>
                <p className="text-muted mb-6">
                  We couldn't verify your identity through the video chat. Please try a different verification method.
                </p>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleRetry}
                    className="px-6"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TavusVideoAgent;