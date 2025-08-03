import { type ReactNode } from 'react';

export interface Resource {
  name: string;
  link: string;
  desc: string;
}

export interface Stage {
  details: {
    'Öğrenilecekler': string;
    'Görev sayısı': string;
    'Süre': string;
  };
  resources: Resource[];
}

export interface Course {
  color: string;
  icon: ReactNode;
  description: string;
  stages: Record<string, Stage>;
}

export const coursesData: Record<string, Course> = {
  'UX Tasarımı': {
    color: 'var(--ux-color)',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#a78bfa" viewBox="0 0 256 256"><path d="M240,98a58,58,0,0,1-58,58H150.94l28.39,28.38a18,18,0,0,1,0,25.46,18.12,18.12,0,0,1-12.73,5.28,17.8,17.8,0,0,1-12.72-5.28L125.2,185.2a17.8,17.8,0,0,1-5.2-12.72V156H74a58,58,0,0,1,0-116h47.28a18,18,0,0,1,12.72,5.28L162.67,73.94a18,18,0,0,1,0,25.46,18.12,18.12,0,0,1-12.73,5.28,17.8,17.8,0,0,1-12.72-5.28L110.72,73H74a22,22,0,0,0,0,44h51.28a18,18,0,0,1,12.72,5.28L166.67,151A18,18,0,0,1,182,156h0a22,22,0,0,0,22-22,22.12,22.12,0,0,0-3.6-11.89A57.8,57.8,0,0,1,240,98Z"></path></svg>,
    description: 'Kullanıcıların seveceği, sezgisel ve etkili dijital ürünler tasarlamayı öğrenin.',
    stages: {
      '1. Aşama – UX Tasarımına Giriş': {
        details: { 'Öğrenilecekler': 'UX nedir, kullanıcı odaklı tasarım', 'Görev sayısı': '20', 'Süre': '3 hafta (15-18 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Foundations of User Experience Design', link: 'https://www.coursera.org/learn/foundations-user-experience-design?specialization=google-ux-design', desc: 'Google UX Design Sertifika Programının ilk kursu.' }]
      },
      '2. Aşama – UX Tasarım Sürecine Başlamak': {
        details: { 'Öğrenilecekler': 'Empati haritaları, kullanıcı hikâyeleri, problem tanımı', 'Görev sayısı': '25', 'Süre': '3 hafta (18-20 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Start the UX Design Process', link: 'https://www.coursera.org/learn/start-ux-design-process?specialization=google-ux-design', desc: 'Empati kurma, persona oluşturma ve problem tanımlama.' }]
      },
      '3. Aşama – Wireframe ve Düşük Detaylı Prototip': {
        details: { 'Öğrenilecekler': 'Basit çizimler, temel prototipler', 'Görev sayısı': '20', 'Süre': '3 hafta (15-18 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Wireframes and Low-Fidelity Prototypes', link: 'https://www.coursera.org/learn/wireframes-low-fidelity-prototypes?specialization=google-ux-design', desc: 'Fikirleri görselleştirmek için wireframe ve prototip oluşturma.' }]
      },
      '4. Aşama – Araştırma ve Test': {
        details: { 'Öğrenilecekler': 'Kullanıcı araştırması, test yapmak, geri bildirim', 'Görev sayısı': '25', 'Süre': '4 hafta (20-22 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Conduct UX Research and Test Early Concepts', link: 'https://www.coursera.org/learn/conduct-ux-research?specialization=google-ux-design', desc: 'Kullanıcı araştırması yöntemleri ve kullanılabilirlik testleri.' }]
      },
      '5. Aşama – Figma ile Yüksek Detaylı Tasarım': {
        details: { 'Öğrenilecekler': 'Renk, tipografi, responsive tasarım', 'Görev sayısı': '25', 'Süre': '4 hafta (20-25 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Create High-Fidelity Designs and Prototypes in Figma', link: 'https://www.coursera.org/learn/high-fidelity-designs-prototype?specialization=google-ux-design', desc: 'Figma\'da görsel olarak çekici ve etkileşimli tasarımlar oluşturma.' }]
      },
      '6. Aşama – Dinamik Arayüz Oluşturma': {
        details: { 'Öğrenilecekler': 'Basit HTML/CSS/JS, etkileşimli prototipler', 'Görev sayısı': '20', 'Süre': '3 hafta (18-20 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Responsive Web Design in Adobe XD', link: 'https://www.coursera.org/learn/responsive-web-design-adobe-xd?specialization=google-ux-design', desc: 'Farklı cihaz ekranlarına uyum sağlayan tasarımlar yapma.' }]
      },
      '7. Aşama – Bitirme Projesi': {
        details: { 'Öğrenilecekler': 'Sosyal fayda odaklı bir ürün tasarlama', 'Görev sayısı': '15', 'Süre': '2 hafta (10-12 saat)' },
        resources: [
          { name: 'Tavsiye (Coursera): Design a User Experience for Social Good & Prepare for Jobs', link: 'https://www.coursera.org/learn/ux-design-jobs?specialization=google-ux-design', desc: 'Portfolyo oluşturma ve iş aramaya hazırlık.' },
          { name: 'Tavsiye (Coursera): Accelerate Your Job Search with AI', link: 'https://www.coursera.org/learn/accelerate-your-job-search-with-ai?specialization=google-ux-design', desc: 'Yapay zeka araçlarıyla iş arama sürecini hızlandırma.' }
        ]
      }
    }
  },
  'Backend Geliştirme': {
    color: 'var(--backend-color)',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#4ade80" viewBox="0 0 256 256"><path d="M64,88a16,16,0,0,1,16-16H208a16,16,0,0,1,0,32H80A16,16,0,0,1,64,88Zm144,80H80a16,16,0,0,0,0,32H208a16,16,0,0,0,0-32ZM48,72A32,32,0,1,0,16,40,32,32,0,0,0,48,72Zm0,96a32,32,0,1,0-32-32A32,32,0,0,0,48,168Z"></path></svg>,
    description: 'Uygulamaların ve web sitelerinin arkasındaki güçlü motorları inşa edin.',
    stages: {
      '1. Aşama – Backend Temelleri': {
        details: { 'Öğrenilecekler': 'Sunucu-istemci mantığı, HTTP, REST API nedir', 'Görev sayısı': '20', 'Süre': '3 hafta (15-18 saat)' },
        resources: [
          { name: 'Video (Türkçe): \'Frontend ve Backend Nedir?\'', link: 'https://www.youtube.com/watch?v=0k1L2b_lI_8', desc: 'Temel kavramları ve işleyiş mantığını açıklayan bir video.' },
          { name: 'Video (İngilizce): \'HTTP Crash Course For Beginners\'', link: 'https://www.youtube.com/watch?v=iYM2zLvj2Qk', desc: 'HTTP protokolüne hızlı ve anlaşılır bir giriş.' }
        ]
      },
      '2. Aşama – Programlama Dili (Python veya Node.js)': {
        details: { 'Öğrenilecekler': 'Temel programlama, fonksiyonlar, modüller', 'Görev sayısı': '30', 'Süre': '4 hafta (25 saat)' },
        resources: [
          { name: 'Video (Türkçe): \'Sıfırdan Python Dersleri (Tüm Seri)\'', link: 'https://www.youtube.com/watch?v=VlXk-HlQf2o', desc: 'Python\'a yeni başlayanlar için kapsamlı bir seri.' },
          { name: 'Video (İngilizce): \'Node.js Full Course for Beginners\'', link: 'https://www.youtube.com/watch?v=Oe42zCqf8gI', desc: 'freeCodeCamp\'in kapsamlı Node.js kursu.' }
        ]
      },
      '3. Aşama – Veritabanları': {
        details: { 'Öğrenilecekler': 'SQL, CRUD işlemleri, NoSQL farkları', 'Görev sayısı': '25', 'Süre': '4 hafta (20-25 saat)' },
        resources: [
          { name: 'Video (Türkçe): \'SQL Dersleri - Veritabanı Yönetim Sistemleri\'', link: 'https://www.youtube.com/watch?v=H0l5B2nK1iA', desc: 'SQL\'e giriş ve temel komutları içeren bir ders.' },
          { name: 'Video (İngilizce): \'SQL Full Course - Learn SQL in 4 Hours\'', link: 'https://www.youtube.com/watch?v=f2nN_9w8j8s', desc: 'freeCodeCamp\'in kapsamlı SQL kursu.' }
        ]
      },
      '4. Aşama – Framework Kullanımı': {
        details: { 'Öğrenilecekler': 'Django/Flask veya Express.js ile API geliştirme', 'Görev sayısı': '30', 'Süre': '4 hafta (25 saat)' },
        resources: [
          { name: 'Video (Türkçe): \'Django ile Web Geliştirme (Seri)\'', link: 'https://www.youtube.com/watch?v=0h1b0n5d5L0', desc: 'Django ile başlangıç seviyesi web geliştirme.' },
          { name: 'Video (İngilizce): \'Express.js Crash Course\'', link: 'https://www.youtube.com/watch?v=L72fhGm1tfE', desc: 'Express.js\'ye hızlı bir giriş.' }
        ]
      },
      '5. Aşama – Kimlik Doğrulama ve Güvenlik': {
        details: { 'Öğrenilecekler': 'JWT, kullanıcı oturumu, güvenlik temelleri', 'Görev sayısı': '20', 'Süre': '3 hafta (18-20 saat)' },
        resources: [
          { name: 'Video (Türkçe): \'JWT Nedir? Nasıl Çalışır?\'', link: 'https://www.youtube.com/watch?v=tF6f1g5M_4g', desc: 'JWT kavramını ve güvenlik konularını açıklıyor.' },
          { name: 'Okuma Kaynağı (İngilizce): \'OWASP Top 10\'', link: 'https://owasp.org/www-project-top-ten/', desc: 'En yaygın web güvenlik risklerini içeren resmi liste.' }
        ]
      },
      '6. Aşama – Yayınlama (Deployment)': {
        details: { 'Öğrenilecekler': 'Bulutta yayınlama (Heroku, AWS), Git', 'Görev sayısı': '15', 'Süre': '3 hafta (15 saat)' },
        resources: [
          { name: 'Video (Türkçe): \'Git ve GitHub Dersleri (Tüm Seri)\'', link: 'https://www.youtube.com/watch?v=0h1b0n5d5L0', desc: 'Git ve GitHub\'a kapsamlı bir giriş.' },
          { name: 'Video (İngilizce): \'Deploying a Django App to Heroku\'', link: 'https://www.youtube.com/watch?v=d_kXw-z-3fM', desc: 'Django uygulamasını Heroku\'ya dağıtma adımları.' }
        ]
      },
      '7. Aşama – Bitirme Projesi': {
        details: { 'Öğrenilecekler': 'Sıfırdan backend projesi yapmak', 'Görev sayısı': '15', 'Süre': '2 hafta (12-15 saat)' },
        resources: [
          { name: 'Video (İngilizce): \'Build a REST API with Python & Django\'', link: 'https://www.youtube.com/watch?v=drGzV13o_8Q', desc: 'Django REST Framework ile bir API projesi yapımı.' },
          { name: 'Okuma Kaynağı (İngilizce): \'Awesome Project Ideas\'', link: 'https://github.com/florinpop17/app-ideas', desc: 'Farklı zorluk seviyelerinde proje fikirleri sunan bir repo.' }
        ]
      }
    }
  },
  'Veri Analizi': {
    color: 'var(--data-color)',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#60a5fa" viewBox="0 0 256 256"><path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-6.4-12.8l72-96a8,8,0,0,1,12.8,0l40,53.33,46.4-34.8a8,8,0,0,1,12.8,9.6l-56,42a8,8,0,0,1-9.6,0L96,115.33,40.8,192H224A8,8,0,0,1,232,208Z"></path></svg>,
    description: 'Verilerden anlamlı içgörüler çıkararak geleceğe yönelik kararlar alın.',
    stages: {
      '1. Aşama – Veri Bilimine Giriş': {
        details: { 'Öğrenilecekler': 'Veri toplama, temizleme, analiz süreci', 'Görev sayısı': '25', 'Süre': '3 hafta (18-20 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Foundations of Data Science', link: 'https://www.coursera.org/learn/foundations-of-data-science?specialization=google-advanced-data-analytics', desc: 'Veri bilimi temelleri ve veri analizi yaşam döngüsü.' }]
      },
      '2. Aşama – Python’a Başlangıç': {
        details: { 'Öğrenilecekler': 'Python temelleri, veri yapıları, pandas', 'Görev sayısı': '30', 'Süre': '4 hafta (25 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Get Started with Python', link: 'https://www.coursera.org/learn/get-started-with-python?specialization=google-advanced-data-analytics', desc: 'Veri analizi için Python programlamaya giriş.' }]
      },
      '3. Aşama – Sayıların Ötesine Geçmek': {
        details: { 'Öğrenilecekler': 'Veriyi hikâyeye dönüştürme, yorumlama', 'Görev sayısı': '20', 'Süre': '3 hafta (15-18 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Go Beyond the Numbers', link: 'https://www.coursera.org/learn/go-beyond-the-numbers-translate-data-into-insight?specialization=google-advanced-data-analytics', desc: 'Veri görselleştirme ve etkili sunum teknikleri.' }]
      },
      '4. Aşama – İstatistiğin Gücü': {
        details: { 'Öğrenilecekler': 'Temel istatistik, olasılık, hipotez testleri', 'Görev sayısı': '25', 'Süre': '4 hafta (20-25 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): The Power of Statistics', link: 'https://www.coursera.org/learn/the-power-of-statistics?specialization=google-advanced-data-analytics', desc: 'İstatistiksel analiz ve hipotez testleri.' }]
      },
      '5. Aşama – Regresyon Analizi': {
        details: { 'Öğrenilecekler': 'Doğrusal regresyon, çoklu regresyon', 'Görev sayısı': '20', 'Süre': '3 hafta (18-20 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Regression Analysis', link: 'https://www.coursera.org/learn/regression-analysis-simplify-complex-data-relationships?specialization=google-advanced-data-analytics', desc: 'Regresyon modelleri oluşturma ve yorumlama.' }]
      },
      '6. Aşama – Makine Öğrenmesine Giriş': {
        details: { 'Öğrenilecekler': 'Temel algoritmalar, model kurma', 'Görev sayısı': '25', 'Süre': '4 hafta (22-25 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): The Nuts and Bolts of Machine Learning', link: 'https://www.coursera.org/learn/the-nuts-and-bolts-of-machine-learning?specialization=google-advanced-data-analytics', desc: 'Makine öğrenmesi algoritmaları ve modelleme.' }]
      },
      '7. Aşama – Bitirme Projesi': {
        details: { 'Öğrenilecekler': 'Gerçek veri ile sıfırdan analiz projesi', 'Görev sayısı': '15', 'Süre': '2 hafta (10-12 saat)' },
        resources: [
          { name: 'Tavsiye (Coursera): Google Advanced Data Analytics Capstone', link: 'https://www.coursera.org/learn/google-advanced-data-analytics-capstone?specialization=google-advanced-data-analytics', desc: 'Kapsamlı bir veri analizi projesi.' },
          { name: 'Tavsiye (Coursera): Accelerate Your Job Search with AI', link: 'https://www.coursera.org/learn/accelerate-your-job-search-with-ai?specialization=google-advanced-data-analytics', desc: 'Yapay zeka ile iş arama sürecini optimize etme.' }
        ]
      }
    }
  },
  'Proje Yönetimi': {
    color: 'var(--pm-color)',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#facc15" viewBox="0 0 256 256"><path d="M224,64a8,8,0,0,0-8-8H184V48a16,16,0,0,0-16-16H88A16,16,0,0,0,72,48v8H40a8,8,0,0,0,0,16H72V88H40a8,8,0,0,0,0,16H72v8H40a8,8,0,0,0,0,16H72v8H40a8,8,0,0,0,0,16H72v8a16,16,0,0,0,16,16h80a16,16,0,0,0,16-16v-8h24a8,8,0,0,0,0-16H184v-8h40a8,8,0,0,0,0-16H184v-8h40a8,8,0,0,0,0-16H184V88h40A8,8,0,0,0,224,64ZM88,160H168v8a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8Zm80-64v48H88V96h80ZM88,80V64a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8V80Z"></path></svg>,
    description: 'Projeleri zamanında, bütçe dahilinde ve başarıyla tamamlamanın sırlarını keşfedin.',
    stages: {
      '1. Aşama – Proje Yönetiminin Temelleri': {
        details: { 'Öğrenilecekler': 'Proje nedir, yaşam döngüsü, paydaşlar', 'Görev sayısı': '25', 'Süre': '3 hafta (yaklaşık 18 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Project Management Foundations', link: 'https://www.coursera.org/learn/project-management-foundations', desc: 'Proje yönetimi terminolojisi ve temel kavramlar.' }]
      },
      '2. Aşama – Proje Başlatma': {
        details: { 'Öğrenilecekler': 'Proje hedefi yazma, kapsam belgesi', 'Görev sayısı': '20', 'Süre': '3 hafta (15-18 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Project Initiation', link: 'https://www.coursera.org/learn/project-initiation-google', desc: 'Bir projenin başarılı bir şekilde başlatılması.' }]
      },
      '3. Aşama – Proje Planlama': {
        details: { 'Öğrenilecekler': 'Zaman çizelgesi, bütçe, risk yönetimi', 'Görev sayısı': '25', 'Süre': '4 hafta (20-25 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Project Planning', link: 'https://www.coursera.org/learn/project-planning-google', desc: 'Kapsamlı proje planları oluşturma.' }]
      },
      '4. Aşama – Projeyi Yürütme': {
        details: { 'Öğrenilecekler': 'Takip etme, ilerleme raporları, kalite', 'Görev sayısı': '20', 'Süre': '3 hafta (15-18 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Project Execution', link: 'https://www.coursera.org/learn/project-execution-google?specialization=google-project-management', desc: 'Proje sürecini yönetme ve paydaşlarla iletişim.' }]
      },
      '5. Aşama – Çevik (Agile) Proje Yönetimi': {
        details: { 'Öğrenilecekler': 'Agile yaklaşımı, Scrum, sprint planlama', 'Görev sayısı': '25', 'Süre': '4 hafta (20 saat)' },
        resources: [{ name: 'Birincil Tavsiye (Coursera): Agile Project Management', link: 'https://www.coursera.org/learn/agile-project-management?specialization=google-project-management', desc: 'Scrum ve Agile metodolojilerine giriş.' }]
      },
      '6. Aşama – Bitirme Projesi (Capstone)': {
        details: { 'Öğrenilecekler': 'Gerçek senaryoya dayalı proje planı', 'Görev sayısı': '15', 'Süre': '2 hafta (10-12 saat)' },
        resources: [
          { name: 'Tavsiye (Coursera): Applying Project Management in the Real World', link: 'https://www.coursera.org/learn/applying-project-management?specialization=google-project-management', desc: 'Öğrenilen bilgileri gerçek dünya senaryolarında uygulama.' },
          { name: 'Tavsiye (Coursera): Accelerate Your Job Search with AI', link: 'https://www.coursera.org/learn/accelerate-your-job-search-with-ai?specialization=google-project-management', desc: 'İş arama sürecinizi yapay zeka ile güçlendirin.' }
        ]
      }
    }
  }
};
