import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface KnowledgeTest {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  question_count: number;
}

export interface KnowledgeTestResult {
  test_id: string;
  score: number;
  skill_level: string;
  completion_date: string;
  test_title: string;
  test_category: string;
}

interface KnowledgeTestProps {
  onTestResultsLoaded?: (results: Record<string, KnowledgeTestResult>) => void;
}

const KnowledgeTest: React.FC<KnowledgeTestProps> = ({ onTestResultsLoaded }) => {
  const [tests, setTests] = useState<KnowledgeTest[]>([]);
  const [results, setResults] = useState<Record<string, KnowledgeTestResult>>({});
  const [loading, setLoading] = useState(true);
  const [personalityResult, setPersonalityResult] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchKnowledgeTests();
      await fetchPersonalityResult();
      setLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    // When results are loaded, pass them to parent component
    if (onTestResultsLoaded && Object.keys(results).length > 0) {
      onTestResultsLoaded(results);
    }
  }, [results, onTestResultsLoaded]);

  const fetchPersonalityResult = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/personality-test/result', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Full personality test result data:', data);
        if (data && data.personality_result) {
          console.log('Personality test result:', data.personality_result);
          setPersonalityResult(data.personality_result);
        } else {
          console.log('No personality_result field in data:', data);
        }
      } else {
        console.log('Failed to fetch personality test result:', response.status);
        try {
          const errorText = await response.text();
          console.log('Error response:', errorText);
        } catch (e) {
          console.log('Could not read error response');
        }
      }
    } catch (error) {
      console.error('Error fetching personality test result:', error);
    }
  };

  const fetchKnowledgeTests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/knowledge-tests/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const testsData = await response.json();
        setTests(testsData);
        
        // Fetch results for each test
        const resultsPromises = testsData.map(async (test: KnowledgeTest) => {
          try {
            const resultResponse = await fetch(`http://localhost:8080/api/knowledge-tests/${test.id}/result`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': `application/json`,
              },
            });
            
            if (resultResponse.ok) {
              const resultData = await resultResponse.json();
              // Add test title to result data for easier reference
              return { 
                testId: test.id, 
                result: { 
                  ...resultData,
                  test_title: test.title,
                  test_category: getTestCategory(test.title)
                } 
              };
            }
          } catch (error) {
            // Result not found, user hasn't taken the test yet
            return null;
          }
        });

        const resultsData = await Promise.all(resultsPromises);
        const resultsMap: Record<string, KnowledgeTestResult> = {};
        
        resultsData.forEach((item) => {
          if (item) {
            resultsMap[item.testId] = item.result;
          }
        });
        
        setResults(resultsMap);
      }
    } catch (error) {
      console.error('Error fetching knowledge tests:', error);
    }
  };

  const handleStartTest = (testId: string) => {
    navigate(`/knowledge-test/${testId}`);
  };

  const getTestIcon = (title: string) => {
    if (title.includes('UI/UX')) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z" />
          </svg>
        </div>
      );
    } else if (title.includes('Backend')) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
      );
    } else if (title.includes('Data Science')) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      );
    } else if (title.includes('Project Management')) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
      );
    }
    
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
    );
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Başlangıç': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Orta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'İleri': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTestCategory = (title: string): string => {
    if (title.includes('UI/UX')) return 'UI/UX';
    if (title.includes('Backend')) return 'Backend';
    if (title.includes('Data Science')) return 'Data Science';
    if (title.includes('Project Management')) return 'Project Management';
    return title;
  };

  // Check if a test matches the personality result
  const matchesPersonalityResult = (testTitle: string): boolean => {
    if (!personalityResult) {
      console.log('No personality result found');
      return false;
    }
    
    console.log('Matching test:', testTitle, 'with personality result:', personalityResult);
    
    // Normalize both strings for comparison (remove case sensitivity and extra spaces)
    const normalizedResult = personalityResult.trim().toLowerCase();
    const normalizedTitle = testTitle.trim().toLowerCase();
    
    console.log('Normalized result:', normalizedResult);
    console.log('Normalized title:', normalizedTitle);
    
    // Direct check for UI/UX
    if (normalizedTitle.includes('ui/ux') && normalizedResult.includes('ui/ux')) {
      console.log('UI/UX direct match found!');
      return true;
    }
    
    // Check for exact matches first
    if (normalizedTitle.includes(normalizedResult)) {
      console.log('Direct match found!');
      return true;
    }
    
    // Check for partial matches based on career areas
    if (
      (normalizedResult.includes('ui/ux') || normalizedResult.includes('ui/ux designer') || 
       normalizedResult === 'ui/ux designer') && 
      normalizedTitle.includes('ui/ux')
    ) {
      console.log('UI/UX match found!');
      return true;
    } else if (
      (normalizedResult.includes('backend') || normalizedResult.includes('backend developer')) && 
      normalizedTitle.includes('backend')
    ) {
      console.log('Backend match found!');
      return true;
    } else if (
      (normalizedResult.includes('data science') || normalizedResult.includes('data')) && 
      normalizedTitle.includes('data science')
    ) {
      console.log('Data Science match found!');
      return true;
    } else if (
      (normalizedResult.includes('project management') || normalizedResult.includes('project')) && 
      normalizedTitle.includes('project management')
    ) {
      console.log('Project Management match found!');
      return true;
    }
    
    return false;
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Bilgi testleri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Bilgi Testleri</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Kariyer alanlarındaki bilgi seviyenizi ölçün ve gelişim alanlarınızı keşfedin
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {tests.map((test) => {
          const result = results[test.id];
          const hasResult = !!result;
          const isRecommended = matchesPersonalityResult(test.title);

          // Inline styles for animation with proper TypeScript types
          const pulseStyle: React.CSSProperties = isRecommended ? {
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.6)',
            position: 'relative',
            border: '2px solid #6366f1',
            borderRadius: '0.5rem',
          } : {};

          const borderStyle: React.CSSProperties = isRecommended ? {
            position: 'absolute',
            inset: '0',
            borderRadius: '0.5rem',
            border: '2px solid #6366f1',
            animation: 'pulse-border 2s infinite',
            pointerEvents: 'none' as const,
          } : {};

          return (
            <div 
              key={test.id} 
              className={`card p-6 hover:shadow-lg transition-shadow relative ${isRecommended ? 'recommended-test' : ''}`}
              style={pulseStyle}
              data-test-id={test.id}
            >
              {isRecommended && (
                <div style={borderStyle}></div>
              )}
              <div className="flex items-start space-x-4">
                {getTestIcon(test.title)}
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {test.title}
                    {isRecommended && (
                      <span className="ml-2 text-xs text-indigo-600 font-medium">
                        (Kişilik testinize uygun)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {test.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {test.duration_minutes} dakika
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {test.question_count} soru
                    </span>
                  </div>

                  {hasResult && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Son Sonuç:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {Math.round(result.score)}/100
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(result.skill_level)}`}>
                            {result.skill_level}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleStartTest(test.id)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                  >
                    {hasResult ? 'Tekrar Al' : 'Teste Başla'}
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-shadow {
          0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
          100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
        }
        
        @keyframes pulse-border {
          0% { border-color: rgba(99, 102, 241, 0.5); }
          50% { border-color: rgba(99, 102, 241, 1); }
          100% { border-color: rgba(99, 102, 241, 0.5); }
        }
        
        .recommended-test {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
          border: 2px solid #6366f1;
          position: relative;
        }
      `}} />

    </div>
  );
};

export default KnowledgeTest;
