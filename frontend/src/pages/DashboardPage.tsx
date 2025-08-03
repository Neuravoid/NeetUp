
import { BookOpen, Target, Calendar, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz!</h1>
          <p className="text-gray-600">Kariyer gelişim yolculuğunuza devam edin</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-800">Çalışma Planım</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">AI destekli kişisel çalışma planınızı oluşturun ve hedeflerinize ulaşın</p>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium">
              Planı Görüntüle
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-green-600 mr-3 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-800">Kariyer Yol Haritası</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">Hedeflediğiniz kariyere giden yolu keşfedin ve adım adım ilerleyin</p>
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium">
              Yol Haritası
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-purple-600 mr-3 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-800">Haftalık Plan</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">Haftalık görevlerinizi organize edin ve verimli çalışın</p>
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium">
              Planı Yönet
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600 mr-3 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-800">İlerleme</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">Gelişiminizi takip edin ve başarılarınızı analiz edin</p>
            <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-all duration-200 font-medium">
              İstatistikler
            </button>
          </div>
        </div>

        {/* Recent Activity & Progress Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Son Aktiviteler</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Bu hafta</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-800 font-semibold">Backend Geliştirme planı güncellendi</p>
                    <span className="text-xs text-green-600 font-medium">Tamamlandı</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Python ve API geliştirme modülleri eklendi • 2 saat önce</p>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-green-200 rounded-full h-2 mr-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">%75</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-800 font-semibold">UX Tasarımı bilgi testi tamamlandı</p>
                    <span className="text-xs text-blue-600 font-medium">Başarılı</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Kullanıcı araştırması ve prototipleme konularında %85 başarı • 1 gün önce</p>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-blue-200 rounded-full h-2 mr-3">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">%85</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-4 mt-1 flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-800 font-semibold">Kariyer yol haritası oluşturuldu</p>
                    <span className="text-xs text-purple-600 font-medium">Aktif</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">12 haftalık kişiselleştirilmiş öğrenme planı hazır • 3 gün önce</p>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-purple-200 rounded-full h-2 mr-3">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">%20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bu Hafta Özet</h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Tamamlanan Görevler</span>
                  <span className="text-lg font-bold text-blue-600">8</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Çalışma Saati</span>
                  <span className="text-lg font-bold text-green-600">24h</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-800">Beceri Puanı</span>
                  <span className="text-lg font-bold text-purple-600">+15</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  <span className="font-semibold text-gray-800">Sonraki hedef:</span><br/>
                  Python API geliştirme modülünü tamamla
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
