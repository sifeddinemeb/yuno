/**
 * Content review and human approval workflow system
 * Sprint 7: AI-Assisted Content Generation
 */

import { supabase } from './supabase';
import { GeneratedContent } from './gemini-api';

export interface ContentReviewItem {
  id: string;
  content_id: string;
  reviewer_id: string;
  reviewer_name: string;
  review_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  review_notes: string;
  quality_feedback: {
    coherence: number;
    accuracy: number;
    engagement: number;
    safety: number;
    overall_rating: number;
  };
  suggested_improvements: string[];
  review_date: string;
  estimated_review_time: number; // minutes
}

export interface ReviewWorkflowState {
  total_pending: number;
  total_reviewed: number;
  approval_rate: number;
  average_review_time: number;
  quality_trends: {
    date: string;
    average_quality: number;
    review_count: number;
  }[];
}

export interface BatchReviewRequest {
  content_ids: string[];
  action: 'approve' | 'reject' | 'needs_revision';
  batch_notes?: string;
  apply_to_similar?: boolean;
}

class ContentReviewSystem {
  
  /**
   * Submit content for human review
   */
  async submitForReview(content: GeneratedContent): Promise<ContentReviewItem> {
    try {
      const reviewItem: Omit<ContentReviewItem, 'id' | 'review_date'> = {
        content_id: content.id,
        reviewer_id: '', // Will be assigned by workflow
        reviewer_name: 'Pending Assignment',
        review_status: 'pending',
        review_notes: '',
        quality_feedback: {
          coherence: 0,
          accuracy: 0,
          engagement: 0,
          safety: 0,
          overall_rating: 0
        },
        suggested_improvements: [],
        estimated_review_time: this.estimateReviewTime(content)
      };

      // In a full implementation, this would be stored in a dedicated review table
      // For now, we'll use local storage and state management
      const reviewId = crypto.randomUUID();
      const fullReviewItem: ContentReviewItem = {
        ...reviewItem,
        id: reviewId,
        review_date: new Date().toISOString()
      };

      // Store in browser storage for demo (in production, use database)
      this.storeReviewItem(fullReviewItem);

      return fullReviewItem;
    } catch (error) {
      console.error('Error submitting content for review:', error);
      throw error;
    }
  }

  /**
   * Get pending reviews for a reviewer
   */
  async getPendingReviews(reviewerId?: string): Promise<ContentReviewItem[]> {
    try {
      const allReviews = this.getAllReviewItems();
      return allReviews.filter(review => 
        review.review_status === 'pending' && 
        (!reviewerId || review.reviewer_id === reviewerId)
      );
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      return [];
    }
  }

