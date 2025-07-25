import React, { useState, useEffect } from 'react';
import { personalityTestService, type PersonalityTestStart, type PersonalityQuestionsPage, type PersonalityAnswer, type PersonalityDemographics, type PersonalityTestResult } from '../services/personality-test.service';

interface PersonalityTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: PersonalityTestResult) => void;
}

type TestStep = 'intro' | 'questions' | 'demographics' | 'results';

const PersonalityTestModal: React.FC<PersonalityTestModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<TestStep>('intro');
  const [testData, setTestData] = useState<PersonalityTestStart | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsData, setQuestionsData] = useState<PersonalityQuestionsPage | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demographics, setDemographics] = useState<PersonalityDemographics>({
    full_name: '',
    birth_year: new Date().getFullYear() - 25,
    education: '',
    interests: '',
    career_goals: '',
    work_experience: ''
  });
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    if (isOpen && currentStep === 'intro') {
      initializeTest();
    }
  }, [isOpen]);

  const initializeTest = async () => {
    console.log('initializeTest called');
    try {
      setLoading(true);
      setError(null);
      console.log('Calling personalityTestService.startTest()');
      const testStart = await personalityTestService.startTest();
      console.log('Test started successfully:', testStart);
      setTestData(testStart);
      console.log('testData set to:', testStart);
    } catch (err) {
      console.error('Error initializing test:', err);
      setError('Test başlatılırken bir hata oluştu: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const startQuestions = async () => {
    console.log('startQuestions called');
    console.log('testData:', testData);
    
    if (!testData) {
      console.log('No testData available, returning early');
      setError('Test verisi bulunamadı. Lütfen sayfayı yenileyin.');
      return;
    }
    
    try {
      console.log('Starting to load questions...');
      setLoading(true);
      setError(null);
      const questions = await personalityTestService.getQuestions(1);
      console.log('Questions loaded:', questions);
      setQuestionsData(questions);
      setCurrentStep('questions');
      setCurrentPage(1);
      console.log('Successfully moved to questions step');
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Sorular yüklenirken bir hata oluştu: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const submitCurrentPage = async () => {
    if (!testData || !questionsData) return;

    try {
      setLoading(true);
      
      // Prepare answers for current page
      const pageAnswers: PersonalityAnswer[] = questionsData.questions.map(q => ({
        question_id: q.id,
        answer_value: answers[q.id] || 3
      }));

      // Submit answers
      await personalityTestService.submitAnswers(testData.test_id, pageAnswers);

      // Check if there are more pages
      if (currentPage < questionsData.total_pages) {
        // Load next page
        const nextPage = currentPage + 1;
        const nextQuestions = await personalityTestService.getQuestions(nextPage);
        setQuestionsData(nextQuestions);
        setCurrentPage(nextPage);
      } else {
        // All questions completed, move to demographics
        setCurrentStep('demographics');
      }
    } catch (err) {
      setError('Cevaplar kaydedilirken bir hata oluştu.');
      console.error('Error submitting answers:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitDemographics = async () => {
    if (!testData) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Submitting demographics:', demographics);
      await personalityTestService.submitDemographics(testData.test_id, demographics);
      
      console.log('Getting test results...');
      // Get final results
      const results = await personalityTestService.getResults(testData.test_id);
      console.log('Test results received:', results);
      
      setTestResults(results);
      setCurrentStep('results');
      onComplete(results);
    } catch (err) {
      console.error('Error submitting demographics:', err);
      setError('Test tamamlanırken bir hata oluştu: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getScaleLabel = (value: number): string => {
    const labels = {
      1: 'Hiç katılmıyorum',
      2: 'Katılmıyorum', 
      3: 'Kararsızım',
      4: 'Katılıyorum',
      5: 'Tamamen katılıyorum'
    };
    return labels[value as keyof typeof labels] || 'Kararsızım';
  };

  const isCurrentPageComplete = (): boolean => {
    if (!questionsData) return false;
    return questionsData.questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
  };

  const goToPreviousPage = async () => {
    if (currentPage > 1) {
      try {
        setLoading(true);
        const prevPage = currentPage - 1;
        const prevQuestions = await personalityTestService.getQuestions(prevPage);
        setQuestionsData(prevQuestions);
        setCurrentPage(prevPage);
      } catch (err) {
        console.error('Error loading previous page:', err);
        setError('Bir önceki sayfa yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    } else {
      // If on first page, go back to intro
      setCurrentStep('intro');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {testData?.title || 'Kişilik Testi'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {currentStep === 'intro' && (
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🎯 Kişilik ve Kariyer Analizi
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Kişiliğinizi keşfedin ve size özel kariyer önerilerini alın! Bu bilimsel test, 
                <span className="font-semibold text-purple-600"> yapay zeka destekli analiz</span> ile 
                size en uygun kariyer yolunu bulmanıza yardımcı olacak.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Hızlı ve Kolay</h4>
                  </div>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>📝 {testData?.total_questions || 25} soru</li>
                    <li>⏱️ {testData?.estimated_duration || 15} dakika</li>
                    <li>📱 Mobil uyumlu</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Kişiye Özel</h4>
                  </div>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>🤖 AI destekli analiz</li>
                    <li>🎯 Kariyer önerileri</li>
                    <li>📈 Gelişim planı</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>İpucu:</strong> En doğru sonuçlar için sorulara dürüstçe cevap verin. İlk aklınıza gelen yanıtı seçin.
                  </p>
                </div>
              </div>
              
              <button
                onClick={startQuestions}
                disabled={loading}
                className="btn-primary px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Hazırlanıyor...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Teste Başla
                  </div>
                )}
              </button>
            </div>
          )}

          {currentStep === 'questions' && questionsData && (
            <div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {questionsData.page_title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lütfen her soruyu dikkatlice okuyup size en uygun seçeneği işaretleyin
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      {currentPage} / {questionsData.total_pages}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Sayfa
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm" 
                      style={{ width: `${(currentPage / questionsData.total_pages) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Başlangıç</span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      %{Math.round((currentPage / questionsData.total_pages) * 100)} tamamlandı
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Bitiş</span>
                  </div>
                </div>
              </div>

                {/* Questions */}
                <div className="space-y-8">
                {questionsData.questions.map((question, index) => (
                  <div key={question.id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start mb-6">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                          {question.text}
                        </h4>
                        {question.subcategory && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {question.subcategory}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-12">
                      <div className="grid grid-cols-1 gap-3">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const isSelected = answers[question.id] === value;
                          return (
                            <label key={value} className={`flex items-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-sm' 
                                : 'border-gray-200 dark:border-gray-600'
                            }`}>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-200 ${
                                isSelected 
                                  ? 'border-purple-500 bg-purple-500' 
                                  : 'border-gray-300 dark:border-gray-500'
                              }`}>
                                {isSelected && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={value}
                                checked={isSelected}
                                onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                                className="sr-only"
                              />
                              <div className="flex-1">
                                <span className={`text-sm font-medium transition-colors duration-200 ${
                                  isSelected 
                                    ? 'text-purple-700 dark:text-purple-300' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {getScaleLabel(value)}
                                </span>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200' 
                                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {value}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={goToPreviousPage}
                disabled={loading}
                className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {currentPage > 1 ? 'Önceki Sayfa' : 'Geri'}
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className={questionsData.questions.filter(q => answers[q.id]).length === questionsData.questions.length ? 'text-green-600 font-medium' : ''}>
                    {questionsData.questions.filter(q => answers[q.id]).length} / {questionsData.questions.length} cevaplandı
                  </span>
                </div>
                
                {!isCurrentPageComplete() && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                    Tüm soruları cevaplayın
                  </div>
                )}
                
                <button
                  onClick={submitCurrentPage}
                  disabled={loading || !isCurrentPageComplete()}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      {currentPage < questionsData.total_pages ? 'Sonraki Sayfa' : 'Kişisel Bilgilere Geç'}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
            </div>
          )}

          {currentStep === 'demographics' && (
            <div>
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  📝 Son Adım: Kişisel Bilgiler
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Size özel kariyer önerileri oluşturmak için birkaç kişisel bilginize ihtiyacımız var.
                  <br />Bu bilgiler sadece analiz için kullanılacak ve güvenle saklanacaktır.
                </p>
              </div>
              
              <div className="grid gap-6">
                {/* Basic Info Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 118 0v2m-4 0a2 2 0 104 0m-4 0v2m0 0h4" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Temel Bilgiler</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center">
                          Ad Soyad
                          <span className="text-red-500 ml-1">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={demographics.full_name}
                        onChange={(e) => setDemographics(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center">
                          Doğum Yılı
                          <span className="text-red-500 ml-1">*</span>
                        </span>
                      </label>
                      <input
                        type="number"
                        value={demographics.birth_year}
                        onChange={(e) => setDemographics(prev => ({ ...prev, birth_year: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                        min="1924"
                        max="2009"
                        placeholder="Örn: 1995"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Eğitim Durumu
                    </label>
                    <select
                      value={demographics.education}
                      onChange={(e) => setDemographics(prev => ({ ...prev, education: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    >
                      <option value="">Eğitim durumunuzu seçin</option>
                      <option value="Lise">Lise</option>
                      <option value="Ön Lisans">Ön Lisans</option>
                      <option value="Lisans">Lisans</option>
                      <option value="Yüksek Lisans">Yüksek Lisans</option>
                      <option value="Doktora">Doktora</option>
                    </select>
                  </div>
                </div>
                
                {/* Interests & Goals Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">İlgi Alanları & Hedefler</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        İlgi Alanlarınız
                      </label>
                      <textarea
                        value={demographics.interests}
                        onChange={(e) => setDemographics(prev => ({ ...prev, interests: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none"
                        rows={3}
                        placeholder="Örn: Teknoloji, müzik, spor, okuma, seyahat, sanat..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kariyer Hedefleriniz
                      </label>
                      <textarea
                        value={demographics.career_goals}
                        onChange={(e) => setDemographics(prev => ({ ...prev, career_goals: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none"
                        rows={3}
                        placeholder="Örn: Yazılım geliştiricisi olmak, kendi şirketimi kurmak, liderlik pozisyonuna ulaşmak..."
                      />
                    </div>
                  </div>
                </div>
                
                {/* Experience Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">İş Deneyimi</h4>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Önceki Deneyimleriniz
                    </label>
                    <textarea
                      value={demographics.work_experience}
                      onChange={(e) => setDemographics(prev => ({ ...prev, work_experience: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none"
                      rows={3}
                      placeholder="Örn: Stajyer olarak çalıştım, freelance projeler yaptım, henüz deneyimim yok..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={goToPreviousPage}
                  disabled={loading}
                  className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Sorulara Dön
                </button>
                
                <div className="flex items-center space-x-4">
                  {!demographics.full_name && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                      Ad soyad zorunlu
                    </div>
                  )}
                  
                  <button
                    onClick={submitDemographics}
                    disabled={!demographics.full_name || loading}
                    className="flex items-center px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analiz Ediliyor...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Testi Tamamla
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'results' && testResults && (
            <div className="max-h-[70vh] overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🎉 Kişilik Analizi Tamamlandı!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yapay zeka destekli analiziniz hazır. Size özel kariyer önerilerinizi inceleyin.
                </p>
              </div>

              {/* Personality Comment */}
              {testResults.personality_comment && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 mb-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Kişilik Değerlendirmeniz</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {testResults.personality_comment}
                  </p>
                </div>
              )}

              {/* Strengths & Areas to Improve */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Strengths */}
                {testResults.strengths && testResults.strengths.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-green-900 dark:text-green-100">Güçlü Yönleriniz</h4>
                    </div>
                    <ul className="space-y-2">
                      {testResults.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas to Improve */}
                {testResults.areas_to_improve && testResults.areas_to_improve.length > 0 && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Gelişim Alanları</h4>
                    </div>
                    <ul className="space-y-2">
                      {testResults.areas_to_improve.map((area: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-amber-500 mr-2 mt-1">→</span>
                          <span className="text-gray-700 dark:text-gray-300">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Career Recommendations */}
              {testResults.detailed_career_recommendations && testResults.detailed_career_recommendations.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Size Özel Kariyer Önerileri</h4>
                  </div>
                  <div className="grid gap-4">
                    {testResults.detailed_career_recommendations.map((career: any, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-gray-900 dark:text-white">{career.title}</h5>
                          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                            %{career.match_percentage} uyum
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{career.description}</p>
                        {career.skills_needed && (
                          <div className="flex flex-wrap gap-1">
                            {career.skills_needed.map((skill: string, skillIndex: number) => (
                              <span key={skillIndex} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Recommendations */}
              {testResults.detailed_course_recommendations && testResults.detailed_course_recommendations.length > 0 && (
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6 mb-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-teal-900 dark:text-teal-100">Önerilen Kurslar</h4>
                  </div>
                  <div className="grid gap-4">
                    {testResults.detailed_course_recommendations.map((course: any, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-gray-900 dark:text-white">{course.title}</h5>
                          <div className="flex gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              course.priority === 'Yüksek' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              course.priority === 'Orta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {course.priority}
                            </span>
                            {course.difficulty && (
                              <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                                {course.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{course.description}</p>
                        {course.duration && (
                          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                            Süre: {course.duration}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    // Reset modal state for potential retake
                    setCurrentStep('intro');
                    setTestResults(null);
                    setAnswers({});
                    setDemographics({
                      full_name: '',
                      birth_year: new Date().getFullYear() - 25,
                      education: '',
                      interests: '',
                      career_goals: '',
                      work_experience: ''
                    });
                  }}
                  className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Testi Tekrarla
                </button>
                
                <button
                  onClick={onClose}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Yol Haritasına Git
                </button>
              </div>
            </div>
          )}

          {currentStep === 'results' && !testResults && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sonuçlar Yüklenemedi
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Test sonuçları alınırken bir hata oluştu. Lütfen tekrar deneyin.
              </p>
              <button
                onClick={() => setCurrentStep('demographics')}
                className="btn-primary"
              >
                Tekrar Dene
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalityTestModal;
