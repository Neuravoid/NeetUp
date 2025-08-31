import { useState, useEffect, useCallback } from 'react';
import { roadmapService, type UserRoadmap, type CareerPath } from '../../services/roadmap.service';
import RoadmapTimeline from '../../components/roadmap/RoadmapTimeline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

// Yeni iskelet yükleyici bileşeni
const RoadmapSkeleton = () => (
  <div className="roadmap-skeleton" style={{ minHeight: '500px' }}>
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-10"></div>
      <div className="flex flex-col space-y-12 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedCareerPath, setSelectedCareerPath] = useState<string | null>(null);
  const [creatingRoadmap, setCreatingRoadmap] = useState(false);
  const [aiAnimation, setAiAnimation] = useState(false);

  // Map knowledge test categories to career path titles
  const mapCategoryToCareerPath = useCallback((category: string): string => {
    switch (category) {
      case 'UI/UX':
        return 'UX Tasarımı';
      case 'Backend':
        return 'Backend Geliştirme';
      case 'Data Science':
        return 'Veri Analizi';
      case 'Project Management':
        return 'Proje Yönetimi';
      default:
        return category;
    }
  }, []);

  // Ensure we have default career paths if needed
  const ensureCareerPaths = useCallback(() => {
    if (careerPaths.length === 0) {
      const defaultPaths: CareerPath[] = [
        {
          id: 'backend-gelistirme',
          title: 'Backend Geliştirme',
          description: 'Backend geliştirme kariyeri için yol haritası',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'ux-tasarimi',
          title: 'UX Tasarımı',
          description: 'UX tasarımı kariyeri için yol haritası',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'veri-analizi',
          title: 'Veri Analizi',
          description: 'Veri analizi kariyeri için yol haritası',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'proje-yonetimi',
          title: 'Proje Yönetimi',
          description: 'Proje yönetimi kariyeri için yol haritası',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setCareerPaths(defaultPaths);
      return defaultPaths;
    }
    return careerPaths;
  }, [careerPaths]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const careerParam = queryParams.get('career');

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {

        setLoading(true);
        
        // If career parameter is provided from skills page, create roadmap for that career
        if (careerParam) {

          
          // Map the category to the correct career path title
          const mappedCareerPath = mapCategoryToCareerPath(careerParam);

          
          // Get career paths from backend (not local defaults)
          try {
            const backendCareerPaths = await roadmapService.getCareerPaths();

            
            // Find the matching career path by title
            const matchingPath = backendCareerPaths.find(path => path.title === mappedCareerPath);
            
            if (matchingPath) {

              setSelectedCareerPath(matchingPath.id);
              
              // Create roadmap for this career path using the backend ID
              const newRoadmap = await roadmapService.createRoadmapWithKnowledge(matchingPath.id, 'Orta');

              setRoadmap(newRoadmap);
            } else {
              console.warn('No matching career path found for:', mappedCareerPath);
              console.warn('Available career paths:', backendCareerPaths.map(p => p.title));
              // Fallback to default behavior
              const userRoadmap = await roadmapService.getPersonalRoadmap();
              setRoadmap(userRoadmap);
            }
          } catch (error) {
            console.error('Error fetching career paths:', error);
            // Fallback to default behavior
            const userRoadmap = await roadmapService.getPersonalRoadmap();
            setRoadmap(userRoadmap);
          }
        } else {
          // No career parameter, load user's existing roadmap
          const userRoadmap = await roadmapService.getPersonalRoadmap();

          setRoadmap(userRoadmap);
        }
      } catch (error: any) {
        console.error('Roadmap yükleme hatası:', error);
        if (error.response?.status === 404) {
          // No roadmap exists yet

          setError(null);
          // Fetch available career paths and try to auto-select based on user's tests
          fetchCareerPathsAndAutoSelect();
        } else {
          console.error('Başka bir hata oluştu:', error.message || error);
          setError('Roadmap yüklenirken bir hata oluştu');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [careerParam]); // Only depend on careerParam to prevent infinite loop

  // Önce handleCreateRoadmap fonksiyonunu tanımla
  const handleCreateRoadmap = useCallback(async (careerPathId: string) => {
    try {
      setCreatingRoadmap(true);
      

      
      // Roadmap oluştur - createRoadmapWithKnowledge kullanıyoruz (2 parametre alan)
      const newRoadmap = await roadmapService.createRoadmapWithKnowledge(careerPathId);
      

      
      // Roadmap'i state'e kaydet
      setRoadmap(newRoadmap);
      
      // Başarı mesajı göster - react-toastify formatında
      toast.success('Kişiselleştirilmiş kariyer yol haritanız başarıyla oluşturuldu.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (error) {
      console.error('Roadmap oluşturma hatası:', error);
      
      // Hata mesajı göster - react-toastify formatında
      toast.error('Yol haritası oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setCreatingRoadmap(false);
    }
  }, []);

  // Sonra fetchCareerPathsAndAutoSelect fonksiyonunu tanımla
  const fetchCareerPathsAndAutoSelect = useCallback(async () => {
    try {

      setLoading(true);
      
      // Try to get recommended career path based on user's tests
      const { careerPath } = await roadmapService.getUserRecommendedCareerPath();

      
      // Fetch available career paths
      const availablePaths = await roadmapService.getCareerPaths();

      setCareerPaths(availablePaths);
      
      if (careerPath) {

        setSelectedCareerPath(careerPath.id);
        
        // Kullanıcının kişilik testi sonucuna göre otomatik olarak roadmap oluştur
        if (careerPath.id) {

          await handleCreateRoadmap(careerPath.id);
        }
      } else if (availablePaths && availablePaths.length > 0) {
        // Kariyer yolu önerisi yoksa ilk yolu seç

        setSelectedCareerPath(availablePaths[0].id);
      } else {
        console.warn('Hiçbir kariyer yolu bulunamadı!');
        setError('Kariyer alanları bulunamadı. Lütfen daha sonra tekrar deneyin.');
        // Varsayılan kariyer alanlarını ekle
        const defaultPaths = ensureCareerPaths();
        setSelectedCareerPath(defaultPaths[0].id);
      }
    } catch (error) {
      console.error('Kariyer alanı ve öneriler alınırken hata:', error);
      // Hata durumunda varsayılan kariyer alanlarını ekle
      const defaultPaths = ensureCareerPaths();
      setSelectedCareerPath(defaultPaths[0].id);
    } finally {
      setLoading(false);
    }
  }, [ensureCareerPaths, handleCreateRoadmap]);

  // Yol haritası oluşturma butonuna tıklandığında
  const handleCreateRoadmapClick = useCallback(async () => {
    try {
      setCreatingRoadmap(true);
      setError(null);
      
      // Yapay zeka animasyonu için 1.5 saniye bekle
      setAiAnimation(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAiAnimation(false);
      

      
      // Önce kullanıcının önerilen kariyer yolunu al
      const { careerPath, knowledgeLevel } = await roadmapService.getUserRecommendedCareerPath();


      
      if (careerPath) {

        
        // Kariyer yolunu state'e kaydet
        setSelectedCareerPath(careerPath.id);
        
        // Veritabanından roadmap oluştur

        const newRoadmap = await roadmapService.createRoadmap(careerPath.id);
        
        if (newRoadmap) {

          setRoadmap(newRoadmap);
          toast.success('Kariyer yol haritanız başarıyla yüklendi.');
        } else {

          // Veritabanında roadmap yoksa yeni oluştur
          const createdRoadmap = await roadmapService.createRoadmapWithKnowledge(careerPath.id, knowledgeLevel || 'orta');

          setRoadmap(createdRoadmap);
          toast.success('Kişiselleştirilmiş kariyer yol haritanız başarıyla oluşturuldu.');
        }
      } else {
        console.error('Önerilen kariyer yolu bulunamadı');
        toast.error('Önerilen kariyer yolu bulunamadı. Lütfen kişilik ve bilgi testlerini tamamlayın.');
        setError('Önerilen kariyer yolu bulunamadı. Lütfen kişilik ve bilgi testlerini tamamlayın.');
      }
    } catch (error) {
      console.error('Yol haritası oluşturulurken hata:', error);
      toast.error('Yol haritası oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setError('Roadmap yüklenirken bir hata oluştu');
    } finally {
      setCreatingRoadmap(false);
    }
  }, []);

  const handleUpdateStepStatus = useCallback(async (stepId: string, newStatus: 'not_started' | 'in_progress' | 'completed') => {
    const success = await roadmapService.updateStepStatus(stepId, newStatus);
    if (success && roadmap) {
      const updatedSteps = roadmap.steps.map(step => 
        step.id === stepId ? { ...step, status: newStatus } : step
      );
      setRoadmap({ ...roadmap, steps: updatedSteps });
    }
  }, [roadmap]);

  // Ensure we have career paths when modal is shown
  // Kariyer yolu seçimi için varsayılan değerleri ayarla
  useEffect(() => {
    if (!selectedCareerPath) {
      const paths = ensureCareerPaths();
      if (paths.length > 0) {
        setSelectedCareerPath(paths[0].id);
      }
    }
  }, [selectedCareerPath]);

  // Debug bilgileri removed for cleanup

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kariyer Yolculuğum</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Kariyer hedeflerinizi görüntüleyin ve yönetin
            </p>
          </div>
        </div>
        
        {loading ? (
          <RoadmapSkeleton />
        ) : error ? (
          <div className="card p-8 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-100 dark:border-blue-800/30 shadow-lg">
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-primary-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Kariyer Yolunuzu Keşfedin</h3>
              <p className="text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
                Yapay zeka destekli kariyer yol haritanızı oluşturarak profesyonel gelişiminizi hızlandırın.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreateRoadmapClick}
                  disabled={creatingRoadmap || aiAnimation}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105"
                >
                  {aiAnimation ? (
                    <>
                      <div className="animate-pulse mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span>Yapay Zeka Kariyer Yolunuzu Oluşturuyor...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Yapay Zeka Destekli Kariyer Yolu Oluştur
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : roadmap ? (
          <>
            {/* Roadmap render ediliyor */}

            {/* Career Path Overview */}
            <div className="card p-6 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {roadmap.career_path.title}
                  </h2>
                  {roadmap.career_path.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {roadmap.career_path.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">İlerleme</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">%{roadmap.completion_percentage} Tamamlandı</p>
                      </div>
                    </div>
                    {roadmap.career_path.avg_salary && (
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Ortalama Maaş</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">${roadmap.career_path.avg_salary.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Toplam Adım</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{roadmap.steps.length} adım</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${roadmap.completion_percentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Roadmap Timeline Visualization */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Yol Haritası</h3>
              <RoadmapTimeline 
                roadmap={roadmap}
                onStepStatusUpdate={handleUpdateStepStatus} 
              />
            </div>
            
            {/* Skills Required */}
            {roadmap.career_path.skills_required && (
              <div className="card p-6 mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Gerekli Beceriler</h3>
                <div className="flex flex-wrap gap-2">
                  {(typeof roadmap.career_path.skills_required === 'string' ? JSON.parse(roadmap.career_path.skills_required) : roadmap.career_path.skills_required || []).map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card p-6">
            {/* Boş durum render ediliyor */}

            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Henüz bir kariyer yolu oluşturmadınız</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kariyer hedeflerinize ulaşmak için kişiselleştirilmiş bir yol haritası oluşturun.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreateRoadmapClick}
                  disabled={creatingRoadmap}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {creatingRoadmap ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-5 w-5 border-t-2 border-white rounded-full"></div>
                      Yol Haritası Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Yol Haritası Oluştur
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RoadmapPage;
