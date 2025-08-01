import { useState, useEffect } from 'react';
import { roadmapService, type UserRoadmap } from '../../services/roadmap.service';

const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const userRoadmap = await roadmapService.getPersonalRoadmap();
        setRoadmap(userRoadmap);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // No roadmap exists yet
          setError(null);
        } else {
          setError('Roadmap yüklenirken bir hata oluştu');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const handleStepStatusUpdate = async (stepId: string, newStatus: 'not_started' | 'in_progress' | 'completed') => {
    const success = await roadmapService.updateStepStatus(stepId, newStatus);
    if (success && roadmap) {
      const updatedSteps = roadmap.steps.map(step => 
        step.id === stepId ? { ...step, status: newStatus } : step
      );
      setRoadmap({ ...roadmap, steps: updatedSteps });
    }
  };

  const handleCreateRoadmap = async () => {
    try {
      setLoading(true);
      const userRoadmap = await roadmapService.getPersonalRoadmap();
      setRoadmap(userRoadmap);
    } catch (error) {
      console.error('Error creating roadmap:', error);
      setError('Roadmap oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kariyer Yolculuğum</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Kariyer hedeflerinizi görüntüleyin ve yönetin
        </p>
      </div>
      
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

          {/* Roadmap Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Yol Haritası Adımları</h3>
            {roadmap.steps
              .sort((a, b) => a.order - b.order)
              .map((step, index) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'completed': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
                    case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
                    case 'not_started': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700';
                    default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700';
                  }
                };

                const getStatusText = (status: string) => {
                  switch (status) {
                    case 'completed': return 'Tamamlandı';
                    case 'in_progress': return 'Devam Ediyor';
                    case 'not_started': return 'Başlanmadı';
                    default: return 'Bilinmiyor';
                  }
                };

                const getStatusIcon = (status: string) => {
                  switch (status) {
                    case 'completed': 
                      return (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      );
                    case 'in_progress':
                      return (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      );
                    default:
                      return (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                      );
                  }
                };

                return (
                  <div key={step.id} className={`card p-6 border-l-4 ${getStatusColor(step.status)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              {index + 1}. {step.title}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                              {getStatusText(step.status)}
                            </span>
                          </div>
                          {step.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {step.description}
                            </p>
                          )}
                          {step.completion_date && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                              Tamamlanma Tarihi: {new Date(step.completion_date).toLocaleDateString('tr-TR')}
                            </p>
                          )}
                          <div className="flex space-x-2">
                            {step.status === 'not_started' && (
                              <button 
                                onClick={() => handleStepStatusUpdate(step.id, 'in_progress')}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                              >
                                Başla
                              </button>
                            )}
                            {step.status === 'in_progress' && (
                              <button 
                                onClick={() => handleStepStatusUpdate(step.id, 'completed')}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                              >
                                Tamamla
                              </button>
                            )}
                            {step.status === 'completed' && (
                              <button 
                                onClick={() => handleStepStatusUpdate(step.id, 'in_progress')}
                                className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-md hover:bg-yellow-700 transition-colors"
                              >
                                Yeniden Aç
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Skills Required */}
          {roadmap.career_path.skills_required && (
            <div className="card p-6 mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Gerekli Beceriler</h3>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(roadmap.career_path.skills_required).map((skill: string, index: number) => (
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
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Henüz bir kariyer yolu oluşturmadınız</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Kariyer hedeflerinize ulaşmak için kişiselleştirilmiş bir yol haritası oluşturun.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateRoadmap}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
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
              </button>
            </div>
          
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
