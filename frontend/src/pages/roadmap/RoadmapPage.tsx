import { useState, useEffect, useCallback } from 'react';
import { roadmapService, type UserRoadmap, type CareerPath } from '../../services/roadmap.service';
import RoadmapTimeline from '../../components/roadmap/RoadmapTimeline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Test knowledge levels
const KNOWLEDGE_LEVELS = {
  BEGINNER: 'Başlangıç', // 0-40 points
  INTERMEDIATE: 'Orta',  // 41-70 points
  ADVANCED: 'İleri'      // 71-100 points
};

const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedCareerPath, setSelectedCareerPath] = useState<string | null>(null);
  const [creatingRoadmap, setCreatingRoadmap] = useState(false);

  // For testing purposes
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [testKnowledgeLevel, setTestKnowledgeLevel] = useState<string>(KNOWLEDGE_LEVELS.INTERMEDIATE);

  // Ensure we have default career paths if needed
  const ensureCareerPaths = useCallback(() => {
    if (careerPaths.length === 0) {
      const defaultPaths: CareerPath[] = [
        {
          id: 'default-path-1',
          title: 'Backend Geliştirme',
          description: 'Backend geliştirme kariyeri için yol haritası',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'default-path-2',
          title: 'UX Tasarımı',
          description: 'UX tasarımı kariyeri için yol haritası',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'default-path-3',
          title: 'Veri Analizi',
          description: 'Veri analizi kariyeri için yol haritası',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'default-path-4',
          title: 'Proje Yönetimi',
          description: 'Proje yönetimi kariyeri için yol haritası',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setCareerPaths(defaultPaths);
      // Auto-select the first path
      setSelectedCareerPath(defaultPaths[0].id);
      console.log('Added default career paths and selected:', defaultPaths[0].id);
      return defaultPaths;
    }
    return careerPaths;
  }, [careerPaths]);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        console.log('Roadmap yükleniyor...');
        setLoading(true);
        const userRoadmap = await roadmapService.getPersonalRoadmap();
        console.log('Roadmap başarıyla yüklendi:', userRoadmap);
        setRoadmap(userRoadmap);
      } catch (error: any) {
        console.error('Roadmap yükleme hatası:', error);
        if (error.response?.status === 404) {
          // No roadmap exists yet
          console.log('Roadmap bulunamadı, kariyer alanları alınacak...');
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
  }, []);

  const fetchCareerPathsAndAutoSelect = useCallback(async () => {
    try {
      console.log('Kariyer alanları ve önerilen yol haritası alınıyor...');
      setLoading(true);
      
      // Try to get recommended career path based on user's tests
      const { careerPath, knowledgeLevel } = await roadmapService.getUserRecommendedCareerPath();
      console.log('Önerilen kariyer yolu ve seviye:', { careerPath, knowledgeLevel });
      
      // Fetch available career paths
      const availablePaths = await roadmapService.getCareerPaths();
      console.log('Mevcut kariyer alanları:', availablePaths);
      setCareerPaths(availablePaths);
      
      if (careerPath) {
        console.log('Otomatik seçilen kariyer yolu:', careerPath.title);
        setSelectedCareerPath(careerPath.id);
        setTestKnowledgeLevel(knowledgeLevel);
      } else if (availablePaths && availablePaths.length > 0) {
        // Kariyer yolu önerisi yoksa ilk yolu seç
        console.log('Kariyer yolu önerisi bulunamadı, ilk yol seçiliyor:', availablePaths[0].title);
        setSelectedCareerPath(availablePaths[0].id);
        setTestKnowledgeLevel('başlangıç'); // Varsayılan seviye
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
  }, [ensureCareerPaths]);

  const handleCreateRoadmap = useCallback(async (careerPathId: string, knowledgeLevel?: string) => {
    try {
      setCreatingRoadmap(true);
      
      // Kullanıcının bilgi seviyesini al - parametre olarak geldiyse onu kullan
      const userKnowledgeLevel = knowledgeLevel || testKnowledgeLevel || 'başlangıç'; // Varsayılan olarak başlangıç seviyesi
      
      console.log(`Roadmap oluşturuluyor: Kariyer Alanı ID=${careerPathId}, Bilgi Seviyesi=${userKnowledgeLevel}`);
      
      // Roadmap oluştur - createRoadmapWithKnowledge kullanıyoruz (2 parametre alan)
      const newRoadmap = await roadmapService.createRoadmapWithKnowledge(careerPathId, userKnowledgeLevel);
      
      console.log('Oluşturulan roadmap:', newRoadmap);
      
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
  }, [testKnowledgeLevel]);
  
  const handleCreateRoadmapClick = useCallback(async () => {
    try {
      setCreatingRoadmap(true);
      
      // Eğer seçili bir kariyer alanı yoksa, kullanıcının test sonuçlarına göre önerilen kariyer alanını al
      if (!selectedCareerPath) {
        const { careerPath, knowledgeLevel } = await roadmapService.getUserRecommendedCareerPath();
        
        if (careerPath) {
          setSelectedCareerPath(careerPath.id);
          setTestKnowledgeLevel(knowledgeLevel);
          await handleCreateRoadmap(careerPath.id, knowledgeLevel);
        } else {
          // Önerilen kariyer alanı yoksa varsayılan alanları kullan
          const paths = await roadmapService.getCareerPaths();
          
          if (paths.length > 0) {
            setCareerPaths(paths);
            setSelectedCareerPath(paths[0].id);
            await handleCreateRoadmap(paths[0].id);
          } else {
            // API'den kariyer alanı gelmezse varsayılan alanları kullan
            const defaultPaths = ensureCareerPaths();
            await handleCreateRoadmap(defaultPaths[0].id);
          }
        }
      } else {
        // Zaten seçili bir kariyer alanı varsa, direkt olarak yol haritası oluştur
        await handleCreateRoadmap(selectedCareerPath);
      }
    } catch (error) {
      console.error('Yol haritası oluşturulurken hata:', error);
      toast.error('Yol haritası oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setCreatingRoadmap(false);
    }
  }, [selectedCareerPath, ensureCareerPaths, handleCreateRoadmap]);

  // Kullanılmayan fonksiyonu kaldırdık

  // Kullanılmayan fonksiyonu kaldırdık

  const handleStepStatusUpdate = async (stepId: string, newStatus: 'not_started' | 'in_progress' | 'completed') => {
    const success = await roadmapService.updateStepStatus(stepId, newStatus);
    if (success && roadmap) {
      const updatedSteps = roadmap.steps.map(step => 
        step.id === stepId ? { ...step, status: newStatus } : step
      );
      setRoadmap({ ...roadmap, steps: updatedSteps });
    }
  };

  const handleTestKnowledgeLevelChange = (level: string) => {
    setTestKnowledgeLevel(level);
    if (roadmap) {
      // Simulate different recommended starting points based on knowledge level
      let recommendedIndex = 0;
      
      switch (level) {
        case KNOWLEDGE_LEVELS.BEGINNER:
          recommendedIndex = 0; // Start from the beginning
          break;
        case KNOWLEDGE_LEVELS.INTERMEDIATE:
          recommendedIndex = Math.floor(roadmap.steps.length / 3); // Start from about 1/3 of the way
          break;
        case KNOWLEDGE_LEVELS.ADVANCED:
          recommendedIndex = Math.floor(roadmap.steps.length * 2 / 3); // Start from about 2/3 of the way
          break;
      }
      
      setRoadmap({
        ...roadmap,
        recommended_start_index: recommendedIndex
      });
    }
  };

  const toggleTestPanel = () => {
    setShowTestPanel(!showTestPanel);
  };

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

  // Debug bilgileri
  console.log('Render durumu:', { 
    roadmap, 
    loading, 
    error, 
    careerPaths, 
    selectedCareerPath,
    creatingRoadmap 
  });

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
          
          {/* Test Panel Toggle Button */}
          <button
            onClick={toggleTestPanel}
            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {showTestPanel ? 'Test Panelini Gizle' : 'Test Panelini Göster'}
          </button>
        </div>
        
        {/* Test Panel */}
        {showTestPanel && (
          <div className="card p-4 mb-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Test Paneli</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Bilgi Seviyesi:</label>
                <select
                  value={testKnowledgeLevel}
                  onChange={(e) => handleTestKnowledgeLevelChange(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {Object.values(KNOWLEDGE_LEVELS).map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="card p-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Roadmap yükleniyor...</p>
            </div>
          </div>
        ) : error ? (
          <div className="card p-6">
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Hata Oluştu</h3>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          </div>
        ) : roadmap ? (
          <>
            {/* Roadmap render ediliyor */}
            {(() => { console.log('Roadmap render ediliyor:', roadmap); return null; })()} 
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
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
                onStepStatusUpdate={handleStepStatusUpdate} 
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
            {(() => { console.log('Boş durum render ediliyor - roadmap yok'); return null; })()}
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

        {/* Modal kaldırıldı - artık otomatik seçim yapılıyor */}
      </div>
    </div>
  );
};

export default RoadmapPage;
