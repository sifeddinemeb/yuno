import { motion } from 'framer-motion';
import { Check, CheckCircle, Zap, Shield, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import PublicNavbar from '../../components/layout/PublicNavbar/PublicNavbar';
import BackgroundBlobs from '../../components/layout/BackgroundBlobs/BackgroundBlobs';

const Pricing = () => {
  const pricingTiers = [
    {
      name: 'Starter',
      price: '$39',
      period: '/month',
      description: 'For small websites and startups',
      features: [
        'Up to 10,000 verifications',
        'Standard challenge library',
        'Basic bot detection',
        'Email support',
        '99.5% uptime SLA'
      ],
      highlighted: false,
      buttonText: 'Get Started',
      buttonVariant: 'secondary' as const
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Up to 50,000 verifications',
        'Full challenge library',
        'Advanced bot detection',
        'Priority email support',
        '99.9% uptime SLA',
        'Custom branding options',
        'API access'
      ],
      highlighted: true,
      buttonText: 'Get Started',
      buttonVariant: 'primary' as const
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For high-traffic websites',
      features: [
        'Unlimited verifications',
        'Custom challenges',
        'Enterprise-grade security',
        'Dedicated support team',
        '99.99% uptime SLA',
        'Full white labeling',
        'Advanced analytics',
        'On-premises deployment option'
      ],
      highlighted: false,
      buttonText: 'Contact Us',
      buttonVariant: 'secondary' as const
    }
  ];

  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <BackgroundBlobs />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent
              <br />
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
              Choose the plan that fits your needs. All plans include our core verification technology 
              and contribute to training better AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  variant={tier.highlighted ? "glow" : "glass"} 
                  className={`h-full flex flex-col ${
                    tier.highlighted ? 'border-2 border-neon-blue relative z-10 transform md:scale-105' : ''
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-extrabold">{tier.price}</span>
                      <span className="text-lg text-muted ml-1">{tier.period}</span>
                    </div>
                    <p className="text-muted mb-6">{tier.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className={`w-5 h-5 mr-2 flex-shrink-0 ${
                            tier.highlighted ? 'text-neon-blue' : 'text-neon-green'
                          }`} />
                          <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-6 pt-0 mt-auto">
                    <Link to="/auth/signup">
                      <Button
                        variant={tier.buttonVariant}
                        className="w-full"
                      >
                        {tier.buttonText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12 text-muted">
            <p>All prices are in USD and exclude applicable taxes.</p>
            <p className="mt-2">Need a custom solution? <Link to="/auth/login" className="text-neon-blue hover:text-neon-purple">Contact our sales team</Link></p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-neon-blue/5 to-neon-purple/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          </motion.div>
          
          <div className="space-y-6">
            <Card variant="glass" className="p-6">
              <h3 className="text-xl font-semibold mb-3">What happens if I exceed my monthly verification limit?</h3>
              <p className="text-muted">
                We'll never disable your verification service. If you exceed your limit, we'll continue processing verifications and 
                contact you to discuss upgrading to a more suitable plan.
              </p>
            </Card>
            
            <Card variant="glass" className="p-6">
              <h3 className="text-xl font-semibold mb-3">Can I switch plans at any time?</h3>
              <p className="text-muted">
                Yes, you can upgrade, downgrade, or cancel your plan at any time from your account dashboard. 
                Plan changes take effect at the start of the next billing cycle.
              </p>
            </Card>
            
            <Card variant="glass" className="p-6">
              <h3 className="text-xl font-semibold mb-3">Is there a free trial available?</h3>
              <p className="text-muted">
                Yes, we offer a 14-day free trial on all plans with no credit card required. You'll get full access to all features
                and can verify up to 1,000 users during the trial period.
              </p>
            </Card>
            
            <Card variant="glass" className="p-6">
              <h3 className="text-xl font-semibold mb-3">How is a "verification" counted?</h3>
              <p className="text-muted">
                A verification is counted each time a user completes a challenge successfully or unsuccessfully. 
                Multiple attempts by the same user within a 30-minute window count as a single verification.
              </p>
            </Card>
            
            <Card variant="glass" className="p-6">
              <h3 className="text-xl font-semibold mb-3">Do you offer discounts for non-profits or educational institutions?</h3>
              <p className="text-muted">
                Yes, we offer special pricing for non-profits, educational institutions, and open-source projects. 
                Please contact our sales team to learn more.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Verification Experience?
            </h2>
            <p className="text-xl text-muted mb-8">
              Join thousands of websites that have switched to Yuno for better security, 
              happier users, and a more ethical internet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup">
                <Button size="lg" className="px-8">
                  Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="secondary" size="lg" className="px-8">
                  See It In Action
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;