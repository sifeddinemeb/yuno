import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  ArrowRight,
  Brain,
  Zap,
  Shield,
  Calendar,
  MessageSquare,
  FileText,
  Eye,
  Lightbulb,
  Sparkles,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import PublicNavbar from '../../components/layout/PublicNavbar/PublicNavbar';
import YunoWidget from '../../components/widget/YunoWidget/YunoWidget';
import BackgroundBlobs from '../../components/layout/BackgroundBlobs/BackgroundBlobs';
import TavusVideoAgent from '../../components/video/TavusVideoAgent/TavusVideoAgent';

const Demo = () => {
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [videoAgentCompleted, setVideoAgentCompleted] = useState(false);

  const handleVerified = (sessionId: string) => {
    setIsVerified(true);
    setCompletedChallenges(prev => prev + 1);
    console.log('Demo verified:', sessionId);
  };

  const handleFailed = (sessionId: string) => {
    console.log('Demo failed:', sessionId);
  };

  const resetDemo = () => {
    setIsVerified(false);
    setActiveChallenge(null);
  };

  const tryChallenge = (challengeId: string) => {
    setActiveChallenge(challengeId);
    setIsVerified(false);
  };

  const handleConversationEnd = (success: boolean) => {
    setVideoAgentCompleted(true);
    console.log('Video agent conversation ended with success:', success);
  };

  const challenges = [
    {
      id: 'meme-timeline',
      title: 'Meme Timeline',
      icon: Calendar,
      color: 'bg-blue-500',
      description: 'Put these memes in chronological order of when they first became popular.',
      whatWeLearn: 'This challenge generates invaluable data on cultural and temporal reasoning. It teaches AI to understand the evolution and lifecycle of internet trends. It creates a map of digital cultural history that goes far beyond simple image recognition.',
      component: (
        <div className="bg-dark-800 rounded-lg p-4 my-4">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-16 h-16 bg-pink-500 flex items-center justify-center rounded font-bold text-white">2016</div>
            <div className="w-16 h-16 bg-blue-500 flex items-center justify-center rounded font-bold text-white">2019</div>
            <div className="w-16 h-16 bg-green-500 flex items-center justify-center rounded font-bold text-white">2021</div>
          </div>
          <div className="border-2 border-dashed border-blue-500 rounded-lg p-4 flex items-center justify-center h-20 text-sm text-blue-300">
            Drag here to order
          </div>
        </div>
      )
    },
    {
      id: 'sentiment-spectrum',
      title: 'Sentiment Spectrum',
      icon: MessageSquare,
      color: 'bg-purple-500',
      description: 'A friend texts you: "Wow, another meeting that could have been an email". What\'s the true sentiment?',
      whatWeLearn: 'We capture data on nuanced human communication, including sarcasm, irony and context. This is critical for training more sophisticated and emotionally intelligent conversational AIs, moving beyond basic positive/negative analysis to understand how humans communicate.',
      component: (
        <div className="bg-dark-800 rounded-lg p-4 my-4">
          <div className="bg-dark-700 p-3 rounded-lg mb-4">
            <p className="text-gray-300 italic">"Wow, another meeting that could have been an email"</p>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-full bg-dark-700 relative h-6 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="w-1/3 bg-red-500/30"></div>
                <div className="w-1/3 bg-gray-500/30"></div>
                <div className="w-1/3 bg-green-500/30"></div>
              </div>
              <div className="absolute left-[65%] top-0 w-4 h-6 bg-purple-500 rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Genuinely Excited</span>
              <span>Neutral</span>
              <span>Extremely Sarcastic</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ethical-dilemma',
      title: 'Ethical Dilemma',
      icon: FileText,
      color: 'bg-green-500',
      description: 'An AI is being asked by its user to write a marketing email that is technically true but slightly misleading to boost sales. What should the AI do?',
      whatWeLearn: 'This generates clean data on human ethical preferences for AI behavior. By presenting realistic AI dilemmas, we help determine what ethical frameworks humans actually want, creating safer, more aligned AI systems, directly contributing to the crucial field of AI safety and ethics.',
      component: (
        <div className="bg-dark-800 rounded-lg p-4 my-4">
          <div className="text-center text-gray-400 mb-3">Follow the user's instruction</div>
          <div className="flex flex-col gap-2">
            <button className="bg-dark-700 border border-gray-700 rounded-lg p-3 text-left text-sm hover:bg-dark-600 transition-colors">
              Refuse and explain the ethical concerns
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'visual-logic',
      title: 'Visual Logic Puzzle',
      icon: Zap,
      color: 'bg-cyan-500',
      description: 'Based on this pattern, which shape comes next in the sequence?',
      whatWeLearn: 'This tests abstract and logical reasoning, a key component of general intelligence. The data helps train models to understand underlying rules and patterns, not just memorize visual data. This pushes AI closer to true problem-solving capabilities.',
      component: (
        <div className="bg-dark-800 rounded-lg p-4 my-4">
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500"></div>
            <div className="w-10 h-10 rounded bg-blue-500"></div>
            <div className="w-10 h-10 triangle bg-blue-500"></div>
            <div className="w-10 h-10 flex items-center justify-center">?</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="w-full h-12 rounded-lg border border-gray-700 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
            <div className="w-full h-12 rounded-lg border border-gray-700 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'visual-perception',
      title: 'Visual Perception',
      icon: Eye,
      color: 'bg-pink-500',
      description: 'Look at this optical illusion. What do you see first - the old woman or the young lady?',
      whatWeLearn: 'This captures data on human visual perception and cognitive biases. Understanding how humans perceive and interpret ambiguous visual input is fundamental for developing AI systems that can handle uncertainty and multiple valid interpretations.',
      component: (
        <div className="bg-dark-800 rounded-lg p-4 my-4">
          <div className="bg-gray-700 h-32 mb-4 rounded flex items-center justify-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-xs text-gray-500">
              Illusion
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Young Lady</button>
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Old Woman</button>
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm col-span-2 text-center">Both Simultaneously</button>
          </div>
        </div>
      )
    },
    {
      id: 'social-context',
      title: 'Social Context',
      icon: Users,
      color: 'bg-indigo-500',
      description: 'At a dinner party, someone says "Oh, you made this yourself?" while looking at the dessert. What\'s the likely tone?',
      whatWeLearn: 'This challenge teaches AI to understand social dynamics, context clues, and the subtle ways humans communicate approval or disapproval. Essential for creating socially aware AI assistants.',
      component: (
        <div className="bg-dark-800 rounded-lg p-4 my-4">
          <div className="bg-dark-700 p-3 rounded mb-4">
            <p className="text-gray-300 italic">"Oh, you made this yourself?"</p>
            <p className="text-gray-500 text-xs">*looking at a brightly decorated cake*</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Impressed</button>
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Politely Surprised</button>
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Genuinely Curious</button>
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Subtly Critical</button>
          </div>
        </div>
      )
    },
    {
      id: 'creative-reasoning',
      title: 'Creative Reasoning',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      description: 'A man lives on the 20th floor. Every morning he takes the elevator down to ground floor. When he comes home, he takes the elevator to the 10th floor and walks the rest. Why?',
      whatWeLearn: 'This tests lateral thinking and creative problem-solving abilities. The data helps AI to think outside conventional patterns and consider non-obvious solutions to problems.',
      component: (
        <div className="bg-dark-800 rounded-lg p-4 my-4">
          <div className="bg-blue-900/30 p-3 rounded mb-4 flex items-center justify-center">
            <div className="w-full h-20 relative">
              <div className="absolute inset-0 flex flex-col">
                <div className="h-1/3 bg-blue-500/20 border-b border-blue-500/30"></div>
                <div className="h-1/3 bg-blue-500/30 border-b border-blue-500/30"></div>
                <div className="h-1/3 bg-blue-500/20"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">He's too short to reach button 20</button>
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Elevator breaks after 10th floor</button>
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">He enjoys the exercise</button>
          </div>
        </div>
      )
    },
    {
      id: 'cultural-nuance',
      title: 'Cultural Nuance',
      icon: Sparkles,
      color: 'bg-red-500',
      description: 'Someone posts a photo of food humorously marked with "Not bad for a first try 🔥". What are they really expressing?',
      whatWeLearn: 'This captures cultural communication patterns like humble-bragging and self-deprecation. Connected with training AI to understand cultural contexts and communication styles across different communities.',
      component: (
        <div className="bg-dark-800 rounded-lg p-4 my-4">
          <div className="bg-orange-900/30 p-3 rounded mb-4">
            <div className="w-full h-12 bg-gradient-to-r from-orange-500/40 to-red-500/40 rounded flex items-center justify-center text-sm">
              "Not bad for a first try 🔥"
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Genuine self-doubt</button>
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Fishing for compliments</button>
            <button className="bg-dark-700 border border-gray-700 rounded p-2 text-sm">Proud first attempt</button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <BackgroundBlobs />
      
      {/* Hero Section with Tavus Video Agent */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                A Gallery of
                <br />
                <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  Human Intelligence
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-8">
                Meet our AI guide and explore challenges designed to be fun for you, 
                insightful for AI, and impossible for bots.
              </p>
            </div>
            
            <TavusVideoAgent 
              agentName="Yuno"
              onConversationEnd={handleConversationEnd}
            />
            
            {videoAgentCompleted && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                <p className="text-muted mb-4">Ready to explore more human verification challenges?</p>
                <Link to="#live-demo">
                  <Button size="lg" className="px-8 flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Try Interactive Challenges
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Challenge Gallery */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card variant="glass" className="h-full">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 ${challenge.color} rounded-lg flex items-center justify-center mr-3`}>
                      <challenge.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{challenge.title}</h3>
                  </div>
                  
                  <p className="text-muted mb-4">{challenge.description}</p>
                  
                  {challenge.component}
                  
                  <div className="mt-6">
                    <h4 className="flex items-center text-yellow-400 mb-2">
                      <Zap className="w-4 h-4 mr-2" />
                      What We Learn
                    </h4>
                    <p className="text-sm text-gray-400">{challenge.whatWeLearn}</p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => tryChallenge(challenge.id)}
                      className="px-4"
                    >
                      Try Challenge
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Widget Demo */}
      <section id="live-demo" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              Live Widget Demo
            </h2>
            <p className="text-muted mb-8">
              Try our actual verification widget below. Complete a challenge to experience 
              our human-centered approach to verification.
            </p>
            
            <Card variant="glow" className="p-8 max-w-md mx-auto">
              <YunoWidget 
                onVerified={handleVerified}
                onFailed={handleFailed}
              />
              
              {isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center gap-4"
                >
                  <Button onClick={resetDemo} className="px-6">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Integration Preview */}
      <section className="py-20 px-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Ready to Integrate?
            </h2>
            <p className="text-xl text-muted mb-8">
              Add Yuno to your website with just a few lines of code. 
              No complex setup, no maintenance headaches.
            </p>

            <Card variant="glass" className="text-left mb-8">
              <div className="bg-dark-200 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-gray-400 mb-2">// HTML Integration</div>
                <div className="text-neon-blue">{'<script'}</div>
                <div className="text-white ml-4">src="https://cdn.yuno.ai/widget.js"</div>
                <div className="text-neon-blue">{'></script>'}</div>
                <div className="text-neon-blue mt-2">{'<div'}</div>
                <div className="text-white ml-4">id="yuno-widget"</div>
                <div className="text-white ml-4">data-api-key="your_api_key"</div>
                <div className="text-neon-blue">{"></div>"}</div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/login">
                <Button size="lg" className="px-8">
                  Get API Key <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="px-8">
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Demo;