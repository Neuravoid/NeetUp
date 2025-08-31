import React, { useState, useEffect, useCallback, useRef } from 'react';
import { myWorkService, Track, UserTask, SubTask } from '../../services/myWorkService';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './task-animations.css';

const MyWorkPage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0); // Force re-render key
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedStage, setSelectedStage] = useState<any | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [aiQuestions] = useState([
    { id: 'goal', question: 'Bu aşamada ne amaçlıyorsun?', type: 'text' },
    { id: 'style', question: 'Nasıl bir öğrenme stili tercih edersin?', type: 'buttons', options: ['Teori Ağırlıklı 🧠', 'Pratik Ağırlıklı ✍️'] }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Refs to track state changes
  const tasksRef = useRef<UserTask[]>([]);
  
  // Keep ref updated with current tasks
  useEffect(() => {
    tasksRef.current = userTasks;
  }, [userTasks]);

  // Fetch data function as a callback to allow calling it when needed
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tracksResponse, tasksResponse] = await Promise.all([
        myWorkService.getTracks(),
        myWorkService.getUserTasks()
      ]);
      
      if (tracksResponse.data) {
        setTracks(tracksResponse.data);
      }
      if (tasksResponse.data) {
        setUserTasks(tasksResponse.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Veri yükleme hatası:', err);
      setError('Veriler yüklenirken bir hata oluştu');
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentStep(1);
    setSelectedTrack(null);
    setSelectedStage(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectTrack = (track: Track) => {
    setSelectedTrack(track);
    setCurrentStep(2);
  };

  const selectStage = (stage: any) => {
    setSelectedStage(stage);
    setCurrentStep(3);
    setAnswers(new Array(aiQuestions.length).fill(''));
    setCurrentQuestionIndex(0);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < aiQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generatePlan();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePlan = async () => {
    if (!selectedTrack || !selectedStage) return;
    
    // Form değerlerini kaydet ve form öğelerini temizle
    const taskData = {
      track_name: selectedTrack.name,
      stage_name: selectedStage.name,
      answers: [...answers] // Kopyasını al
    };
    
    // Form durumunu hemen sıfırla ve modal'ı kapat
    setSelectedTrack(null);
    setSelectedStage(null);
    setAnswers([]);
    setCurrentStep(1);
    setCurrentQuestionIndex(0);
    setIsModalOpen(false);
    setIsGenerating(true);
    setError(null);
    
    try {
      // API çağrısını yap

      const response = await myWorkService.createUserTask(taskData);
      
      if (response.data) {
        const newTask = response.data as UserTask;

        
        // İki yöntem kullanarak state güncellemesini garanti edelim:
        // 1. Doğrudan yeni bir dizi oluştur ve state'i güncelle
        const updatedTasks = [...tasksRef.current, newTask];
        setUserTasks(updatedTasks);
        
        // 2. Başarı durumunu ayarla - bu, bir efekt tetikleyecek
        // setCreationSuccess call removed as the state variable was deleted
        
        // 3. Force re-render için refresh key'i güncelle
        setRefreshKey(prevKey => prevKey + 1);
        
        // 4. Yeni görevi ekledikten sonra bütün listeyi yenile
        setTimeout(() => {
          fetchData();

        }, 100);
        

      }
    } catch (err) {
      console.error("Plan oluşturma hatası:", err);
      setError('Plan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const toggleSubTask = async (taskId: number, subTaskIndex: number, completed: boolean) => {
    try {
      // Optimistic update - Anında UI güncelleme
      setUserTasks(userTasks.map(task => {
        if (task.id === taskId) {
          // Alt görevi güncelle
          const updatedSubTasks = [...task.sub_tasks];
          updatedSubTasks[subTaskIndex] = {
            ...updatedSubTasks[subTaskIndex],
            completed: !completed
          };
          
          // İlerleme durumunu güncelle
          const completedCount = updatedSubTasks.filter(st => st.completed).length;
          const progress = (completedCount / updatedSubTasks.length) * 100;
          
          return {
            ...task,
            sub_tasks: updatedSubTasks,
            progress: progress
          };
        }
        return task;
      }));
      
      // Ardından API çağrısı yap
      const response = await myWorkService.updateUserTaskProgress(taskId, {
        sub_task_index: subTaskIndex,
        completed: !completed
      });
      
      // Serverdan gelen yanıtla state'i güncelle
      if (response.data) {
        setUserTasks(userTasks.map(task => 
          task.id === taskId ? response.data! : task
        ));
      }
    } catch (err) {
      console.error('Görev durumu güncellenirken hata oluştu:', err);
      // Hata durumunda eski haline geri döndür
      setUserTasks([...userTasks]); 
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Çalışmalarım</h1>
        <button
          onClick={openModal}
          className="bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Yeni Plan Oluştur
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {userTasks.length === 0 || userTasks.every(task => task.progress === 100) ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Henüz bir çalışma planın yok</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Yapay zeka destekli kişisel çalışma planı oluşturmak için "Yeni Plan Oluştur" butonuna tıkla.
          </p>
          <button
            onClick={openModal}
            className="mt-4 bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Yeni Plan Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TransitionGroup component={null}>
            {userTasks.map((task) => (
              <CSSTransition 
                key={task.id}
                timeout={800}
                classNames="task-card"
                unmountOnExit
                in={task.progress < 100}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden task-card">
                  <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.track_name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.stage_name}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {task.progress.toFixed(0)}%
                    </span>
                  </div>
                  
                  <p className="mt-3 text-gray-600 dark:text-gray-300">{task.ai_summary}</p>
                  
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {task.sub_tasks.map((subTask: SubTask, index: number) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={subTask.completed}
                          onChange={() => toggleSubTask(task.id, index, subTask.completed)}
                          className="h-5 w-5 min-w-[1.25rem] min-h-[1.25rem] text-primary rounded focus:ring-primary"
                          style={{ width: '20px', height: '20px' }}
                        />
                        <span className={`ml-3 text-gray-700 dark:text-gray-300 ${subTask.completed ? 'line-through' : ''}`}>
                          {subTask.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yapay Zeka ile Plan Oluştur</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Step 1: Select Track */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Alan Seçimi</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Hangi alanda çalışmak istersin?</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => selectTrack(track)}
                        className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-primary hover:text-white transition duration-300"
                      >
                        <span className="text-3xl mb-3">{track.icon}</span>
                        <span className="font-medium">{track.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Stage */}
              {currentStep === 2 && selectedTrack && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {selectedTrack.name} - Aşama Seçimi
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Hangi aşamada çalışmak istersin?</p>
                  
                  <div className="space-y-3">
                    {selectedTrack.stages.map((stage) => (
                      <button
                        key={stage.id}
                        onClick={() => selectStage(stage)}
                        className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary hover:text-white transition duration-300"
                      >
                        <div className="font-medium">{stage.name}</div>
                        <div className="text-sm mt-1">
                          {stage.topics.join(', ')}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={prevQuestion}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-300"
                    >
                      Geri
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: AI Chat */}
              {currentStep === 3 && selectedTrack && selectedStage && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {selectedTrack.name} - {selectedStage.name}
                  </h3>
                  
                  <div className="space-y-4">
                    {aiQuestions.map((question, index) => (
                      <div key={question.id} className={`${index === currentQuestionIndex ? 'block' : 'hidden'}`}>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                          {question.question}
                        </label>
                        
                        {question.type === 'text' ? (
                          <textarea
                            value={answers[index] || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            placeholder="Cevabını buraya yaz..."
                          />
                        ) : (
                          <div className="flex space-x-4">
                            {question.options?.map((option, optionIndex) => (
                              <button
                                key={optionIndex}
                                onClick={() => {
                                  handleAnswerChange(index, option);
                                  nextQuestion();
                                }}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white rounded-lg transition duration-300"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {aiQuestions[currentQuestionIndex]?.type === 'text' && (
                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={prevQuestion}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-300"
                      >
                        Geri
                      </button>
                      <button
                        onClick={nextQuestion}
                        disabled={!answers[currentQuestionIndex]?.trim()}
                        className={`px-4 py-2 rounded-lg transition duration-300 ${
                          answers[currentQuestionIndex]?.trim()
                            ? 'bg-primary hover:bg-primary-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {currentQuestionIndex === aiQuestions.length - 1 ? 'Plan Oluştur' : 'İleri'}
                      </button>
                    </div>
                  )}
                  
                  {isGenerating && (
                    <div className="mt-6 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">Plan oluşturuluyor...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWorkPage;
