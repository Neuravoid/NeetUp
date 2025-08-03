import api from './api';

export interface UserAnalytics {
  username: string;
  total_messages: number;
  average_sentiment: number;
  sentiment_trend_chart_json: any;
  mood_distribution_chart_json: any;
  activity_heatmap_chart_json?: any;
  insights?: {
    most_positive_day?: string;
    most_active_hour: number;
    recent_trend: string;
    days_active: number;
    average_daily_messages: number;
  };
  message?: string;
}

export interface SentimentHistoryItem {
  id: string;
  content: string;
  timestamp: string;
  sentiment_label: string;
  sentiment_score: number;
  date: string;
}

class AnalyticsService {
  // Get comprehensive analytics dashboard data for the current user
  async getUserAnalyticsDashboard(userId: string): Promise<UserAnalytics> {
    try {
      const response = await api.get(`/analytics/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics dashboard:', error);
      throw error;
    }
  }

  // Get detailed sentiment history for the current user
  async getUserSentimentHistory(userId: string, limit: number = 50): Promise<SentimentHistoryItem[]> {
    try {
      const response = await api.get(`/analytics/sentiment-history/${userId}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sentiment history:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
