import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Eye,
  FileText,
  Users,
  BarChart3,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import { 
  contentReviewSystem, 
  ContentReviewItem, 
  ReviewWorkflowState,
  getReviewStatusColor,
  getReviewStatusLabel,
  calculateReviewEfficiency
} from '../../../lib/content-review';
import { useAuth } from '../../../hooks/useAuth';

interface ContentReviewDashboardProps {
  onReviewItem?: (reviewId: string) => void;
  onBatchAction?: (contentIds: string[], action: string) => void;
}

const ContentReviewDashboard = ({ onReviewItem, onBatchAction }: ContentReviewDashboardProps) => {
  const [reviewItems, setReviewItems] = useState<ContentReviewItem[]>([]);
  const [workflowState, setWorkflowState] = useState<ReviewWorkflowState | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'needs_revision'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { adminUser } = useAuth();

  useEffect(() => {
    loadReviewData();
  }, []);

  const loadReviewData = async () => {
    try {
      setLoading(true);
      
      const [reviews, workflow] = await Promise.all([
        contentReviewSystem.getReviewHistory(),
        contentReviewSystem.getWorkflowState()
      ]);
      
      setReviewItems(reviews);
      setWorkflowState(workflow);
    } catch (error) {
      console.error('Error loading review data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchApprove = async () => {
    if (!adminUser || selectedItems.length === 0) return;
    
    try {
      await contentReviewSystem.batchReview(
        {
          content_ids: selectedItems,
          action: 'approve',
          batch_notes: 'Batch approved via review dashboard'
        },
        adminUser.id,
        adminUser.name
      );
      
      setSelectedItems([]);
      await loadReviewData();
      onBatchAction?.(selectedItems, 'approve');
    } catch (error) {
      console.error('Error in batch approve:', error);
    }
  };

  const handleBatchReject = async () => {
    if (!adminUser || selectedItems.length === 0) return;
    
    try {
      await contentReviewSystem.batchReview(
        {
          content_ids: selectedItems,
          action: 'reject',
          batch_notes: 'Batch rejected via review dashboard'
        },
        adminUser.id,
        adminUser.name
      );
      
      setSelectedItems([]);
      await loadReviewData();
      onBatchAction?.(selectedItems, 'reject');
    } catch (error) {
      console.error('Error in batch reject:', error);
    }
  };

  const handleAutoApprove = async () => {
    try {
      const autoApprovedIds = await contentReviewSystem.autoApproveHighQuality(85);
      await loadReviewData();
      
      if (autoApprovedIds.length > 0) {
        alert(`Auto-approved ${autoApprovedIds.length} high-quality items.`);
      } else {
        alert('No items met the auto-approval criteria.');
      }
    } catch (error) {
      console.error('Error in auto-approval:', error);
    }
  };

  const filteredItems = reviewItems.filter(item => {
    const matchesFilter = filter === 'all' || item.review_status === filter;
    const matchesSearch = searchTerm === '' || 
      item.content_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.review_notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const efficiency = calculateReviewEfficiency(reviewItems);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-neon-blue" />
          <span className="text-lg">Loading review dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Content Review Dashboard</h2>
          <p className="text-muted">Manage AI-generated content approval workflow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleAutoApprove} size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Auto-Approve High Quality
          </Button>
          <Button variant="secondary" onClick={loadReviewData} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Workflow Metrics */}
      {workflowState && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="glass" className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-orange to-yellow-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">{workflowState.total_pending}</div>
            <div className="text-sm text-muted">Pending Review</div>
          </Card>

          <Card variant="glass" className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">{workflowState.approval_rate.toFixed(1)}%</div>
            <div className="text-sm text-muted">Approval Rate</div>
          </Card>

          <Card variant="glass" className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">{workflowState.total_reviewed}</div>
            <div className="text-sm text-muted">Total Reviewed</div>
          </Card>

          <Card variant="glass" className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-violet-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">{efficiency.averageReviewTime}m</div>
            <div className="text-sm text-muted">Avg Review Time</div>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card variant="glass">
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by content ID or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="input-field"
          >
            <option value="all">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needs_revision">Needs Revision</option>
          </select>

          {selectedItems.length > 0 && (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleBatchApprove}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve ({selectedItems.length})
              </Button>
              <Button size="sm" variant="danger" onClick={handleBatchReject}>
                <XCircle className="w-4 h-4 mr-1" />
                Reject ({selectedItems.length})
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Review Items */}
      <Card variant="glass">
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p>No review items found matching your criteria.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 glass-light rounded-lg border transition-all duration-200 ${
                  selectedItems.includes(item.content_id) 
                    ? 'border-neon-blue bg-neon-blue/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.content_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(prev => [...prev, item.content_id]);
                        } else {
                          setSelectedItems(prev => prev.filter(id => id !== item.content_id));
                        }
                      }}
                      className="w-4 h-4 mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-mono text-sm text-muted">
                          {item.content_id.substring(0, 8)}...
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getReviewStatusColor(item.review_status)} bg-current/20`}>
                          {getReviewStatusLabel(item.review_status)}
                        </span>
                        {item.quality_feedback.overall_rating > 0 && (
                          <span className="px-2 py-1 rounded text-xs bg-neon-blue/20 text-neon-blue">
                            Quality: {item.quality_feedback.overall_rating}%
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted mb-2">
                        <span className="font-medium">Reviewer:</span> {item.reviewer_name}
                        <span className="ml-4 font-medium">Est. Time:</span> {item.estimated_review_time}m
                        <span className="ml-4 font-medium">Date:</span> {new Date(item.review_date).toLocaleDateString()}
                      </div>
                      
                      {item.review_notes && (
                        <p className="text-sm text-secondary mb-2">{item.review_notes}</p>
                      )}
                      
                      {item.suggested_improvements.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium text-neon-orange">Suggested Improvements:</span>
                          <ul className="list-disc list-inside text-muted mt-1">
                            {item.suggested_improvements.map((improvement, index) => (
                              <li key={index}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReviewItem?.(item.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Quality Trends */}
      {workflowState && workflowState.quality_trends.length > 0 && (
        <Card variant="glass">
          <h3 className="text-lg font-semibold text-primary mb-4">Quality Trends (Last 7 Days)</h3>
          <div className="grid grid-cols-7 gap-2">
            {workflowState.quality_trends.map((trend, index) => (
              <div key={trend.date} className="text-center">
                <div className="text-xs text-muted mb-1">
                  {new Date(trend.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className={`h-16 rounded flex items-end justify-center ${
                  trend.average_quality >= 80 ? 'bg-neon-green/20' :
                  trend.average_quality >= 60 ? 'bg-neon-orange/20' :
                  'bg-neon-red/20'
                }`}>
                  <div 
                    className={`w-full rounded ${
                      trend.average_quality >= 80 ? 'bg-neon-green' :
                      trend.average_quality >= 60 ? 'bg-neon-orange' :
                      'bg-neon-red'
                    }`}
                    style={{ height: `${Math.max(trend.average_quality / 100 * 100, 5)}%` }}
                  />
                </div>
                <div className="text-xs text-muted mt-1">
                  {trend.average_quality > 0 ? `${trend.average_quality}%` : 'No data'}
                </div>
                <div className="text-xs text-muted">
                  ({trend.review_count})
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContentReviewDashboard;