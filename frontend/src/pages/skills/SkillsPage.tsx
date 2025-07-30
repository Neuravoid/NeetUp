import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KnowledgeTest, { KnowledgeTestResult } from '../../components/tests/KnowledgeTest';

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  created_at: string;
}

const SkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [personalityResult, setPersonalityResult] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch personality test result
  useEffect(() => {
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
          if (data && data.personality_result) {
            setPersonalityResult(data.personality_result);
          }
        }
      } catch (error) {
        console.error('Error fetching personality test result:', error);
      }
    };

    fetchPersonalityResult();
  }, []);

  // Initialize with empty skills and set loading to false
  useEffect(() => {
    // No mock data, just set loading to false
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleDeleteSkill = (skillId: string) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'expert': return 'Uzman';
      case 'advanced': return 'İleri';
      case 'intermediate': return 'Orta';
      case 'beginner': return 'Başlangıç';
      default: return 'Bilinmiyor';
    }
  };

  // Map skill level from test result to skill level in our system
  const mapSkillLevel = (testLevel: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
    switch (testLevel) {
      case 'İleri': return 'advanced';
      case 'Orta': return 'intermediate';
      case 'Başlangıç': return 'beginner';
      default: return 'beginner';
    }
  };

  // Handle test results loaded from KnowledgeTest component
  const handleTestResultsLoaded = (results: Record<string, KnowledgeTestResult>) => {
    // Check if we have any results
    if (Object.keys(results).length === 0) return;

    // Get the personality test result
    const personalityArea = personalityResult;
    
    // Process each test result
    Object.values(results).forEach(result => {
      // Get test title and category from result data
      const testTitle = result.test_title;
      const testCategory = result.test_category;
      
      // Check if this skill already exists
      const existingSkill = skills.find(skill => 
        skill.name === testTitle && skill.category === testCategory
      );
      
      // If skill doesn't exist, add it
      if (!existingSkill) {
        const newSkillFromTest: Skill = {
          id: Date.now().toString() + result.test_id,
          name: testTitle,
          level: mapSkillLevel(result.skill_level),
          category: testCategory,
          created_at: result.completion_date
        };
        
        setSkills(prevSkills => [...prevSkills, newSkillFromTest]);
      }
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Becerilerim</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Beceri seviyenizi görüntüleyin ve geliştirin
        </p>
      </div>
      
      {loading ? (
        <div className="card p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Beceriler yükleniyor...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Knowledge Tests Section */}
          <KnowledgeTest onTestResultsLoaded={handleTestResultsLoaded} />
          
          {/* Skills List Header */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Beceri Listesi</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Toplam {skills.length} beceri</p>
          </div>

          {/* Skills Grid */}
          {skills.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <div key={skill.id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Kategori: {skill.category}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                        {getLevelText(skill.level)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Eklenme: {new Date(skill.created_at).toLocaleDateString('tr-TR')}
                  </div>
                  <button 
                    className="mt-4 w-full py-2 px-3 flex items-center justify-center text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors shadow-md"
                    onClick={() => navigate('/roadmap')}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                      />
                    </svg>
                    Kariyer Yolunu Görüntüle
                  </button>
                </div>
              ))}
            </div>
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0114 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Henüz beceri kazanmadınız</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Bilgi testlerini çözerek becerilerinizi kazanın ve kariyer hedeflerinize daha hızlı ulaşın.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SkillsPage;
