import { apiService } from './api';

export interface CareerPath {
  id: string;
  title: string;
  description?: string;
  skills_required?: string | string[];
  avg_salary?: number;
  created_at: string;
  updated_at: string;
}

export interface RoadmapStep {
  id: string;
  roadmap_id: string;
  title: string;
  description?: string;
  order: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'locked' | 'available';
  completion_date?: string;
  created_at: string;
  updated_at: string;
  learning_objectives?: string[] | string;
  task_count?: number;
  duration_weeks?: number;
  duration_hours?: number;
  tasks_count?: number;
  duration?: string;
  course_link?: string;
}

export interface UserRoadmap {
  id: string;
  user_id: string;
  career_path_id: string;
  created_date: string;
  completion_percentage: number;
  career_path: CareerPath;
  steps: RoadmapStep[];
  recommended_start_index?: number; // Index of the recommended starting point based on knowledge test
}

export interface RecentActivity {
  id: string;
  type: 'course_completed' | 'step_completed' | 'test_taken';
  title: string;
  description: string;
  timestamp: string;
  icon_type: 'success' | 'progress' | 'info';
}

// API response interfaces
export interface PersonalityTestResponse {
  personality_result: string;
  [key: string]: any;
}

export interface KnowledgeTestResponse {
  skill_level: string;
  [key: string]: any;
}

