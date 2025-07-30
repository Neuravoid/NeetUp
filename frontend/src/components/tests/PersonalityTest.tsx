import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { personalityTestService } from '../../services/personality-test.service';
import { useAppSelector } from '../../hooks/reduxHooks';

interface PersonalityTestProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TestResult {
  area: string;
  score: number;
  description: string;
  message?: string;
  percentage?: number;
  compatibility_level?: string;
  normalized_score?: number;
}

const PersonalityTest: React.FC<PersonalityTestProps> = ({ isOpen, onClose }) => {
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(15).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<TestResult[]>([]);
  const [careerResult, setCareerResult] = useState<any>(null);
  const [testId, setTestId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [testStarted, setTestStarted] = useState(false);

  const questions = [
    "Karmaşık bir durumu anlamak için önce verileri toplar ve analiz ederim.",
    "Bir projenin başarılı olması için ekip içi iletişimin her şeyden önemli olduğuna inanırım.",
    "Bir şey tasarlarken insanların ne hissedeceğini sık sık düşünürüm.",
    "Detaylı planlar yapmayı ve her adımı kontrol etmeyi severim.",
    "Görünmeyen ama sistemin sorunsuz işlemesini sağlayan şeyleri inşa etmek beni tatmin eder.",
    "Bir sorunu çözmeden önce onu tüm yönleriyle anlamaya çalışırım.",
    "Yaratıcılığımı kullanabileceğim işler beni daha çok motive eder.",
    "Verilere bakmadan karar vermek bana güvensiz gelir.",
    "İnsanlar arasında denge kurmak ve herkesi aynı hedefe yönlendirmek bana doğal gelir.",
    "Bir sistemin arkasındaki yapıyı anlamak beni heyecanlandırır.",
    "Bir ürün ya da fikir başkalarının hayatını kolaylaştıyorsa daha anlamlı hale gelir.",
    "İyi bir ekip çalışmasının temelinde planlama ve zamanlama vardır.",
    "Kendi başıma uzun süre odaklanarak bir şey geliştirmek beni yormaz, aksine enerjimi artırır.",
    "Duygular değil; veriler, mantık ve sistemler bana daha anlamlı gelir.",
    "İnsanların bir şeyi kullanırken ne deneyimlediğini gözlemlemekten keyif alırım."
  ];

  // Initialize test when component opens
  useEffect(() => {
    if (isOpen && user) {
      initializeTest();
    }
  }, [isOpen, user]);

  const initializeTest = async () => {
    try {
      setIsLoading(true);
      setError('');
      const testData = await personalityTestService.startTest();
      setTestId(testData.test_id);
    } catch (err: any) {
      setError('Test başlatılırken hata oluştu: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const calculateResults = async (answersArray: number[] = answers) => {
    // Validate all questions are answered
    const allAnswered = answersArray.every(answer => answer > 0);
    if (!allAnswered) {
      setError('Lütfen tüm soruları cevaplayın.');
      return;
    }

    // Save results to database first
    if (testId) {
      try {
        setIsLoading(true);
        
        // Convert frontend answers to backend format - only send answered questions
        const backendAnswers = answersArray
          .map((answer, index) => ({
            question_id: `Q${index + 1}`,
            answer_value: answer
          }))
          .filter(answer => answer.answer_value > 0); // Only send valid answers
        
        if (backendAnswers.length !== 15) {
          throw new Error(`Tüm sorular cevaplanmalı. Cevaplanmış soru sayısı: ${backendAnswers.length}/15`);
        }
        
        await personalityTestService.submitAnswers(testId, backendAnswers);
        
        // Get test results from backend
        const testResults = await personalityTestService.getResults(testId);
        
        if (testResults.career_recommendations && testResults.career_recommendations.length > 0) {
          const careerRec = testResults.career_recommendations[0];
          setCareerResult({
            career_area: careerRec.title,
            message: careerRec.description,
            percentage: careerRec.match_percentage || 0,
            score: careerRec.score || 0,
            all_scores: careerRec.all_scores || {},
            compatibility_level: careerRec.compatibility_level || "Orta Uygunluk",
            normalized_score: careerRec.normalized_score || 3.0
          });
          
          // Create result for display
          setResult([{
            area: careerRec.title,
            score: careerRec.score || 0,
            description: careerRec.description,
            message: careerRec.description,
            percentage: careerRec.match_percentage || 0,
            compatibility_level: careerRec.compatibility_level || "Orta Uygunluk",
            normalized_score: careerRec.normalized_score || 3.0
          }]);
        } else {
          // Fallback to local calculation if backend doesn't return career results
          const localResults = calculateLocalResults(answersArray);
          setResult(localResults);
        }

        console.log('✅ Test sonuçları database\'e kaydedildi!');
      } catch (err: any) {
        console.error('❌ Database kayıt hatası:', err);
        setError('Sonuçlar kaydedilirken hata oluştu: ' + (err.response?.data?.detail || err.message));
        
        // Fallback to local calculation on error
        const localResults = calculateLocalResults(answersArray);
        setResult(localResults);
      } finally {
        setIsLoading(false);
      }
    } else {
      // No test ID, calculate locally
      const localResults = calculateLocalResults(answersArray);
      setResult(localResults);
    }

    setShowResult(true);
  };

  const calculateLocalResults = (answers: number[]): TestResult[] => {
    // UX toplam: S3 + S6 + S7 + S11 + S15 (index: 2, 5, 6, 10, 14)
    const uxScore = answers[2] + answers[5] + answers[6] + answers[10] + answers[14];
    
    // Backend toplam: S5 + S10 + S13 + S14 (index: 4, 9, 12, 13)
    const backendScore = answers[4] + answers[9] + answers[12] + answers[13];
    
    // Data Science toplam: S1 + S6 + S8 + S14 (index: 0, 5, 7, 13)
    const dataScore = answers[0] + answers[5] + answers[7] + answers[13];
    
    // Project Management toplam: S2 + S4 + S9 + S12 (index: 1, 3, 8, 11)
    const pmScore = answers[1] + answers[3] + answers[8] + answers[11];

    const results: TestResult[] = [
      { area: "UI/UX Designer", score: uxScore, description: "Kişiliğiniz UI/UX Designer alanına uygun. Tasarım sevginiz, kullanıcı deneyimine odaklanmanız ve yaratıcı çözümler üretme beceriniz bu alanla uyumunuzu gösteriyor." },
      { area: "Backend Developer", score: backendScore, description: "Kişiliğiniz Backend Developer alanına uygun. Sistemlerin arkasındaki detaylarla çalışma beceriniz, mantıksal düşünce yapınız ve teknik bağlantıları kurma yeteneğiniz bu alanla uyumunuzu gösteriyor. " },
      { area: "Data Science", score: dataScore, description: "Kişiliğiniz Data Science alanına uygun. Analitik düşünce yapınız, verileri anlama ve yorumlama beceriniz ile karmaşık problemleri çözme yaklaşımınız bu alanla uyumunuzu gösteriyor." },
      { area: "Project Management", score: pmScore, description: "Kişiliğiniz Project Management alanına uygun. Yönetim beceriniz, ekip koordinasyonu yapabilmeniz ve planlama yaklaşımınız bu alanla uyumunuzu gösteriyor." }
    ];

    // En yüksek skorları sırala
    results.sort((a, b) => b.score - a.score);
    
    // Eğer fark ≤2 ise ikinci en yüksek de gösterilir
    const topResults = [results[0]];
    if (results[1] && results[0].score - results[1].score <= 2) {
      topResults.push(results[1]);
    }

    return topResults;
  };

  const handleAnswer = (score: number) => {
    // Update answers array with the selected score
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, check if all have valid answers using newAnswers
      const allAnswered = newAnswers.every(answer => answer > 0);
      if (allAnswered) {
        calculateResults(newAnswers); // Pass the updated answers
      } else {
        setError('Lütfen tüm soruları cevaplayın.');
      }
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(15).fill(0));
    setShowResult(false);
    setResult([]);
    setCareerResult(null);
    setTestId('');
    setError('');
    setTestStarted(false);
  };

  const handleClose = () => {
    resetTest();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kişilik Testi
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">İşleniyor...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {!testStarted ? (
                // Professional Test Introduction Screen
                <div className="text-center py-8">
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Kişilik Envanteri
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      Kişiliğini test et ve sana uygun olan alanda ilerleme göster
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8 text-left">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Bu Test Size Neler Sağlayacak?
                    </h4>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span><strong>Kişilik Analizi:</strong> 4 ana kariyer alanından size en uygun olanı belirler</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span><strong>Kariyer Önerileri:</strong> UI/UX, Backend, Data Science, Project Management</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span><strong>Kişiselleştirilmiş Sonuçlar:</strong> Size özel kariyer yol haritası</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span><strong>Süre:</strong> Yaklaşık 5-7 dakika (15 soru)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>💡 İpucu:</strong> Sorulara samimi ve doğru cevaplar verin. İlk aklınıza gelen seçeneği işaretleyin.
                    </p>
                  </div>

                  <button
                    onClick={handleStartTest}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    🚀 Teste Başla
                  </button>
                </div>
              ) : !showResult ? (
                <>
                  {/* Dynamic Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Soru {currentQuestion + 1} / {questions.length}</span>
                      <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                      {questions[currentQuestion]}
                    </h3>

                    {/* Answer Options */}
                    <div className="space-y-3">
                      {[
                        { score: 5, text: "Kesinlikle Katılıyorum", color: "from-green-500 to-green-600" },
                        { score: 4, text: "Katılıyorum", color: "from-blue-500 to-blue-600" },
                        { score: 3, text: "Kararsızım", color: "from-yellow-500 to-yellow-600" },
                        { score: 2, text: "Katılmıyorum", color: "from-orange-500 to-orange-600" },
                        { score: 1, text: "Kesinlikle Katılmıyorum", color: "from-red-500 to-red-600" }
                      ].map((option) => (
                        <button
                          key={option.score}
                          onClick={() => handleAnswer(option.score)}
                          className={`w-full p-4 text-left rounded-lg border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 bg-gradient-to-r ${option.color} text-white hover:shadow-lg transform hover:scale-[1.02]`}
                        >
                          <span className="font-medium">{option.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Results */
                <div className="text-center">
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Kişilik Testi Sonuçlarınız
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Size en uygun kariyer alanları belirlendi
                    </p>
                  </div>

                  {careerResult ? (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700 mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5"></path>
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          🎯 Kariyer Alanınız: {careerResult.career_area}
                        </h4>
                      </div>
                      
                      <p className="text-purple-700 dark:text-purple-300 text-lg font-medium">
                        {careerResult.message.replace(/\d+\s*puan/g, '').replace(/\s+/g, ' ').trim()}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {result.map((res, index) => (
                        <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5"></path>
                              </svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                              🎯 Kariyer Alanınız: {res.area}
                            </h4>
                          </div>
                          
                          <p className="text-purple-700 dark:text-purple-300 text-lg font-medium">
                            {res.description.replace(/\d+\s*puan/g, '').replace(/\s+/g, ' ').trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Single guidance message */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h5 className="font-semibold text-blue-800 dark:text-blue-200">Sonraki Adım</h5>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Bilgi testi aşamasına geçmek için <strong>Becerilerim</strong> sayfasından 
                      belirlenen kariyer alanlarındaki testleri çözün. Bu testler teknik bilgi seviyenizi ölçerek 
                      size en uygun öğrenme yolunu belirleyecektir.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={resetTest}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Tekrar Dene
                    </button>
                    <button
                      onClick={() => {
                        onClose(); // Modal'ı kapat
                        navigate('/skills'); // Doğru route'a yönlendir
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      Becerilerim
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalityTest;
