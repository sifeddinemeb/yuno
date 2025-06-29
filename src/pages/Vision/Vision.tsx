import { motion } from 'framer-motion';
import { ArrowRight, Shield, Brain, Zap, CheckCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import PublicNavbar from '../../components/layout/PublicNavbar/PublicNavbar';
import YunoWidget from '../../components/widget/YunoWidget/YunoWidget';

const Vision = () => {
  return (
    <div>
      <PublicNavbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Stop Annoying Users.<br className="hidden md:block" />
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">Start Fueling AI.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-8">
              Frustrating CAPTCHAs waste <span className="font-semibold">500 years</span> of human time every single day. Yuno replaces those aggravating puzzles with 
delightful micro-challenges that delight users while training tomorrow's AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" className="px-8">
                  Try Live Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/impact">
                <Button variant="secondary" size="lg" className="px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card variant="glass">
              <h3 className="text-4xl font-extrabold text-primary">4.5B</h3>
              <p className="text-muted mt-2">CAPTCHAs solved each day</p>
            </Card>
            <Card variant="glass">
              <h3 className="text-4xl font-extrabold text-primary">40%</h3>
              <p className="text-muted mt-2">Avg. conversion loss</p>
            </Card>
            <Card variant="glass">
              <h3 className="text-4xl font-extrabold text-primary">85%</h3>
              <p className="text-muted mt-2">Users abandon forms</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              The CAPTCHA Dead End
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Traditional verification systems are broken. Users hate them, bots bypass them, 
              and valuable human intelligence goes to waste.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="glass" className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-red to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">User Frustration</h3>
              <p className="text-muted">
                67% of users abandon sites due to difficult CAPTCHAs, leading to lost conversions and revenue.
              </p>
            </Card>
            
            <Card variant="glass" className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-orange to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Security Theater</h3>
              <p className="text-muted">
                Advanced bots solve CAPTCHAs faster than humans, making traditional verification obsolete.
              </p>
            </Card>
            
            <Card variant="glass" className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Wasted Intelligence</h3>
              <p className="text-muted">
                Billions of human micro-interactions provide no value beyond basic verification.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Transform Friction Into Fuel
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Yuno's cognitive micro-challenges make verification delightful while generating 
              high-quality training data for next-generation AI systems.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card variant="glow" className="text-center">
              <Zap className="w-12 h-12 text-neon-blue mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-primary mb-4">Delight Users</h3>
              <p className="text-muted mb-6">
                Engaging challenges that users actually enjoy completing, turning verification into entertainment.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                  Intuitive interactions
                </li>
                <li className="flex items-center text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                  Instant feedback
                </li>
                <li className="flex items-center text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                  Accessibility-first design
                </li>
              </ul>
            </Card>
            
            <Card variant="glow" className="text-center">
              <Brain className="w-12 h-12 text-neon-purple mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-primary mb-4">Improve AI</h3>
              <p className="text-muted mb-6">
                Every interaction generates valuable training data for reasoning, ethics, and cultural understanding.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                  Ethical reasoning data
                </li>
                <li className="flex items-center text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                  Cultural context signals
                </li>
                <li className="flex items-center text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                  Nuanced human judgment
                </li>
              </ul>
            </Card>
            
            <Card variant="glow" className="text-center">
              <Shield className="w-12 h-12 text-neon-green mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-primary mb-4">Detect Bots</h3>
              <p className="text-muted mb-6">
                Advanced behavioral analysis and cognitive patterns that evolve faster than bot capabilities.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                  Real-time adaptation
                </li>
                <li className="flex items-center text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                  Behavioral fingerprinting
                </li>
                <li className="flex items-center text-sm text-secondary">
                  <CheckCircle className="w-4 h-4 text-neon-green mr-2" />
                  99.7% accuracy rate
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Proof of Mind */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-glass-light">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Introducing "Proof of Mind"
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Beyond simple verification lies true human intelligence validation. Our challenges tap into 
              uniquely human capabilities: cultural understanding, ethical reasoning, and creative problem-solving.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-6">Challenge Categories</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-secondary">Cultural Intelligence</h4>
                    <p className="text-muted text-sm">Meme chronology, slang interpretation, cultural references</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-purple rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-secondary">Emotional Nuance</h4>
                    <p className="text-muted text-sm">Sarcasm detection, tone analysis, social context</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-green rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-secondary">Ethical Reasoning</h4>
                    <p className="text-muted text-sm">Moral dilemmas, value judgments, fairness assessment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-orange rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-secondary">Creative Problem-Solving</h4>
                    <p className="text-muted text-sm">Lateral thinking, pattern recognition, intuitive leaps</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card variant="glass" className="p-8">
              <h3 className="text-xl font-semibold text-primary mb-4 text-center">
                The Intelligence Advantage
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Bot Detection Rate</span>
                  <span className="text-neon-green font-semibold">99.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">User Satisfaction</span>
                  <span className="text-neon-blue font-semibold">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Completion Time</span>
                  <span className="text-neon-purple font-semibold">8.3s avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">AI Training Value</span>
                  <span className="text-neon-orange font-semibold">10x higher</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Experience Yuno Live
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-12">
              Try our verification widget right here. See how quick, intuitive, and engaging 
              human verification can be.
            </p>
            
            <YunoWidget 
              onVerified={(sessionId) => console.log('Verified:', sessionId)}
              onFailed={(sessionId) => console.log('Failed:', sessionId)}
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Ready to Transform Your Verification?
            </h2>
            <p className="text-xl text-muted mb-8">
              Join the next generation of human verification. Delight your users while contributing 
              to the future of AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" className="px-8">
                  Try Live Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="secondary" size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Vision;