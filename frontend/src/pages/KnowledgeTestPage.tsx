import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  question_text: string;
  order: number;
  difficulty: string;
  answers: Array<{
    id: string;
    text: string;
  }>;
}

interface TestInfo {
  test_id: string;
  title: string;
  duration_minutes: number;
  total_questions: number;
}

interface TestResult {
  test_id: string;
  test_title: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  skill_level: string;
  completion_date: string;
}

const KnowledgeTestPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (testId) {
      startTest();
    }
  }, [testId]);

  useEffect(() => {
    let interval: number;
    
    if (testStarted && timeLeft > 0 && !testCompleted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [testStarted, timeLeft, testCompleted]);

  const startTest = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Start test
      const startResponse = await fetch(`http://localhost:8080/api/knowledge-tests/${testId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (startResponse.ok) {
        const testData = await startResponse.json();
        setTestInfo(testData);
        setTimeLeft(testData.duration_minutes * 60);

        // Get questions
        const questionsResponse = await fetch(`http://localhost:8080/api/knowledge-tests/${testId}/questions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestions(questionsData);
          setTestStarted(true);
        }
      }
    } catch (error) {
      console.error('Error starting test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitTest = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const submission = {
        test_id: testId,
        answers: Object.entries(answers).map(([questionId, answerId]) => ({
          question_id: questionId,
          answer_id: answerId
        }))
      };

      const response = await fetch(`http://localhost:8080/api/knowledge-tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      if (response.ok) {
        const resultData = await response.json();
        setResult(resultData);
        setTestCompleted(true);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'İleri': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Orta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Başlangıç': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Test hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (testCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Test Tamamlandı!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {result.test_title} testini başarıyla tamamladınız.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Math.round(result.score)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Puan (100 üzerinden)</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {result.correct_answers}/{result.total_questions}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Doğru Cevap</div>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(result.skill_level)} mb-2`}>
                  {result.skill_level}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Seviye</div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/skills')}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Becerilerim Sayfasına Dön
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!testStarted || !testInfo || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Test yüklenemiyor...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                {testInfo.title}
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Soru {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Cevaplanan: {getAnsweredCount()}/{questions.length}
              </div>
              <div className={`text-sm font-medium ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
              <button
                onClick={() => navigate('/skills')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Testi Kapat
                <svg className="ml-1 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 dark:bg-gray-700 h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
              {currentQuestion.question_text}
            </h2>
          </div>

          <div className="space-y-3 mb-8">
            {currentQuestion.answers.map((answer) => (
              <label
                key={answer.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion.id] === answer.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={answer.id}
                  checked={answers[currentQuestion.id] === answer.id}
                  onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[currentQuestion.id] === answer.id
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {answers[currentQuestion.id] === answer.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-gray-900 dark:text-white">{answer.text}</span>
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Önceki
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={submitTest}
                disabled={submitting || getAnsweredCount() === 0}
                className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Gönderiliyor...' : 'Testi Bitir'}
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Sonraki
                <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeTestPage;