  /**
   * Submit a review for content
   */
  async submitReview(reviewData: {
    review_id: string;
    reviewer_id: string;
    reviewer_name: string;
    status: 'approved' | 'rejected' | 'needs_revision';
    notes: string;
    quality_feedback: ContentReviewItem['quality_feedback'];
    suggested_improvements: string[];
  }): Promise<ContentReviewItem> {
    try {
      const allReviews = this.getAllReviewItems();
      const reviewIndex = allReviews.findIndex(r => r.id === reviewData.review_id);
      
      if (reviewIndex === -1) {
        throw new Error('Review item not found');
      }

      const updatedReview: ContentReviewItem = {
        ...allReviews[reviewIndex],
        reviewer_id: reviewData.reviewer_id,
        reviewer_name: reviewData.reviewer_name,
        review_status: reviewData.status,
        review_notes: reviewData.notes,
        quality_feedback: reviewData.quality_feedback,
        suggested_improvements: reviewData.suggested_improvements,
        review_date: new Date().toISOString()
      };

      allReviews[reviewIndex] = updatedReview;
      this.storeAllReviewItems(allReviews);

      // If approved, activate the challenge
      if (reviewData.status === 'approved') {
        await this.activateApprovedContent(updatedReview.content_id);
      }

      return updatedReview;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  /**
   * Batch review multiple content items
   */
  async batchReview(request: BatchReviewRequest, reviewerId: string, reviewerName: string): Promise<ContentReviewItem[]> {
    const results: ContentReviewItem[] = [];
    
    for (const contentId of request.content_ids) {
      try {
        const allReviews = this.getAllReviewItems();
        const review = allReviews.find(r => r.content_id === contentId);
        
        if (review) {
          const updatedReview = await this.submitReview({
            review_id: review.id,
            reviewer_id: reviewerId,
            reviewer_name: reviewerName,
            status: request.action,
            notes: request.batch_notes || `Batch ${request.action}`,
            quality_feedback: {
              coherence: request.action === 'approved' ? 80 : 40,
              accuracy: request.action === 'approved' ? 80 : 40,
              engagement: request.action === 'approved' ? 80 : 40,
              safety: request.action === 'approved' ? 90 : 50,
              overall_rating: request.action === 'approved' ? 80 : 40
            },
            suggested_improvements: request.action === 'needs_revision' 
              ? ['Requires revision based on batch review criteria'] 
              : []
          });
          
          results.push(updatedReview);
        }
      } catch (error) {
        console.error(`Error in batch review for content ${contentId}:`, error);
      }
    }

    return results;
  }

  /**
   * Get review workflow state and metrics
   */
  async getWorkflowState(): Promise<ReviewWorkflowState> {
    try {
      const allReviews = this.getAllReviewItems();
      
      const pending = allReviews.filter(r => r.review_status === 'pending').length;
      const reviewed = allReviews.filter(r => r.review_status !== 'pending').length;
      const approved = allReviews.filter(r => r.review_status === 'approved').length;
      
      const approvalRate = reviewed > 0 ? (approved / reviewed) * 100 : 0;
      
      // Calculate average review time for completed reviews
      const completedReviews = allReviews.filter(r => r.review_status !== 'pending');
      const avgReviewTime = completedReviews.length > 0
        ? completedReviews.reduce((sum, r) => sum + r.estimated_review_time, 0) / completedReviews.length
        : 0;

      // Generate quality trends (last 7 days)
      const qualityTrends = this.generateQualityTrends(completedReviews);

      return {
        total_pending: pending,
        total_reviewed: reviewed,
        approval_rate: approvalRate,
        average_review_time: avgReviewTime,
        quality_trends: qualityTrends
      };
    } catch (error) {
      console.error('Error getting workflow state:', error);
      return {
        total_pending: 0,
        total_reviewed: 0,
        approval_rate: 0,
        average_review_time: 0,
        quality_trends: []
      };
    }
  }

  /**
   * Get content review history and analytics
   */
  async getReviewHistory(contentId?: string): Promise<ContentReviewItem[]> {
    try {
      const allReviews = this.getAllReviewItems();
      
      if (contentId) {
        return allReviews.filter(r => r.content_id === contentId);
      }
      
      return allReviews.sort((a, b) => 
        new Date(b.review_date).getTime() - new Date(a.review_date).getTime()
      );
    } catch (error) {
      console.error('Error fetching review history:', error);
      return [];
    }
  }

  /**
   * Auto-approve content based on quality thresholds
   */
  async autoApproveHighQuality(qualityThreshold: number = 90): Promise<string[]> {
    try {
      const pendingReviews = await this.getPendingReviews();
      const autoApprovedIds: string[] = [];
      
      for (const review of pendingReviews) {
        // Get content quality score (this would come from the original content)
        const contentQuality = await this.getContentQualityScore(review.content_id);
        
        if (contentQuality >= qualityThreshold) {
          await this.submitReview({
            review_id: review.id,
            reviewer_id: 'system',
            reviewer_name: 'Auto-Approval System',
            status: 'approved',
            notes: `Auto-approved based on high quality score (${contentQuality}%)`,
            quality_feedback: {
              coherence: contentQuality,
              accuracy: contentQuality,
              engagement: contentQuality,
              safety: contentQuality,
              overall_rating: contentQuality
            },
            suggested_improvements: []
          });
          
          autoApprovedIds.push(review.content_id);
        }
      }

      return autoApprovedIds;
    } catch (error) {
      console.error('Error in auto-approval process:', error);
      return [];
    }
  }

  // Private helper methods

  private estimateReviewTime(content: GeneratedContent): number {
    // Base time + complexity factors
    let estimatedMinutes = 3; // Base review time
    
    // Adjust based on challenge type complexity
    const complexityMultipliers = {
      'EthicsPing': 1.5,
      'SocialDecoder': 1.3,
      'PatternPlay': 1.2,
      'PerceptionFlip': 1.2,
      'MemeTimeWarp': 1.1,
      'SentimentSpectrum': 1.0
    };
    
    const multiplier = complexityMultipliers[content.type as keyof typeof complexityMultipliers] || 1.0;
    estimatedMinutes *= multiplier;
    
    // Adjust based on difficulty
    const difficultyMultipliers = {
      'easy': 0.8,
      'medium': 1.0,
      'hard': 1.3
    };
    
    estimatedMinutes *= difficultyMultipliers[content.difficulty as keyof typeof difficultyMultipliers];
    
    return Math.round(estimatedMinutes);
  }

  private storeReviewItem(review: ContentReviewItem): void {
    const existingReviews = this.getAllReviewItems();
    existingReviews.push(review);
    this.storeAllReviewItems(existingReviews);
  }

  private getAllReviewItems(): ContentReviewItem[] {
    try {
      const stored = localStorage.getItem('yuno_content_reviews');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private storeAllReviewItems(reviews: ContentReviewItem[]): void {
    try {
      localStorage.setItem('yuno_content_reviews', JSON.stringify(reviews));
    } catch (error) {
      console.error('Error storing review items:', error);
    }
  }

  private async activateApprovedContent(contentId: string): Promise<void> {
    try {
      // In a real implementation, this would update the challenge in the database
      // For now, we'll update it in our local storage or challenge list
      console.log(`Activating approved content: ${contentId}`);
      
      // This would be replaced with actual database update
      // await challengeApi.update(contentId, { is_active: true });
    } catch (error) {
      console.error('Error activating approved content:', error);
    }
  }

  private async getContentQualityScore(contentId: string): Promise<number> {
    // This would fetch the quality score from the original generated content
    // For now, return a mock score
    return Math.floor(Math.random() * 40) + 60; // 60-100 range
  }

  private generateQualityTrends(reviews: ContentReviewItem[]): ReviewWorkflowState['quality_trends'] {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayReviews = reviews.filter(r => r.review_date.startsWith(date));
      const avgQuality = dayReviews.length > 0
        ? dayReviews.reduce((sum, r) => sum + r.quality_feedback.overall_rating, 0) / dayReviews.length
        : 0;
      
      return {
        date,
        average_quality: Math.round(avgQuality),
        review_count: dayReviews.length
      };
    });
  }
}

// Export singleton instance
export const contentReviewSystem = new ContentReviewSystem();

// Utility functions for review management
export const getReviewStatusColor = (status: ContentReviewItem['review_status']): string => {
  switch (status) {
    case 'approved': return 'text-neon-green';
    case 'rejected': return 'text-neon-red';
    case 'needs_revision': return 'text-neon-orange';
    case 'pending': return 'text-neon-blue';
    default: return 'text-gray-400';
  }
};

export const getReviewStatusLabel = (status: ContentReviewItem['review_status']): string => {
  switch (status) {
    case 'approved': return 'Approved';
    case 'rejected': return 'Rejected';
    case 'needs_revision': return 'Needs Revision';
    case 'pending': return 'Pending Review';
    default: return 'Unknown';
  }
};

export const calculateReviewEfficiency = (reviews: ContentReviewItem[]): {
  averageReviewTime: number;
  approvalRate: number;
  revisionRate: number;
  qualityTrend: 'improving' | 'stable' | 'declining';
} => {
  const completedReviews = reviews.filter(r => r.review_status !== 'pending');
  
  if (completedReviews.length === 0) {
    return {
      averageReviewTime: 0,
      approvalRate: 0,
      revisionRate: 0,
      qualityTrend: 'stable'
    };
  }

  const approvedCount = completedReviews.filter(r => r.review_status === 'approved').length;
  const needsRevisionCount = completedReviews.filter(r => r.review_status === 'needs_revision').length;
  const avgReviewTime = completedReviews.reduce((sum, r) => sum + r.estimated_review_time, 0) / completedReviews.length;

  // Simple quality trend calculation
  const recentReviews = completedReviews.slice(-10);
  const olderReviews = completedReviews.slice(-20, -10);
  
  const recentQuality = recentReviews.reduce((sum, r) => sum + r.quality_feedback.overall_rating, 0) / recentReviews.length;
  const olderQuality = olderReviews.length > 0 
    ? olderReviews.reduce((sum, r) => sum + r.quality_feedback.overall_rating, 0) / olderReviews.length 
    : recentQuality;

  let qualityTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (recentQuality > olderQuality + 5) qualityTrend = 'improving';
  else if (recentQuality < olderQuality - 5) qualityTrend = 'declining';

  return {
    averageReviewTime: Math.round(avgReviewTime),
    approvalRate: Math.round((approvedCount / completedReviews.length) * 100),
    revisionRate: Math.round((needsRevisionCount / completedReviews.length) * 100),
    qualityTrend
  };
};