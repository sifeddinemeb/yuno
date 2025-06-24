import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  Activity,
  ChevronUp,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import Card from '../../../components/ui/Card/Card';
import SkeletonLoader from '../../../components/ui/SkeletonLoader/SkeletonLoader';
import ErrorBoundary from '../../../components/ui/ErrorBoundary/ErrorBoundary';
import A11yTooltip from '../../../components/ui/A11yTooltip/A11yTooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { analyticsApi } from '../../../lib/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    humanPassRate: 0,
    botDetectionRate: 0,
    avgResponseTime: 0,
    totalAttempts: 0,
    activeChallenges: 0,
    activeIntegrations: 0,
  });
  const [dailyMetrics, setDailyMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recentActivity = [
    { id: 1, action: 'New challenge created', details: 'Sentiment Spectrum #3', time: '2 minutes ago' },
    { id: 2, action: 'Bot detection spike', details: '15% increase detected', time: '5 minutes ago' },
    { id: 3, action: 'API key generated', details: 'client-dashboard-prod', time: '1 hour ago' },
    { id: 4, action: 'Challenge disabled', details: 'Ethics Ping #7', time: '2 hours ago' },
    { id: 5, action: 'New integration', details: 'example.com', time: '4 hours ago' },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard metrics
      const dashboardMetrics = await analyticsApi.getDashboardMetrics();
      setMetrics(dashboardMetrics);

      // Load daily metrics for chart
      const daily = await analyticsApi.getDailyMetrics();
      setDailyMetrics(daily || []);

    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card variant="glass" className="p-8">
        <SkeletonLoader variant="text" className="w-1/3 h-8 mb-2" />
        <SkeletonLoader variant="text" className="w-2/3 h-4 mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <SkeletonLoader variant="rect" className="h-64" />
          <SkeletonLoader variant="rect" className="h-64" />
        </div>
        
        <SkeletonLoader variant="rect" className="h-40" />
      </Card>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="glass" className="p-8 text-center">
          <div className="text-neon-red mb-4">Error loading dashboard</div>
          <p className="text-muted mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="btn-primary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
            <p className="text-muted">Monitor your Yuno verification system performance</p>
          </div>
          <button 
            onClick={loadDashboardData}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6"
      >
        <Card variant="glass" className="text-center" tabIndex={0}>
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{metrics.humanPassRate}%</div>
          <div className="text-sm text-muted mb-2">Human Pass Rate</div>
          <div className="flex items-center justify-center text-xs text-neon-green">
            <ChevronUp className="w-3 h-3 mr-1" />
            Today
          </div>
          <div className="sr-only">Human Pass Rate: {metrics.humanPassRate} percent, trending up today</div>
        </Card>

        <Card variant="glass" className="text-center" tabIndex={0}>
          <A11yTooltip content="Percentage of verification attempts identified as bots" id="bot-detection">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-red to-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </A11yTooltip>
          <div className="text-2xl font-bold text-primary mb-1">{metrics.botDetectionRate}%</div>
          <div className="text-sm text-muted mb-2">Bot Detection</div>
          <div className="flex items-center justify-center text-xs text-neon-green">
            <ChevronUp className="w-3 h-3 mr-1" />
            Today
          </div>
          <div className="sr-only">Bot Detection Rate: {metrics.botDetectionRate} percent, trending up today</div>
        </Card>

        <Card variant="glass" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-orange to-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{metrics.avgResponseTime}s</div>
          <div className="text-sm text-muted mb-2">Avg Response Time</div>
          <div className="flex items-center justify-center text-xs text-neon-blue">
            <ChevronUp className="w-3 h-3 mr-1" />
            Today
          </div>
        </Card>

        <Card variant="glass" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-emerald-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{metrics.totalAttempts.toLocaleString()}</div>
          <div className="text-sm text-muted mb-2">Total Attempts</div>
          <div className="flex items-center justify-center text-xs text-neon-green">
            <ChevronUp className="w-3 h-3 mr-1" />
            Today
          </div>
        </Card>

        <Card variant="glass" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-violet-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{metrics.activeChallenges}</div>
          <div className="text-sm text-muted mb-2">Active Challenges</div>
          <div className="flex items-center justify-center text-xs text-neon-blue">
            <ChevronUp className="w-3 h-3 mr-1" />
            Live
          </div>
        </Card>

        <Card variant="glass" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-pink to-pink-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{metrics.activeIntegrations}</div>
          <div className="text-sm text-muted mb-2">Active Integrations</div>
          <div className="flex items-center justify-center text-xs text-neon-green">
            <ChevronUp className="w-3 h-3 mr-1" />
            Live
          </div>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8" aria-label="Dashboard Charts">
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card variant="glass">
              <h3 className="text-xl font-semibold text-primary mb-6">Daily Verification Trends</h3>
              <div className="h-64">
                {dailyMetrics.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF" 
                        tickLine={true}
                        axisLine={true}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        aria-label="Date"
                        style={{ fontSize: '0.75rem' }}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        tickLine={true}
                        axisLine={true}
                        aria-label="Value"
                        style={{ fontSize: '0.75rem' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="human_verifications" 
                        stackId="1"
                        stroke="#00d4ff" 
                        fill="url(#humanGradient)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bot_detections" 
                        stackId="1"
                        stroke="#ef4444" 
                        fill="url(#botGradient)" 
                      />
                      <defs>
                        <linearGradient id="humanGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="botGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted">
                    No data available yet
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </ErrorBoundary>

        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card variant="glass">
              <h3 className="text-xl font-semibold text-primary mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-700 last:border-b-0">
                    <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-primary font-medium text-sm">{activity.action}</p>
                      <p className="text-muted text-sm">{activity.details}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </ErrorBoundary>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card variant="glass">
          <h3 className="text-xl font-semibold text-primary mb-6">System Status</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" aria-hidden="true"></div>
              <div>
                <p className="text-primary font-medium">Supabase Database</p>
                <p className="text-muted text-sm">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" aria-hidden="true"></div>
              <div>
                <p className="text-primary font-medium">Authentication</p>
                <p className="text-muted text-sm">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" aria-hidden="true"></div>
              <div>
                <p className="text-primary font-medium">Widget API</p>
                <p className="text-muted text-sm">Operational</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;