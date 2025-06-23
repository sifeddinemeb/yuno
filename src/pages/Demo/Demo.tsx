import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTransition } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  ArrowRight, 
  Brain,
  Zap,
  Shield
} from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import ThemeToggle from '../../components/ui/ThemeToggle/ThemeToggle';
import YunoWidget from '../../components/widget/YunoWidget/YunoWidget';

const Demo = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const handleNavigation = (path: string) => {
    // Wrap navigation in startTransition to avoid throttling warnings
    startTransition(() => {
      navigate(path);
    });
  };

  const demoSteps = [
    {
      title: 'Human Verification',
      description: 'Experience our cognitive micro-challenges',
      icon: Brain,
      color: 'from-neon-blue to-blue-600'
    },
    {
      title: 'AI Training',
      description: 'Your responses help train smarter AI models',
      icon: Zap,
      color: 'from-neon-purple to-violet-600'
    },
    {
      title: 'Bot Detection',
      description: 'Advanced patterns identify non-human behavior',
      icon: Shield,
      color: 'from-neon-green to-emerald-600'
    }
  ];

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
    setCurrentDemo(0);
  };

  const nextChallenge = () => {
    setIsVerified(false);
    setCurrentDemo((prev) => (prev + 1) % 3);
  };

  return (
    <div className="min-h-screen">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Yuno
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavigation('/')} 
                className="text-secondary hover:text-primary transition-colors bg-transparent border-none"
              >
                Vision
              </button>
              <button 
                onClick={() => handleNavigation('/impact')} 
                className="text-secondary hover:text-primary transition-colors bg-transparent border-none"
              >
                Impact
              </button>
              <Link to="/demo" className="text-neon-blue font-semibold">Demo</Link>
              <button 
                onClick={() => handleNavigation('/auth/login')}
                disabled={isPending}
              >
                <Button size="sm">Get Started</Button>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Experience{' '}
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Yuno Live
              </span>
            </h1>
            
            <p className="text-xl text-muted max-w-2xl mx-auto mb-8">
              Try our human verification widget right here. See how quick, intuitive, 
              and engaging verification can be when it's designed for humans.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">{completedChallenges}</div>
                <div className="text-sm text-muted">Challenges Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green">8.3s</div>
                <div className="text-sm text-muted">Avg Completion Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple">99.7%</div>
                <div className="text-sm text-muted">Accuracy Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Widget Demo */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <Card variant="glow" className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Live Widget Demo
              </h2>
              <p className="text-muted mb-8">
                This is the actual Yuno widget that your users will interact with. 
                Try it yourself to experience the difference.
              </p>
              
              <div className="max-w-md mx-auto">
                <YunoWidget 
                  onVerified={handleVerified}
                  onFailed={handleFailed}
                />
              </div>

              {isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center gap-4"
                >
                  <Button onClick={nextChallenge} className="px-6">
                    <Play className="w-4 h-4 mr-2" />
                    Try Another Challenge
                  </Button>
                  <Button variant="secondary" onClick={resetDemo} className="px-6">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Demo
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Every interaction creates value. Here's how Yuno transforms simple verification 
              into powerful AI training data while keeping bots at bay.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {demoSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card variant="glass" className="text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="text-xl font-semibold text-primary mb-3">
                    {index + 1}. {step.title}
                  </div>
                  
                  <p className="text-muted mb-6">
                    {step.description}
                  </p>

                  <div className="space-y-2">
                    {index === 0 && (
                      <>
                        <div className="flex items-center text-sm text-secondary">
                          <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                          Cognitive micro-challenges
                        </div>
                        <div className="flex items-center text-sm text-secondary">
                          <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                          Intuitive interactions
                        </div>
                        <div className="flex items-center text-sm text-secondary">
                          <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                          Instant feedback
                        </div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div className="flex items-center text-sm text-secondary">
                          <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                          Ethical reasoning data
                        </div>
                        <div className="flex items-center text-sm text-secondary">
                          <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                          Cultural context signals
                        </div>
                        <div className="flex items-center text-sm text-secondary">
                          <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                          Nuanced human judgment
                        </div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div className="flex items-center text-sm text-secondary">
                          <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                          Real-time adaptation
                        </div>
                        <div className="flex items-center text-sm text-secondary">
                          <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                          Behavioral fingerprinting
                        </div>
                        <div className="flex items-center text-sm text-secondary">
                          <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                          99.7% accuracy rate
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
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
              <div className="bg-dark-200 rounded-lg p-4 overflow-x-auto">
                <pre className="font-mono text-sm">
                  <code>
                    <div className="text-gray-400">// HTML Integration</div>
                    <div className="text-neon-blue">&lt;script</div>
                    <div className="text-white ml-4">src="https://cdn.yuno.ai/widget.js"</div>
                    <div className="text-neon-blue">&gt;&lt;/script&gt;</div>
                    <div className="text-neon-blue mt-2">&lt;div</div>
                    <div className="text-white ml-4">id="yuno-widget"</div>
                    <div className="text-white ml-4">data-api-key="your_api_key"</div>
                    <div className="text-neon-blue">&gt;&lt;/div&gt;</div>
                  </code>
                </pre>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleNavigation('/auth/login')} 
                disabled={isPending}
              >
                <Button size="lg" className="px-8">
                  Get API Key <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </button>
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

export default Impact;