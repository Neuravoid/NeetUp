import React from 'react';

interface AnalyticsInsightsProps {
  insights: {
    most_positive_day?: string;
    most_active_hour: number;
    recent_trend: string;
    days_active: number;
    average_daily_messages: number;
  };
}

const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ insights }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Gelişiyor';
      case 'declining':
        return 'Azalıyor';
      default:
        return 'Stabil';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'declining':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <span className="mr-2">🔍</span>
        Kişisel İçgörüler
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Trend */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">{getTrendIcon(insights.recent_trend)}</span>
            <h4 className="font-medium text-gray-900 dark:text-white">Son Hafta Trendi</h4>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(insights.recent_trend)}`}>
            {getTrendText(insights.recent_trend)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Son 7 gündeki duygu durumu değişimi
          </p>
        </div>

        {/* Most Positive Day */}
        {insights.most_positive_day && (
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🌟</span>
              <h4 className="font-medium text-gray-900 dark:text-white">En Pozitif Gün</h4>
            </div>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {new Date(insights.most_positive_day).toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Bu gün en yüksek pozitif duygu skoruna sahipsiniz
            </p>
          </div>
        )}

        {/* Activity Pattern */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">⏰</span>
            <h4 className="font-medium text-gray-900 dark:text-white">Aktivite Deseni</h4>
          </div>
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            Saat {insights.most_active_hour}:00
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            En aktif olduğunuz saat dilimi
          </p>
        </div>

        {/* Daily Average */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">📊</span>
            <h4 className="font-medium text-gray-900 dark:text-white">Günlük Ortalama</h4>
          </div>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {insights.average_daily_messages} mesaj/gün
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Günde ortalama mesaj sayınız
          </p>
        </div>

        {/* Engagement Level */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🎯</span>
            <h4 className="font-medium text-gray-900 dark:text-white">Katılım Seviyesi</h4>
          </div>
          <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
            {insights.days_active} gün aktif
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            NeetUp Spark ile etkileşimde bulunduğunuz gün sayısı
          </p>
        </div>

        {/* Motivation Tip */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">💡</span>
            <h4 className="font-medium text-gray-900 dark:text-white">Motivasyon İpucu</h4>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {insights.recent_trend === 'improving' 
              ? "Harika! Duygu durumunuz gelişiyor. Bu pozitif trendi sürdürmeye devam edin!" 
              : insights.recent_trend === 'declining'
              ? "Endişelenmeyin, her zaman dalgalanmalar olabilir. NeetUp Spark size destek olmaya devam edecek."
              : "Duygu durumunuz stabil görünüyor. Yeni hedefler belirleyerek motivasyonunuzu artırabilirsiniz."
            }
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Gelişiminizi sürdürün! 🚀
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              NeetUp Spark ile daha fazla sohbet ederek kişisel gelişiminizi takip edin.
            </p>
          </div>
          <a
            href="/chat"
            className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600
                     transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
          >
            Sohbete Devam Et
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsInsights;