// Roadmap şablonları - her kariyer alanı için sabit aşamalar
export const ROADMAP_TEMPLATES: Record<string, Array<{
  title: string;
  description: string;
  tasks_count: number;
  duration: string;
  learning_objectives: string[];
}>> = {
  'Proje Yönetimi': [
    {
      title: 'Aşama 1 – Proje Yönetiminin Temelleri',
      description: 'Öğrenilecekler: Proje nedir, proje yöneticisinin rolü, proje yaşam döngüsü, paydaşlarla iletişim',
      tasks_count: 25,
      duration: '3 hafta (yaklaşık 18 saat)',
      learning_objectives: ['Proje nedir', 'Proje yöneticisinin rolü', 'Proje yaşam döngüsü', 'Paydaşlarla iletişim']
    },
    {
      title: 'Aşama 2 – Proje Başlatma',
      description: 'Öğrenilecekler: Proje hedefi yazma, kapsam belgesi, proje belgeleri oluşturma',
      tasks_count: 20,
      duration: '3 hafta (15-18 saat)',
      learning_objectives: ['Proje hedefi yazma', 'Kapsam belgesi', 'Proje belgeleri oluşturma']
    },
    {
      title: 'Aşama 3 – Proje Planlama',
      description: 'Öğrenilecekler: Zaman çizelgesi hazırlama, bütçe planı, risk yönetimi, iletişim planı',
      tasks_count: 25,
      duration: '4 hafta (20-25 saat)',
      learning_objectives: ['Zaman çizelgesi hazırlama', 'Bütçe planı', 'Risk yönetimi', 'İletişim planı']
    },
    {
      title: 'Aşama 4 – Projeyi Yürütme',
      description: 'Öğrenilecekler: Takip etme, ilerleme raporları, kalite yönetimi',
      tasks_count: 20,
      duration: '3 hafta (15-18 saat)',
      learning_objectives: ['Takip etme', 'İlerleme raporları', 'Kalite yönetimi']
    },
    {
      title: 'Aşama 5 – Çevik (Agile) Proje Yönetimi',
      description: 'Öğrenilecekler: Agile yaklaşımı, Scrum, sprint planlama',
      tasks_count: 25,
      duration: '4 hafta (20 saat)',
      learning_objectives: ['Agile yaklaşımı', 'Scrum', 'Sprint planlama']
    },
    {
      title: 'Aşama 6 – Bitirme Projesi (Capstone)',
      description: 'Öğrenilecekler: Gerçek senaryoya dayalı proje planı hazırlama',
      tasks_count: 15,
      duration: '2 hafta (10-12 saat)',
      learning_objectives: ['Gerçek senaryoya dayalı proje planı hazırlama']
    }
  ],
  'Veri Analizi': [
    {
      title: 'Aşama 1 – Veri Bilimine Giriş',
      description: 'Öğrenilecekler: Veri toplama, temizleme, temel analiz süreci',
      tasks_count: 25,
      duration: '3 hafta (18-20 saat)',
      learning_objectives: ['Veri toplama', 'Veri temizleme', 'Temel analiz süreci']
    },
    {
      title: 'Aşama 2 – Python\'a Başlangıç',
      description: 'Öğrenilecekler: Python temelleri, veri yapıları, fonksiyonlar, pandas',
      tasks_count: 30,
      duration: '4 hafta (25 saat)',
      learning_objectives: ['Python temelleri', 'Veri yapıları', 'Fonksiyonlar', 'Pandas']
    },
    {
      title: 'Aşama 3 – Sayıların Ötesine Geçmek',
      description: 'Öğrenilecekler: Veriyi hikâyeye dönüştürme, iş kararları için yorumlama',
      tasks_count: 20,
      duration: '3 hafta (15-18 saat)',
      learning_objectives: ['Veriyi hikâyeye dönüştürme', 'İş kararları için yorumlama']
    },
    {
      title: 'Aşama 4 – İstatistiğin Gücü',
      description: 'Öğrenilecekler: Temel istatistik, olasılık, hipotez testleri',
      tasks_count: 25,
      duration: '4 hafta (20-25 saat)',
      learning_objectives: ['Temel istatistik', 'Olasılık', 'Hipotez testleri']
    },
    {
      title: 'Aşama 5 – Regresyon Analizi',
      description: 'Öğrenilecekler: Doğrusal regresyon, çoklu regresyon, modellerin yorumlanması',
      tasks_count: 20,
      duration: '3 hafta (18-20 saat)',
      learning_objectives: ['Doğrusal regresyon', 'Çoklu regresyon', 'Modellerin yorumlanması']
    },
    {
      title: 'Aşama 6 – Makine Öğrenmesine Giriş',
      description: 'Öğrenilecekler: Temel algoritmalar, model kurma ve doğrulama',
      tasks_count: 25,
      duration: '4 hafta (22-25 saat)',
      learning_objectives: ['Temel algoritmalar', 'Model kurma', 'Model doğrulama']
    },
    {
      title: 'Aşama 7 – Bitirme Projesi',
      description: 'Öğrenilecekler: Gerçek veri ile sıfırdan analiz projesi',
      tasks_count: 15,
      duration: '2 hafta (10-12 saat)',
      learning_objectives: ['Gerçek veri ile sıfırdan analiz projesi']
    }
  ],
  'UX Tasarımı': [
    {
      title: 'Aşama 1 – UX Tasarımına Giriş',
      description: 'Öğrenilecekler: UX nedir, kullanıcı odaklı tasarım',
      tasks_count: 20,
      duration: '3 hafta (15-18 saat)',
      learning_objectives: ['UX nedir', 'Kullanıcı odaklı tasarım']
    },
    {
      title: 'Aşama 2 – UX Tasarım Sürecine Başlamak',
      description: 'Öğrenilecekler: Empati haritaları, kullanıcı hikâyeleri, problem tanımı',
      tasks_count: 25,
      duration: '3 hafta (18-20 saat)',
      learning_objectives: ['Empati haritaları', 'Kullanıcı hikâyeleri', 'Problem tanımı']
    },
    {
      title: 'Aşama 3 – Wireframe ve Düşük Detaylı Prototip',
      description: 'Öğrenilecekler: Basit çizimler, temel prototipler',
      tasks_count: 20,
      duration: '3 hafta (15-18 saat)',
      learning_objectives: ['Basit çizimler', 'Temel prototipler']
    },
    {
      title: 'Aşama 4 – Araştırma ve Test',
      description: 'Öğrenilecekler: Kullanıcı araştırmaları, test yapmak, geri bildirim',
      tasks_count: 25,
      duration: '4 hafta (20-22 saat)',
      learning_objectives: ['Kullanıcı araştırmaları', 'Test yapmak', 'Geri bildirim']
    },
    {
      title: 'Aşama 5 – Figma ile Yüksek Detaylı Tasarım',
      description: 'Öğrenilecekler: Renk, tipografi, responsive tasarım',
      tasks_count: 25,
      duration: '4 hafta (20-25 saat)',
      learning_objectives: ['Renk', 'Tipografi', 'Responsive tasarım']
    },
    {
      title: 'Aşama 6 – Dinamik Arayüz Oluşturma',
      description: 'Öğrenilecekler: Basit HTML/CSS/JS, etkileşimli prototipler',
      tasks_count: 20,
      duration: '3 hafta (18-20 saat)',
      learning_objectives: ['Basit HTML/CSS/JS', 'Etkileşimli prototipler']
    },
    {
      title: 'Aşama 7 – Bitirme Projesi',
      description: 'Öğrenilecekler: Sosyal fayda odaklı bir ürün tasarlama',
      tasks_count: 15,
      duration: '2 hafta (10-12 saat)',
      learning_objectives: ['Sosyal fayda odaklı bir ürün tasarlama']
    }
  ],
  'Backend Geliştirme': [
    {
      title: 'Aşama 1 – Backend Temelleri',
      description: 'Öğrenilecekler: Sunucu-istemci mantığı, HTTP, REST API nedir',
      tasks_count: 20,
      duration: '3 hafta (15-18 saat)',
      learning_objectives: ['Sunucu-istemci mantığı', 'HTTP', 'REST API nedir']
    },
    {
      title: 'Aşama 2 – Programlama Dili (Python veya Node.js)',
      description: 'Öğrenilecekler: Temel programlama, fonksiyonlar, modüller',
      tasks_count: 30,
      duration: '4 hafta (25 saat)',
      learning_objectives: ['Temel programlama', 'Fonksiyonlar', 'Modüller']
    },
    {
      title: 'Aşama 3 – Veritabanları',
      description: 'Öğrenilecekler: SQL, CRUD işlemleri, ilişkisel ve NoSQL veritabanı farkları',
      tasks_count: 25,
      duration: '4 hafta (20-25 saat)',
      learning_objectives: ['SQL', 'CRUD işlemleri', 'İlişkisel ve NoSQL veritabanı farkları']
    },
    {
      title: 'Aşama 4 – Framework Kullanımı',
      description: 'Öğrenilecekler: Django/Flask veya Express.js ile API geliştirme',
      tasks_count: 30,
      duration: '4 hafta (25 saat)',
      learning_objectives: ['Django/Flask veya Express.js ile API geliştirme']
    },
    {
      title: 'Aşama 5 – Kimlik Doğrulama ve Güvenlik',
      description: 'Öğrenilecekler: JWT, kullanıcı oturumu, güvenlik temelleri',
      tasks_count: 20,
      duration: '3 hafta (18-20 saat)',
      learning_objectives: ['JWT', 'Kullanıcı oturumu', 'Güvenlik temelleri']
    },
    {
      title: 'Aşama 6 – Yayınlama (Deployment)',
      description: 'Öğrenilecekler: Bulutta yayınlama (Heroku, AWS), versiyon kontrol (Git)',
      tasks_count: 15,
      duration: '3 hafta (15 saat)',
      learning_objectives: ['Bulutta yayınlama (Heroku, AWS)', 'Versiyon kontrol (Git)']
    },
    {
      title: 'Aşama 7 – Bitirme Projesi',
      description: 'Öğrenilecekler: Sıfırdan backend projesi yapmak',
      tasks_count: 15,
      duration: '2 hafta (12-15 saat)',
      learning_objectives: ['Sıfırdan backend projesi yapmak']
    }
  ]
};

