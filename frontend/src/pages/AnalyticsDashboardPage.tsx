import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/reduxHooks';
import { analyticsService, UserAnalytics } from '../services/analyticsService';
import PlotlyChart from '../components/analytics/PlotlyChart';

const AnalyticsDashboardPage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await analyticsService.getUserAnalyticsDashboard(user.id);
        setAnalytics(data);
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.response?.data?.detail || 'Analitik veriler yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Analitik verileriniz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Veri bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Analitik Panelim
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            NeetUp Spark ile olan sohbetlerinizin detaylı analizi
          </p>
        </div>

        {/* No Data Message */}
        {analytics.total_messages === 0 && analytics.message && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center mb-8">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Henüz Analiz Edilecek Veri Yok
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{analytics.message}</p>
            <a
              href="/chat"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                       text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600
                       transition-all duration-200 transform hover:scale-105"
            >
              <span className="mr-2">✨</span>
              NeetUp Spark ile Sohbet Et
            </a>
          </div>
        )}

        {/* Analytics Content */}
        {analytics.total_messages > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Mesaj</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics.total_messages}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                    <span className="text-2xl">😊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ortalama Duygu</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics.average_sentiment > 0 ? '+' : ''}{analytics.average_sentiment.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {analytics.insights && (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                        <span className="text-2xl">📅</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Gün</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analytics.insights.days_active}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                        <span className="text-2xl">⏰</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Aktif Saat</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {analytics.insights.most_active_hour}:00
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Analytics Charts and Insights */}
            {analytics.insights && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Sentiment Trend Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📈 Duygu Durumu Trendi
                  </h3>
                  <div className="h-80">
                    {analytics.sentiment_trend_chart_json ? (
                      <PlotlyChart 
                        data={analytics.sentiment_trend_chart_json.data}
                        layout={{
                          ...analytics.sentiment_trend_chart_json.layout,
                          font: { color: '#374151' },
                          paper_bgcolor: 'transparent',
                          plot_bgcolor: 'transparent',
                          height: 320
                        }}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📊</div>
                          <p className="text-gray-600 dark:text-gray-400">Duygu durumu verisi yükleniyor...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Heatmap */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🔥 Aktivite Haritası
                  </h3>
                  <div className="h-80">
                    {analytics.activity_heatmap_chart_json ? (
                      <PlotlyChart 
                        data={analytics.activity_heatmap_chart_json.data}
                        layout={{
                          ...analytics.activity_heatmap_chart_json.layout,
                          font: { color: '#374151' },
                          paper_bgcolor: 'transparent',
                          plot_bgcolor: 'transparent',
                          height: 320
                        }}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📅</div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">Aktivite verisi yükleniyor...</p>
                          <div className="grid grid-cols-7 gap-1 max-w-xs mx-auto">
                            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => (
                              <div key={i} className="text-xs text-center text-gray-500 dark:text-gray-400 mb-1">
                                {day}
                              </div>
                            ))}
                            {Array.from({ length: 7 }, (_, i) => (
                              <div
                                key={i}
                                className={`h-6 rounded ${
                                  i < 2 ? 'bg-green-200 dark:bg-green-700' :
                                  i < 4 ? 'bg-yellow-200 dark:bg-yellow-700' :
                                  i < 6 ? 'bg-orange-200 dark:bg-orange-700' :
                                  'bg-red-200 dark:bg-red-700'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mood Distribution Chart */}
            {analytics.insights && analytics.mood_distribution_chart_json && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🎭 Duygu Dağılımı
                </h3>
                <div className="h-80">
                  <PlotlyChart 
                    data={analytics.mood_distribution_chart_json.data}
                    layout={{
                      ...analytics.mood_distribution_chart_json.layout,
                      font: { color: '#374151' },
                      paper_bgcolor: 'transparent',
                      plot_bgcolor: 'transparent',
                      height: 320
                    }}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Insights and Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💡 Kişisel İçgörüler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🎯</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Hedef Odaklılık</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sohbetlerinizde kariyer hedefleriniz net bir şekilde görülüyor. Bu motivasyonunuzu koruyun!
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">📚</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Öğrenme İsteği</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sürekli yeni şeyler öğrenme isteğiniz dikkat çekiyor. Bu tutumunuz sizi başarıya götürecek!
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🚀</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">İlerleme Hızı</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Platformdaki aktiviteniz istikrarlı bir gelişim gösteriyor. Bu tempoda devam edin!
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">💪</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Motivasyon Seviyesi</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Yüksek motivasyonunuz tüm sohbetlerinizde hissediliyor. Bu enerjiyi korumaya devam edin!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
