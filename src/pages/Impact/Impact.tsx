import { motion } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  AlertCircle,
  TrendingUp, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import PublicNavbar from '../../components/layout/PublicNavbar/PublicNavbar';

const Impact = () => {
  return (
    <div className="bg-dark-100">
      <PublicNavbar />

      {/* Hero Section - The CAPTCHA Crisis */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The <span className="text-white">CAPTCHA</span>
              <br />
              <span className="text-neon-red">Crisis</span>
            </h1>
            
            <p className="text-xl text-muted max-w-3xl mx-auto mb-12">
              Every day, humanity wastes <span className="text-neon-red font-semibold">500 years</span> solving meaningless puzzles that modern AI 
              can beat faster than humans. Meanwhile, AI development starves for quality data.
            </p>

            {/* Crisis Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Card variant="glass" className="text-center">
                <h2 className="text-4xl font-extrabold text-neon-blue mb-2">40%</h2>
                <p className="font-semibold mb-1">Conversion Loss</p>
                <p className="text-xs text-muted">Due to CAPTCHA friction and abandonment</p>
              </Card>

              <Card variant="glass" className="text-center">
                <h2 className="text-4xl font-extrabold text-neon-purple mb-2">99%</h2>
                <p className="font-semibold mb-1">AI Success Rate</p>
                <p className="text-xs text-muted">Modern AI solves CAPTCHAs better than humans</p>
              </Card>

              <Card variant="glass" className="text-center">
                <h2 className="text-4xl font-extrabold text-neon-green mb-2">$30</h2>
                <p className="font-semibold mb-1">Lost Per $1 Fraud</p>
                <p className="text-xs text-muted">By blocking legitimate users with bad UX</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The RealCaptcha Revolution */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
              The <span className="text-white">RealCaptcha</span>
              <br />
              <span className="text-neon-blue">Revolution</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              We're not just fixing CAPTCHA—we're creating the world's largest source of human reasoning data
              while making the internet more secure and accessible.
            </p>
          </motion.div>

          {/* Problem vs Solution */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card variant="glass" className="text-left">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-neon-red/20 rounded-full flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-neon-red" />
                </div>
                <h3 className="text-2xl font-semibold">The Problem</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-neon-red mr-2">•</span>
                  <span>Traditional CAPTCHAs are easily defeated by modern AI</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-red mr-2">•</span>
                  <span>Users spend 25 seconds on average per challenge</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-red mr-2">•</span>
                  <span>Accessibility barriers exclude millions of users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-red mr-2">•</span>
                  <span>Generated data serves no useful purpose</span>
                </li>
              </ul>
            </Card>

            <Card variant="glass" className="text-left">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-neon-blue/20 rounded-full flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-neon-blue" />
                </div>
                <h3 className="text-2xl font-semibold">Our Solution</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-neon-blue mr-2">•</span>
                  <span>AI-resistant cognitive challenges that evolve</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-blue mr-2">•</span>
                  <span>5-10 second completion times</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-blue mr-2">•</span>
                  <span>Fully accessible to all users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-blue mr-2">•</span>
                  <span>Every interaction generates valuable AI training data</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="flex justify-center">
            <Link to="/demo">
              <Button size="lg" className="px-8">
                Experience The Future <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Triple Win Value Loop */}
      <section className="py-20 px-4 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              Triple Win
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-neon-purple mb-6">
              Value Loop
            </h3>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Every interaction creates value for users, websites, and the entire AI ecosystem
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="glass" className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-neon-blue" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Users Win</h3>
              <p className="text-muted mb-6">
                Fast, intuitive challenges that feel like mini-games instead of tests. Your intelligence contributes to 
                advancing AI without any privacy concerns.
              </p>
              <div className="text-sm text-neon-blue">
                5x faster than traditional CAPTCHAs
              </div>
            </Card>

            <Card variant="glass" className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-neon-green" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Websites Win</h3>
              <p className="text-muted mb-6">
                Higher conversion rates, better security against modern bots, and access to valuable user behavior insights.
              </p>
              <div className="text-sm text-neon-green">
                Up to 40% conversion improvement
              </div>
            </Card>

            <Card variant="glass" className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-neon-purple" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Ecosystem Wins</h3>
              <p className="text-muted mb-6">
                Access unprecedented human reasoning data for training safer, more capable AI systems across culture, ethics, and logic.
              </p>
              <div className="text-sm text-neon-purple">
                Ethical, structured training data
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Market Disruption */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              Market
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-neon-orange mb-6">
              Disruption
            </h3>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              We're not competing with Google head-on. We're exploiting structural weaknesses in their model 
              through classic disruption theory.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card variant="glass" className="text-left">
              <h3 className="text-xl font-semibold text-neon-red mb-4">Google's Structural Problem</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-neon-red mr-2">•</span>
                  <span>Uses reCAPTCHA data for internal projects only</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-red mr-2">•</span>
                  <span>Cannot sell data to AI competitors (no upside)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-red mr-2">•</span>
                  <span>Poor user experience due to extractive model</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-red mr-2">•</span>
                  <span>Market too small for their massive scale needs</span>
                </li>
              </ul>
            </Card>

            <Card variant="glass" className="text-left">
              <h3 className="text-xl font-semibold text-neon-green mb-4">Our Asymmetric Advantage</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-neon-green mr-2">•</span>
                  <span>Neutral data provider to entire AI ecosystem</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-2">•</span>
                  <span>Multi-billion dollar data market opportunity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-2">•</span>
                  <span>Superior user experience drives adoption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-2">•</span>
                  <span>Strategic speed and focus advantage</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20 px-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-dark-200 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-neon-blue" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Vision
            </h2>
            <p className="text-xl text-muted mb-8">
              A world where every human interaction with technology is meaningful, enjoyable, and contributes to the advancement of artificial 
              intelligence. Where security doesn't come at the cost of user experience, and where billions of hours of human time fuel AI 
              development instead of being wasted on meaningless tasks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" className="px-8">
                  Experience The Future
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="secondary" size="lg" className="px-8">
                  Join The Revolution
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Impact;