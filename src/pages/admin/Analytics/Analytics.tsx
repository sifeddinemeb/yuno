import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Filter,
  Search, 
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Bot,
  Clock,
  RefreshCw,
  AlertCircle,
  X,
  Copy
} from 'lucide-react';
import Card from '../../../components/ui/Card/Card';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import SkeletonLoader from '../../../components/ui/SkeletonLoader/SkeletonLoader';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { analyticsApi, responseApi } from '../../../lib/api';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [challengeTypeFilter, setChallengeTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const itemsPerPage = 20;

  // Sample data for demonstration
  const [challengePerformance, setChallengePerformance] = useState([
    { type: 'SentimentSpectrum', human_pass_rate: 92 },
    { type: 'MemeTimeWarp', human_pass_rate: 88 },
    { type: 'EthicsPing', human_pass_rate: 95 },
    { type: 'PatternPlay', human_pass_rate: 85 },
    { type: 'PerceptionFlip', human_pass_rate: 90 },
    { type: 'SocialDecoder', human_pass_rate: 93 }
  ]);
  
  const [dailyMetrics, setDailyMetrics] = useState([
    { date: '2025-01-01', human_pass_rate: 91, avg_response_time: 8.2 },
    { date: '2025-01-02', human_pass_rate: 92, avg_response_time: 8.1 },
    { date: '2025-01-03', human_pass_rate: 90, avg_response_time: 8.3 },
    { date: '2025-01-04', human_pass_rate: 93, avg_response_time: 8.0 },
    { date: '2025-01-05', human_pass_rate: 94, avg_response_time: 7.9 },
    { date: '2025-01-06', human_pass_rate: 92, avg_response_time: 8.2 },
    { date: '2025-01-07', human_pass_rate: 93, avg_response_time: 8.1 }
  ]);
  
  const [rawResponses, setRawResponses] = useState([
    {
      session_id: 'f8a7b6c5d4e3f2a1',
      challenge_id: 'a1b2c3d4e5f6a7b8',
      challenge_type: 'SentimentSpectrum',
      response_time_ms: 7500,
      is_human: true,
      signal_tags: ['sarcasm', 'workplace-culture'],
      created_at: '2025-01-07T12:34:56Z'
    },
    {
      session_id: 'e7d6c5b4a3e2d1c0',
      challenge_id: 'b2c3d4e5f6a7b8c9',
      challenge_type: 'MemeTimeWarp',
      response_time_ms: 9200,
      is_human: true,
      signal_tags: ['chronology', 'internet-culture'],
      created_at: '2025-01-07T12:30:22Z'
    },
    {
      session_id: 'd6c5b4a3e2d1c0b9',
      challenge_id: 'c3d4e5f6a7b8c9d0',
      challenge_type: 'EthicsPing',
      response_time_ms: 12500,
      is_human: false,
      signal_tags: ['ethics', 'privacy'],
      created_at: '2025-01-07T12:28:15Z'
    },
    {
      session_id: 'c5b4a3e2d1c0b9a8',
      challenge_id: 'd4e5f6a7b8c9d0e1',
      challenge_type: 'PatternPlay',
      response_time_ms: 6800,
      is_human: true,
      signal_tags: ['pattern-recognition', 'logic'],
      created_at: '2025-01-07T12:25:44Z'
    },
    {
      session_id: 'b4a3e2d1c0b9a8f7',
      challenge_id: 'e5f6a7b8c9d0e1f2',
      challenge_type: 'PerceptionFlip',
      response_time_ms: 8300,
      is_human: true,
      signal_tags: ['perception', 'visual'],
      created_at: '2025-01-07T12:20:18Z'
    }
  ]);
  
  const [dashboardMetrics, setDashboardMetrics] = useState({
    humanPassRate: 92.5,
    botDetectionRate: 7.5,
    avgResponseTime: 8.3,
    totalAttempts: 1254
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would fetch data from the API
      // For now, we'll just simulate a delay and use our sample data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading analytics data:', err);
      setError(err.message || 'Failed to load analytics data');
      setLoading(false);
    }
  };

  // Response time distribution data
  const responseTimeDistribution = [
    { range: '0-5s', count: 312 },
    { range: '5-10s', count: 625 },
    { range: '10-15s', count: 208 },
    { range: '15-20s', count: 83 },
    { range: '20s+', count: 26 },
  ];

  // Bot activity data
  const botActivityData = [
    { type: 'Pattern Recognition Failure', count: 35 },
    { type: 'Response Time Anomaly', count: 28 },
    { type: 'Behavioral Inconsistency', count: 16 },
    { type: 'Multiple Rapid Attempts', count: 14 },
    { type: 'Invalid Input Format', count: 7 },
  ];

  const filteredData = rawResponses.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.challenge_id && item.challenge_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = challengeTypeFilter === 'all' || 
      item.challenge_type === challengeTypeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const COLORS = ['#00d4ff', '#8b5cf6', '#f472b6', '#10b981', '#f97316'];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (loading) {
    return (
      <Card variant="glass" className="p-8">
        <SkeletonLoader variant="text" className="w-1/3 h-8 mb-2" />
        <SkeletonLoader variant="text" className="w-2/3 h-4 mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
          <SkeletonLoader variant="rect" className="h-32" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <SkeletonLoader variant="rect" className="h-64" />
          <SkeletonLoader variant="rect" className="h-64" />
        </div>
        
        <SkeletonLoader variant="rect" className="h-96" />
      </Card>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
            <p className="text-muted">Deep dive into human behavior and bot detection patterns</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="secondary" onClick={loadAnalyticsData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 bg-neon-red/20 border border-neon-red/30 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-neon-red" />
          <span className="text-neon-red text-sm">{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card variant="glass">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by Session ID or Challenge ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                startIcon={<Search className="w-4 h-4" />}
                aria-label="Search responses"
              />
            </div>
            <select
              value={challengeTypeFilter}
              onChange={(e) => setChallengeTypeFilter(e.target.value)}
              className="input-field"
              aria-label="Filter by challenge type"
            >
              <option value="all">All Challenge Types</option>
              <option value="SentimentSpectrum">Sentiment Spectrum</option>
              <option value="MemeTimeWarp">Meme Time Warp</option>
              <option value="EthicsPing">Ethics Ping</option>
              <option value="PatternPlay">Pattern Play</option>
              <option value="VoiceCheck">Voice Check</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
              aria-label="Filter by date range"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card variant="glass" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardMetrics.humanPassRate}%</div>
          <div className="text-sm text-muted mb-2">Human Pass Rate</div>
          <div className="flex items-center justify-center text-xs text-neon-green">
            <TrendingUp className="w-3 h-3 mr-1" />
            Real-time
          </div>
        </Card>

        <Card variant="glass" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-red to-red-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardMetrics.botDetectionRate}%</div>
          <div className="text-sm text-muted mb-2">Bot Detection</div>
          <div className="flex items-center justify-center text-xs text-neon-green">
            <TrendingUp className="w-3 h-3 mr-1" />
            Real-time
          </div>
        </Card>

        <Card variant="glass" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-orange to-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardMetrics.avgResponseTime}s</div>
          <div className="text-sm text-muted mb-2">Avg Response Time</div>
          <div className="flex items-center justify-center text-xs text-neon-blue">
            <TrendingUp className="w-3 h-3 mr-1" />
            Real-time
          </div>
        </Card>

        <Card variant="glass" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-emerald-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{dashboardMetrics.totalAttempts.toLocaleString()}</div>
          <div className="text-sm text-muted mb-2">Total Attempts</div>
          <div className="flex items-center justify-center text-xs text-neon-green">
            <TrendingUp className="w-3 h-3 mr-1" />
            Today
          </div>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card variant="glass">
            <h3 className="text-xl font-semibold mb-6">Daily Performance Trends</h3>
            <div className="h-80">
              {dailyMetrics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      tickLine={true}
                      axisLine={true}
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tickLine={true}
                      axisLine={true}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="human_pass_rate" 
                      stroke="#00d4ff" 
                      strokeWidth={2}
                      name="Human Pass Rate (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avg_response_time" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Avg Response Time (s)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted">
                  No daily metrics available yet
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card variant="glass">
            <h3 className="text-xl font-semibold mb-6">Challenge Performance</h3>
            <div className="h-80">
              {challengePerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={challengePerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="type" 
                      stroke="#9CA3AF" 
                      tickLine={true}
                      axisLine={true}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tickLine={true}
                      axisLine={true}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="human_pass_rate" fill="#00d4ff" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted">
                  No challenge performance data available yet
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card variant="glass">
            <h3 className="text-xl font-semibold mb-6">Response Time Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseTimeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="range" 
                    stroke="#9CA3AF"
                    tickLine={true}
                    axisLine={true}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tickLine={true}
                    axisLine={true}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card variant="glass">
            <h3 className="text-xl font-semibold mb-6">Bot Activity Patterns</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={botActivityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {botActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Raw Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card variant="glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Raw Response Data</h3>
            <div className="text-sm text-muted">
              Showing {paginatedData.length} of {filteredData.length} results
            </div>
          </div>
          
          <div className="table-container overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Session ID</th>
                  <th className="text-left py-3 px-4">Challenge ID</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Response Time</th>
                  <th className="text-left py-3 px-4">Human</th>
                  <th className="text-left py-3 px-4">Signal Tags</th>
                  <th className="text-left py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-glass-light transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">
                      <div className="flex items-center">
                        <span>{row.session_id.substring(0, 8)}...</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-1 p-1" 
                          onClick={() => copyToClipboard(row.session_id, `session-${index}`)}
                          aria-label="Copy session ID"
                        >
                          {copiedId === `session-${index}` ? (
                            <span className="text-neon-green text-xs">Copied!</span>
                          ) : (
                            <Copy className="w-3 h-3 text-muted" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">
                      <div className="flex items-center">
                        <span>{row.challenge_id ? `${row.challenge_id.substring(0, 8)}...` : 'N/A'}</span>
                        {row.challenge_id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-1 p-1" 
                            onClick={() => copyToClipboard(row.challenge_id, `challenge-${index}`)}
                            aria-label="Copy challenge ID"
                          >
                            {copiedId === `challenge-${index}` ? (
                              <span className="text-neon-green text-xs">Copied!</span>
                            ) : (
                              <Copy className="w-3 h-3 text-muted" />
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{row.challenge_type}</td>
                    <td className="py-3 px-4">{row.response_time_ms}ms</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row.is_human ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'
                      }`}>
                        {row.is_human ? 'Human' : 'Bot'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {row.signal_tags?.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs">
                            {tag}
                          </span>
                        )) || <span className="text-muted text-xs">None</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {paginatedData.length === 0 && (
              <div className="text-center py-8 text-muted">
                {rawResponses.length === 0 ? 'No response data available yet' : 'No responses match your filters'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-neon-blue text-white'
                          : 'text-muted hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;