export const roadmapService = {
  // Get user's personal roadmap
  getPersonalRoadmap: async (): Promise<UserRoadmap | null> => {
    try {
      console.log('Kişisel roadmap isteği yapılıyor...');
      const response = await apiService.get<UserRoadmap>('/roadmaps/personal');
      console.log('API yanıtı alındı:', response);
      
      // Yanıtın yapısını kontrol et
      if (response.data) {
        console.log('Roadmap verileri:', {
          id: response.data.id,
          user_id: response.data.user_id,
          career_path_id: response.data.career_path_id,
          steps_count: response.data.steps?.length || 0,
          career_path_exists: !!response.data.career_path,
          recommended_start_index: response.data.recommended_start_index
        });
        
        // Steps dizisini kontrol et
        if (!response.data.steps || response.data.steps.length === 0) {
          console.warn('Roadmap steps dizisi boş veya tanımsız!');
        } else {
          console.log('Roadmap steps örnek:', response.data.steps[0]);
        }
        
        // Career path kontrolü
        if (!response.data.career_path) {
          console.warn('Roadmap career_path nesnesi eksik!');
        }
        
        return response.data;
      } else {
        console.warn('API 200 döndü ama veri yok!');
        return null;
      }
    } catch (error) {
      console.error('Kişisel roadmap alma hatası:', error);
      throw error;
    }
  },

  // Create a new roadmap based on career path and knowledge test results
  createRoadmap: async (careerPathId: string): Promise<UserRoadmap | null> => {
    try {
      const response = await apiService.post<UserRoadmap>('/roadmaps/create', { career_path_id: careerPathId });
      return response.data || null;
    } catch (error) {
      console.error('Error creating roadmap:', error);
      throw error;
    }
  },

  // Get recent activities (this would need a new backend endpoint)
  getRecentActivities: async (limit: number = 5): Promise<RecentActivity[]> => {
    try {
      const response = await apiService.get<RecentActivity[]>(`/users/activities?limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Return mock data as fallback for now
      return [
        {
          id: '1',
          type: 'course_completed',
          title: 'React Temelleri',
          description: 'kursunu tamamladınız. Tebrikler!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          icon_type: 'success'
        },
        {
          id: '2',
          type: 'step_completed',
          title: 'JavaScript Fundamentals',
          description: 'adımını tamamladınız.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          icon_type: 'progress'
        },
        {
          id: '3',
          type: 'test_taken',
          title: 'Kişilik Testi',
          description: 'testini tamamladınız.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          icon_type: 'info'
        }
      ];
    }
  },

  // Get upcoming deadlines from roadmap steps
  getUpcomingDeadlines: async (): Promise<Array<{
    id: string;
    title: string;
    date: string;
    progress: number;
    type: 'course' | 'step';
  }>> => {
    try {
      const roadmap = await roadmapService.getPersonalRoadmap();
      if (!roadmap) return [];

      // Convert roadmap steps to deadline format
      const upcomingSteps = roadmap.steps
        .filter(step => step.status !== 'completed')
        .slice(0, 3) // Get first 3 upcoming steps
        .map((step, index) => ({
          id: step.id,
          title: step.title,
          date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          progress: step.status === 'in_progress' ? Math.floor(Math.random() * 80) + 10 : 0,
          type: 'step' as const
        }));

      return upcomingSteps;
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
      return [];
    }
  },

  // Update roadmap step status
  updateStepStatus: async (stepId: string, status: 'not_started' | 'in_progress' | 'completed'): Promise<boolean> => {
    try {
      await apiService.patch(`/roadmap-steps/${stepId}/status`, { status });
      return true;
    } catch (error) {
      console.error('Error updating step status:', error);
      return false;
    }
  },

  // Get available career paths
  getCareerPaths: async (): Promise<CareerPath[]> => {
    try {
      const response = await apiService.get<CareerPath[]>('/career-paths/');
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Kariyer alanları alınırken hata:', error);
      return [];
    }
  },

  // Get user's recommended career path based on personality and knowledge tests
  getUserRecommendedCareerPath: async (): Promise<{ careerPath: CareerPath | null; knowledgeLevel: string }> => {
    // Varsayılan değerler
    let personalityResult: string | null = null;
    let skillLevel = 'başlangıç'; // Varsayılan bilgi seviyesi
    let recommendedCareerPath: CareerPath | null = null;
    let careerPaths: CareerPath[] = [];
    
    try {
      // 1. Kişilik testi sonucunu al
      try {
        const personalityResponse = await apiService.get<PersonalityTestResponse>('/personality-test/result');
        personalityResult = personalityResponse.data?.personality_result || null;
        console.log('Kişilik testi sonucu:', personalityResult);
      } catch (personalityError) {
        console.error('Kişilik testi sonucu alınamadı:', personalityError);
        // Kişilik testi sonucu alınamadıysa devam et
      }
      
      // 2. Kariyer alanlarını al
      try {
        const careerPathsResponse = await roadmapService.getCareerPaths();
        careerPaths = careerPathsResponse || [];
        console.log('Kariyer alanları:', careerPaths);
      } catch (careerPathsError) {
        console.error('Kariyer alanları alınamadı:', careerPathsError);
        // Varsayılan kariyer alanları oluştur
        careerPaths = [
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
      }
      
      // 3. Bilgi testi sonucunu almaya çalış
      if (personalityResult) {
        try {
          // Önce tüm bilgi testlerini al
          const testsResponse = await apiService.get<any[]>('/knowledge-tests/');
          const tests = testsResponse.data || [];
          console.log('Mevcut bilgi testleri:', tests);
          
          // Kişilik sonucuna uygun test ID'sini bul
          let matchingTestId: string | null = null;
          
          for (const test of tests) {
            if (test.title && personalityResult && 
                test.title.toLowerCase().includes(personalityResult.toLowerCase())) {
              matchingTestId = test.id;
              break;
            }
          }
          
          // Eğer uygun test bulunduysa, sonucunu almaya çalış
          if (matchingTestId) {
            try {
              const knowledgeResponse = await apiService.get<KnowledgeTestResponse>(`/knowledge-tests/${matchingTestId}/result`);
              skillLevel = knowledgeResponse.data?.skill_level || 'başlangıç';
              console.log(`Test ${matchingTestId} sonucu:`, skillLevel);
            } catch (testResultError) {
              console.warn(`Test ${matchingTestId} sonucu bulunamadı:`, testResultError);
              // Test sonucu yoksa varsayılan seviye kullanıldı
            }
          } else {
            console.warn('Kişilik sonucuna uygun test bulunamadı');
          }
        } catch (testsError) {
          console.error('Bilgi testleri alınamadı:', testsError);
          // Bilgi testleri alınamadıysa varsayılan seviye kullanıldı
        }
      }
      
      // 4. Kişilik testine göre önerilen kariyer alanını bul
      if (personalityResult && careerPaths.length > 0) {
        // Kesin eşleştirme için doğrudan mapping
        const directMapping: Record<string, string> = {
          'UI/UX Designer': 'UX Tasarımı',
          'Backend Developer': 'Backend Geliştirme',
          'Data Science': 'Veri Analizi',
          'Project Management': 'Proje Yönetimi'
        };
        
        // Önce doğrudan eşleştirmeyi dene
        if (personalityResult in directMapping) {
          const targetTitle = directMapping[personalityResult];
          const matchedPath = careerPaths.find(path => 
            path.title && path.title.includes(targetTitle)
          );
          
          if (matchedPath) {
            recommendedCareerPath = matchedPath;
            console.log(`Doğrudan eşleştirme: "${personalityResult}" için "${matchedPath.title}" kariyer alanı eşleşti`);
          }
        }
        
        // Doğrudan eşleştirme başarısız olursa, alternatif eşleştirme yöntemlerini dene
        if (!recommendedCareerPath) {
          // Kişilik testi sonuçlarını kariyer alanlarıyla eşleştirme haritası
          const careerMapping: Record<string, string[]> = {
            'UI/UX Designer': ['UX Tasarımı', 'UI Tasarımı', 'UX/UI'],
            'Backend Developer': ['Backend Geliştirme', 'Backend', 'Backend Developer'],
            'Data Science': ['Veri Analizi', 'Data Science', 'Veri Bilimi'],
            'Project Management': ['Proje Yönetimi', 'Project Management']
          };

          // Normalize edilmiş kişilik sonucu
          const normalizedPersonalityResult = personalityResult.toLowerCase().trim();
          
          // Önce tam eşleşme kontrolü
          for (const [testResult, careerTitles] of Object.entries(careerMapping)) {
            if (normalizedPersonalityResult.includes(testResult.toLowerCase()) || 
                testResult.toLowerCase().includes(normalizedPersonalityResult)) {
              // Eşleşen kariyer alanını bul
              for (const path of careerPaths) {
                if (!path.title) continue;
                
                const normalizedPathTitle = path.title.toLowerCase().trim();
                
                // Kariyer başlıklarından herhangi biriyle eşleşiyor mu kontrol et
                for (const careerTitle of careerTitles) {
                  if (normalizedPathTitle.includes(careerTitle.toLowerCase())) {
                    recommendedCareerPath = path;
                    console.log(`Kişilik sonucu "${personalityResult}" için "${path.title}" kariyer alanı eşleşti`);
                    break;
                  }
                }
                
                if (recommendedCareerPath) break;
              }
            }
            
            if (recommendedCareerPath) break;
          }
        }
        
        // Hala eşleşme bulunamadıysa, basit eşleştirme dene
        if (!recommendedCareerPath) {
          console.log('Kariyer eşleştirme haritasında eşleşme bulunamadı, basit eşleştirme deneniyor');
          for (const path of careerPaths) {
            if (!path.title) continue;
            
            const normalizedPathTitle = path.title.toLowerCase().trim();
            const normalizedPersonalityResult = personalityResult.toLowerCase().trim();
            
            // Basit eşleşme kontrolü
            if (normalizedPathTitle.includes(normalizedPersonalityResult) || 
                normalizedPersonalityResult.includes(normalizedPathTitle)) {
              recommendedCareerPath = path;
              console.log(`Basit eşleştirme: "${personalityResult}" için "${path.title}" kariyer alanı eşleşti`);
              break;
            }
          }
        }
      }
      
      // 5. Eşleşme bulunamadıysa, varsayılan olarak ilk kariyer alanını seç
      if (!recommendedCareerPath && careerPaths.length > 0) {
        // Özel durum: "Project Management" için özel kontrol
        const projectManagementPath = careerPaths.find(path => 
          path.title && path.title.toLowerCase().includes('proje yönetimi')
        );
        
        if (personalityResult && personalityResult.toLowerCase().includes('project management') && projectManagementPath) {
          recommendedCareerPath = projectManagementPath;
          console.log('Özel durum: Project Management için Proje Yönetimi kariyer alanı seçildi');
        } else {
          recommendedCareerPath = careerPaths[0];
          console.log('Eşleşme bulunamadı, ilk kariyer alanı seçildi:', careerPaths[0].title);
        }
      }
      
      console.log('SONUÇ - Önerilen kariyer alanı:', recommendedCareerPath);
      console.log('SONUÇ - Önerilen bilgi seviyesi:', skillLevel);
      
      return {
        careerPath: recommendedCareerPath,
        knowledgeLevel: skillLevel
      };
    } catch (error) {
      console.error('Önerilen kariyer alanı alma genel hatası:', error);
      
      // Hata durumunda bile bir sonuç döndür
      if (careerPaths.length > 0) {
        // Özel durum: "Project Management" için özel kontrol
        const projectManagementPath = careerPaths.find(path => 
          path.title && path.title.toLowerCase().includes('proje yönetimi')
        );
        
        if (personalityResult && personalityResult.toLowerCase().includes('project management') && projectManagementPath) {
          return {
            careerPath: projectManagementPath,
            knowledgeLevel: 'başlangıç'
          };
        }
        
        return {
          careerPath: careerPaths[0],
          knowledgeLevel: 'başlangıç'
        };
      }
      
      // Hiçbir şekilde kariyer alanı bulunamadıysa varsayılan bir tane oluştur
      const defaultCareerPath: CareerPath = {
        id: 'default-path',
        title: 'Backend Geliştirme',
        description: 'Backend geliştirme kariyeri için yol haritası',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return {
        careerPath: defaultCareerPath,
        knowledgeLevel: 'başlangıç'
      };
    }
  },

  // Bilgi seviyesine göre başlangıç aşaması belirleme
  getStartingStageIndex: (knowledgeLevel: string | null): number => {
    if (!knowledgeLevel) return 0;
    switch (knowledgeLevel.toLowerCase()) {
      case 'başlangıç':
        return 0; // 1. aşamadan başla (0-indexed)
      case 'orta':
        return 2; // 3. aşamadan başla (0-indexed)
      case 'ileri':
        return 4; // 5. aşamadan başla (0-indexed)
      default:
        return 0; // Varsayılan olarak 1. aşamadan başla
    }
  },

  // Gemini AI ile roadmap oluşturma
  createRoadmapWithGemini: async (careerPathId: string, knowledgeLevel: string): Promise<UserRoadmap> => {
    try {
      // Kariyer alanını al
      const careerPaths = await roadmapService.getCareerPaths();
      const selectedCareerPath = careerPaths.find(path => path.id === careerPathId);
      
      if (!selectedCareerPath) {
        throw new Error('Kariyer alanı bulunamadı');
      }
      
      let careerPathTitle = selectedCareerPath.title;
      
      // İngilizce-Türkçe kariyer yolu başlığı eşleştirmesi
      const careerPathMapping: Record<string, string> = {
        'Project Management': 'Proje Yönetimi',
        'UI/UX Design': 'UX Tasarımı',
        'Backend Development': 'Backend Geliştirme',
        'Data Science': 'Veri Bilimi'
      };
      
      // Eğer İngilizce başlık varsa Türkçe karşılığını kullan
      if (careerPathMapping[careerPathTitle]) {
        careerPathTitle = careerPathMapping[careerPathTitle];
        console.log(`Kariyer yolu başlığı çevrildi: ${selectedCareerPath.title} -> ${careerPathTitle}`);
      }
      
      // Şablonu seç
      const template = ROADMAP_TEMPLATES[careerPathTitle as keyof typeof ROADMAP_TEMPLATES];
      
      if (!template || template.length === 0) {
        console.error(`${careerPathTitle} için şablon bulunamadı. Mevcut şablonlar:`, Object.keys(ROADMAP_TEMPLATES));
        throw new Error(`${careerPathTitle} için şablon bulunamadı`);
      }
      
      // Başlangıç aşamasını belirle
      const startingIndex = roadmapService.getStartingStageIndex(knowledgeLevel || 'başlangıç');
      
      // Roadmap adımlarını oluştur
      const steps = template.map((stage, index) => {
        const isCompleted = false; // Başlangıçta hiçbir aşama tamamlanmamış
        // Başlangıç aşaması kontrolü (kullanılmayan değişkeni kaldırdık)
        const status = isCompleted ? 'completed' : (index < startingIndex ? 'locked' : 'available');
        
        return {
          id: `step-${index + 1}`,
          roadmap_id: '', // API tarafından doldurulacak
          title: stage.title,
          description: stage.description,
          order: index,
          status: status as RoadmapStep['status'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tasks_count: stage.tasks_count,
          duration: stage.duration,
          learning_objectives: stage.learning_objectives,
          course_link: `/courses?stage=${index + 1}&career=${encodeURIComponent(careerPathTitle)}`
        };
      });
      
      // Gemini AI ile kişiselleştirilmiş roadmap oluşturma
      // Not: Gerçek Gemini API entegrasyonu burada yapılacak
      // Şimdilik şablonu doğrudan kullanıyoruz
      
      // API'ye gönderilecek roadmap
      const roadmapData = {
        career_path_id: careerPathId,
        knowledge_level: knowledgeLevel,
        steps: steps,
        // Kullanıcı bilgileri ve test sonuçları ile ilişkilendirme
        personality_test_result: true, // Kişilik testi sonuçlarını kullan
        knowledge_test_result: true,   // Bilgi testi sonuçlarını kullan
        save_to_database: true         // Veritabanına kaydet
      };
      
      // Roadmap'i API'ye gönder ve oluştur
      // Bu endpoint roadmap_steps tablosuna tüm adımları kaydedecek
      try {
        console.log('API isteği gönderiliyor:', roadmapData);
        const response = await apiService.post<{id: string; steps: RoadmapStep[]}>('/roadmaps/create', roadmapData);
        console.log('API yanıtı:', response);
        
        if (!response.data) {
          console.error('API yanıtında data yok');
          throw new Error('Roadmap oluşturulamadı: API yanıtında data yok');
        }
        
        // Oluşturulan roadmap'i döndür - API'den dönen adımları kullan
        return {
          id: response.data?.id || 'temp-id', // response.data undefined olabilir kontrolü
          user_id: '', // API'den gelecek
          career_path_id: careerPathId,
          created_date: new Date().toISOString(),
          completion_percentage: 0, // Yeni oluşturulduğu için tamamlanma yüzdesi 0
          career_path: selectedCareerPath,
          steps: response.data?.steps || steps, // API'den dönen adımları kullan, yoksa yerel adımları kullan
          recommended_start_index: startingIndex
        };
      } catch (apiError) {
        console.error('API hatası:', apiError);
        
        // API hatası durumunda yerel şablonu kullan
        console.log('API hatası nedeniyle yerel şablon kullanılıyor');
        
        // Yerel roadmap oluştur
        const localRoadmap: UserRoadmap = {
          id: 'local-' + new Date().getTime(),
          user_id: '',
          career_path_id: careerPathId,
          created_date: new Date().toISOString(),
          completion_percentage: 0,
          career_path: selectedCareerPath,
          steps: steps,
          recommended_start_index: startingIndex
        };
        
        return localRoadmap;
      }
    } catch (error) {
      console.error('Roadmap oluşturma hatası:', error);
      throw error;
    }
  },

  // Bilgi seviyesine göre roadmap oluşturma (farklı isimle)
  createRoadmapWithKnowledge: async (careerPathId: string, knowledgeLevel?: string): Promise<UserRoadmap> => {
    try {
      // Varsayılan bilgi seviyesi
      const level = knowledgeLevel || 'başlangıç';
      console.log(`Roadmap oluşturuluyor: Kariyer=${careerPathId}, Seviye=${level}`);
      
      // Gemini AI ile roadmap oluştur
      return await roadmapService.createRoadmapWithGemini(careerPathId, level);
    } catch (error) {
      console.error('Roadmap oluşturma hatası:', error);
      throw error;
    }
  }
};
