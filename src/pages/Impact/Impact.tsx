import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTransition } from 'react';
import { 
  Brain, 
  Shield, 
  Heart, 
  TrendingUp, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  BarChart3,
  Lock,
  Sparkles
} from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import ThemeToggle from '../../components/ui/ThemeToggle/ThemeToggle';

const Impact = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  
  const handleNavigation = (path: string) => {
    // Wrap navigation in startTransition to avoid throttling warnings
    startTransition(() => {
      navigate(path);
    });
  };

  const impactStats = [
    { label: 'AI Models Improved', value: '2,847', icon: Brain, color: 'text-neon-blue' },
    { label: 'Bots Detected', value: '1.2M+', icon: Shield, color: 'text-neon-red' },
    { label: 'User Satisfaction', value: '94%', icon: Heart, color: 'text-neon-green' },
    { label: 'Data Points Collected', value: '15.7M', icon: BarChart3, color: 'text-neon-purple' },
  ];

  const benefits = [
    {
      icon: Brain,
      title: 'Solving the AI Data Drought',
      description: 'Every interaction generates high-quality, human-labeled reasoning data that fuels smarter, safer AI models.',
      stats: ['10x higher quality than traditional datasets', '99.7% accuracy in human reasoning patterns', 'Real-time ethical decision mapping'],
      color: 'from-neon-blue to-blue-600'
    },
    {
      icon: Shield,
      title: 'Redefining Internet Security',
      description: 'Advanced cognitive challenges that evolve faster than bot capabilities, providing superior protection.',
      stats: ['99.7% bot detection accuracy', '67% reduction in false positives', 'Adaptive challenge difficulty'],
      color: 'from-neon-red to-red-600'
    },
    {
      icon: Heart,
      title: 'Enhancing User Experience',
      description: 'Transform frustrating CAPTCHAs into engaging micro-challenges that users actually enjoy.',
      stats: ['94% user satisfaction rate', '8.3s average completion time', '45% increase in conversion rates'],
      color: 'from-neon-green to-emerald-600'
    },
    {
      icon: Lock,
      title: 'Ethical Data Sourcing',
      description: 'Transparent, consensual data collection that respects user privacy while advancing AI capabilities.',
      stats: ['100% transparent data usage', 'GDPR & CCPA compliant', 'User-controlled data sharing'],
      color: 'from-neon-purple to-violet-600'
    }
  ];

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
              <Link to="/impact" className="text-neon-blue font-semibold">Impact</Link>
              <button 
                onClick={() => handleNavigation('/demo')} 
                className="text-secondary hover:text-primary transition-colors bg-transparent border-none"
              >
                Demo
              </button>
              <button onClick={() => handleNavigation('/auth/login')}>
                <Button size="sm">Get Started</Button>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforming the{' '}
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Digital Landscape
              </span>
            </h1>
            
            <p className="text-xl text-muted max-w-3xl mx-auto mb-12">
              Yuno isn't just replacing CAPTCHAs—we're building the foundation for a more intelligent, 
              secure, and human-centered internet. Every interaction creates positive impact.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card variant="glass" className="text-center">
                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>

      {/* Benefits Sections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-32">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mb-6`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                  {benefit.title}
                </h2>
                
                <p className="text-xl text-muted mb-8">
                  {benefit.description}
                </p>
                
                <div className="space-y-3">
                  {benefit.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-neon-green mr-3 flex-shrink-0" />
                      <span className="text-secondary">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <Card variant="glow" className="p-8">
                  <div className="text-center">
                    <div className={`w-24 h-24 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <benefit.icon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-4">
                      Real-World Impact
                    </h3>
                    <div className="space-y-4">
                      {benefit.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="flex justify-between items-center">
                          <span className="text-muted text-sm">{stat.split(' ')[0]}</span>
                          <span className="font-semibold text-neon-blue">
                            {stat.split(' ').slice(1).join(' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 px-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-16 h-16 text-neon-purple mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              The Future of Human Intelligence
            </h2>
            <p className="text-xl text-muted mb-8">
              Yuno is building toward a decentralized, crowdsourced human intelligence layer that will 
              power the next generation of AI systems. Every challenge completed today contributes to 
              a more intelligent, ethical, and human-centered digital future.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card variant="glass" className="text-center">
                <Users className="w-8 h-8 text-neon-blue mx-auto mb-3" />
                <h3 className="font-semibold text-primary mb-2">Collective Intelligence</h3>
                <p className="text-sm text-muted">Harness the wisdom of crowds for AI training</p>
              </Card>
              <Card variant="glass" className="text-center">
                <TrendingUp className="w-8 h-8 text-neon-green mx-auto mb-3" />
                <h3 className="font-semibold text-primary mb-2">Continuous Learning</h3>
                <p className="text-sm text-muted">AI models that evolve with human feedback</p>
              </Card>
              <Card variant="glass" className="text-center">
                <Zap className="w-8 h-8 text-neon-purple mx-auto mb-3" />
                <h3 className="font-semibold text-primary mb-2">Instant Adaptation</h3>
                <p className="text-sm text-muted">Real-time response to emerging threats</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-muted mb-8">
              Join thousands of organizations already using Yuno to create a better internet. 
              Every verification makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleNavigation('/demo')} 
                disabled={isPending}
              >
                <Button size="lg" className="px-8">
                  Try Live Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </button>
              <button 
                onClick={() => handleNavigation('/auth/login')} 
                disabled={isPending}
              >
                <Button variant="secondary" size="lg" className="px-8">
                  Get Started
                </Button>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Impact;