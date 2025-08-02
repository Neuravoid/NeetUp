import React, { useState, useMemo } from 'react';

// --- DATA ---
// We store all job data here. In a real application, this would likely come from an API.
const jobData = {
  "PROJE YÖNETİMİ": [
    {
      id: 'pm1',
      title: 'Senior Proje Yöneticisi – Finans & Teknoloji',
      company: 'Migros Ticaret',
      responsibilities: [
        'Perakende ve teknoloji projelerinde kapsam, maliyet ve zaman çizelgesi yönetimi.',
        'Ekip koordinasyonu ve paydaş iletişimi.',
        'Proje kaynaklarını optimize etme, risk ve fırsat analizleri.'
      ],
      qualifications: [
        'Bilgisayar Mühendisliği ya da ilgili bölümlerden mezun.',
        'PMP ya da PRINCE II sertifikası tercih edilir.',
        'MS Project, Jira, Trello gibi araçlarda deneyim.'
      ],
      benefits: [
        'Büyük ölçekli proje tecrübesi.',
        'KPI bazlı performans sistemi.'
      ],
      tags: ['#ProjeYönetimi', '#Finans', '#Teknoloji', '#PMP', '#Migros']
    },
    {
      id: 'pm2',
      title: 'Digital Proje Uzmanı – E-Ticaret',
      company: 'IKEA / Migros',
      responsibilities: [
        'Dijital kampanya ve ürün yönetimi projelerinin yürütülmesi.',
        'CTO ve ürün ekipleriyle koordinasyon.',
        'Zamanında teslimat ve kalite kontrol.'
      ],
      qualifications: [
        'Agile yaklaşımlarla çalışma deneyimi.',
        'İngilizce seviye en az B2.',
        'Analitik düşünme ve problem çözme becerisi.'
      ],
      benefits: [],
      tags: ['#DijitalPazarlama', '#E-ticaret', '#ProjeUzmanı', '#Agile', '#IKEA']
    },
    {
        id: 'pm3',
        title: 'PMO Yöneticisi – Kurumsal Holding',
        company: 'Özak Global Holding',
        responsibilities: [
            'PMO süreçlerinin oluşturulması ve projelerin izlemesi.',
            'Program ve proje raporlama, kaynak yönetimi.',
            'Paydaş ilişkileri yönetimi.'
        ],
        qualifications: [
            '5+ yıl proje yöneticiliği.',
            'Kurumsal projelerde tecrübe.',
            'PMP sertifikası avantaj sağlar.'
        ],
        benefits: [],
        tags: ['#PMO', '#ProjeYönetimi', '#Kurumsal', '#ÖzakGlobal', '#PMP']
    },
    {
        id: 'pm4',
        title: 'Program Yöneticisi – Finans Teknolojileri',
        company: 'Bileşim',
        responsibilities: [
            'Program kapsam ve hedeflerinin belirlenmesi.',
            'Analiz ve raporlama ekiplerinin koordinasyonu.',
            'Denetim ve kalite aksiyonlarının uygulanması.'
        ],
        qualifications: [
            'Finansal teknoloji projelerinde tecrübe.',
            'Güçlü liderlik ve planlama becerileri.'
        ],
        benefits: [],
        tags: ['#Fintech', '#ProgramYönetimi', '#FinansTeknolojileri', '#Liderlik', '#Bilişim']
    },
    {
        id: 'pm5',
        title: 'Proje Analiz Süreç Lideri',
        company: 'OPET',
        responsibilities: [
            'Analitik modelleme ve süreç iyileştirme projeleri.',
            'KPI takibi, raporlama ve ekip eğitimleri.',
            'Süreç tasarımı ve dönüşüm projeleri.'
        ],
        qualifications: [
            'Veri analitiği ve süreç tasarımında deneyim.',
            'İyi derecede dijital okuryazarlık (Excel, BI araçları).'
        ],
        benefits: [],
        tags: ['#ProjeAnalizi', '#SüreçGeliştirme', '#VeriAnalitiği', '#OPET', '#KPI']
    }
  ],
  "VERİ ANALİZİ": [
    {
      id: 'da1',
      title: 'Veri Bilimi Proje Stajyeri',
      company: 'Koç Finansman',
      responsibilities: [
        'Python tabanlı veri görselleştirme ve modelleme projelerine destek.',
        'Analitik süreçlerin hazırlanması ve raporlanması.'
      ],
      qualifications: [
        'Üniversitelerin matematik, istatistik, veri bilimi bölümlerinden öğrenci.',
        'Python, SQL bilgisi.'
      ],
      benefits: [],
      tags: ['#VeriBilimi', '#Staj', '#Python', '#SQL', '#Finans']
    },
    {
      id: 'da2',
      title: 'Analitik Model Proje & Koordinasyon Uzmanı',
      company: 'Yapı Kredi',
      responsibilities: [
        'Büyük veri analizi, model doğrulama ve sonuç raporlama.',
        'Birden fazla proje paydaşını koordinasyon içinde çalıştırma.'
      ],
      qualifications: [
        'Veri bilimi veya finans mühendisliği geçmişi.',
        'İyi derecede Power BI/Tableau tecrübesi.'
      ],
      benefits: [],
      tags: ['#VeriAnalizi', '#FinansMühendisliği', '#PowerBI', '#Tableau', '#YapıKredi']
    },
    {
        id: 'da3',
        title: 'Risk/Kredi Analiz Uzmanı',
        company: 'DenizBank',
        responsibilities: [
            'Kredi riski analizi, model geliştirme ve raporlama.',
            'Süreçlerin yürütülmesi ve iyileştirilmesi.'
        ],
        qualifications: [
            'Finansal analiz deneyimi.',
            'SQL, Python bilgisi.'
        ],
        benefits: [],
        tags: ['#RiskAnalizi', '#KrediAnalizi', '#Bankacılık', '#SQL', '#DenizBank']
    },
    {
        id: 'da4',
        title: 'Data Analiz Uzmanı',
        company: 'Kariyer.net ilanları',
        responsibilities: [
            'Kurumsal veriler üzerinden veri temizlik, görselleştirme ve rapor üretimi.',
            'Dashboard oluşturma (Power BI, Tableau vb.).'
        ],
        qualifications: [
            'Veri analizi deneyimi.',
            'İleri Excel ve SQL becerileri.'
        ],
        benefits: [],
        tags: ['#DataAnalizi', '#KurumsalVeri', '#Dashboard', '#Excel', '#KariyerNet']
    },
    {
        id: 'da5',
        title: 'Veribilim/Data Analiz Uzmanı – Bankacılık',
        company: 'Bankacılık Sektörü',
        responsibilities: [
            'Analitik veri projeleri, modelleme ve proje sonuç sunumları.',
            'Problem çözümüne yönelik veri odaklı stratejiler oluşturma.'
        ],
        qualifications: [
            'Finans ya da veri bilimi geçmişi.',
            'Güçlü analitik ve iletişim becerileri.'
        ],
        benefits: [],
        tags: ['#VeriBilimi', '#Bankacılık', '#VeriAnalizi', '#Analitik', '#Finans']
    }
  ],
  "UX TASARIMI": [
    {
      id: 'ux1',
      title: 'UX/UI Tasarımcı – Mobil Uygulama',
      company: 'Teknoloji Şirketi',
      responsibilities: [
        'Mobil uygulama wireframe ve prototype tasarımları.',
        'Kullanıcı testi ve geri bildirim analizleri.',
        'UI bileşenlerinin temel tasarımı.'
      ],
      qualifications: [
        'Figma, Sketch, Adobe XD deneyimi.',
        'Portföyyle başvuru, kullanıcı odaklı düşünme.'
      ],
      benefits: [],
      tags: ['#UXUI', '#MobilTasarım', '#Figma', '#Prototipleme', '#KullanıcıDeneyimi']
    },
    {
        id: 'ux2',
        title: 'UX Araştırmacısı – Kullanıcı Testleri',
        company: 'Araştırma & Geliştirme Firması',
        responsibilities: [
            'Anket, gözlem ve kullanılabilirlik testleri yürütme.',
            'Kullanıcı geri bildirim raporları hazırlama.'
        ],
        qualifications: [
            'Psikoloji veya araştırma tasarımı becerisi.',
            'UX araştırma metodolojilerine hakimiyet.'
        ],
        benefits: [],
        tags: ['#UXAraştırma', '#KullanıcıTestleri', '#Usability', '#Anket', '#Psikoloji']
    },
    {
        id: 'ux3',
        title: 'UI Tasarımcısı – Web Arayüzleri',
        company: 'Yazılım Evi',
        responsibilities: [
            'Web uygulaması arayüz tasarımları.',
            'Responsive tasarım ve kullanıcı senaryosu geliştirme.'
        ],
        qualifications: [
            'Figma/Sketch ile deneyim.',
            'HTML/CSS bilgisi tercih edilir.'
        ],
        benefits: [],
        tags: ['#UI', '#WebTasarım', '#ResponsiveDesign', '#Figma', '#HTMLCSS']
    },
    {
        id: 'ux4',
        title: 'UX Prototip & Test Uzmanı',
        company: 'Dijital Ajans',
        responsibilities: [
            'Prototip hazırlama ve kullanıcı test süreçlerini yönetme.',
            'A/B test sonuçlarını analiz etme.'
        ],
        qualifications: [
            'InVision, Axure deneyimli.',
            'Deneyimsel proje portföyü.'
        ],
        benefits: [],
        tags: ['#UXPrototip', '#KullanıcıTestleri', '#ABTesting', '#InVision', '#Axure']
    },
    {
        id: 'ux5',
        title: 'Ürün Deneyim Tasarım Uzmanı',
        company: 'E-ticaret Platformu',
        responsibilities: [
            'Kullanıcı personası ve journey map oluşturma.',
            'Prototip testleri ve tasarım optimizasyonu.'
        ],
        qualifications: [
            'UX stratejileri konusunda bilgi sahibi.',
            'Ekip ile koordineli çalışabilme.'
        ],
        benefits: [],
        tags: ['#ÜrünDeneyimi', '#UXStratejisi', '#Persona', '#JourneyMap', '#Tasarım']
    }
  ],
  "BACKEND GELİŞTİRME": [
    {
      id: 'be1',
      title: 'Senior Backend Developer – PHP/Laravel',
      company: 'Despatch Cloud / FreshDirect',
      responsibilities: [
        'PHP (Laravel/Symfony) ile mikro servis mimarileri geliştirme.',
        'RESTful API tasarımı, veri tabanı optimizasyonu (MySQL, PostgreSQL, MongoDB).',
        'Docker, CI/CD pipeline kullanımı.'
      ],
      qualifications: [
        'En az 5 yıl deneyim.',
        'JWT, OAuth gibi kimlik doğrulama sistemlerine hakim.',
        'AWS veya GCP bulut platformu deneyimi avantaj sağlar.'
      ],
      benefits: [],
      tags: ['#Backend', '#PHP', '#Laravel', '#MikroServis', '#API']
    },
    {
        id: 'be2',
        title: 'Backend Engineer – Node.js',
        company: 'Getir',
        responsibilities: [
            'Yüksek trafikli servisler geliştirme.',
            'REST API dizaynı ve güvenliği.',
            'Performans ve ölçeklenebilirlik için optimizasyon.'
        ],
        qualifications: [
            'Node.js, Express.js deneyimi.',
            'Git, Docker, CI/CD bilgisi.',
            'Takım içi iş birliğine yatkınlık.'
        ],
        benefits: [],
        tags: ['#NodeJS', '#BackendEngineer', '#RESTAPI', '#Getir', '#Ölçeklenebilirlik']
    },
    {
        id: 'be3',
        title: 'Backend Developer (Fintech) – Full Hybrid',
        company: 'qlub / Scorp',
        responsibilities: [
            'Fintech ürünleri için backend altyapılarının geliştirilmesi.',
            'Güvenli ödeme entegrasyonları, API tasarımı.',
            'Sürekli entegrasyon süreçlerinde aktif rol alma.'
        ],
        qualifications: [
            'Python/Django veya Java tecrübesi.',
            'Finansal sistemlerde çalışmış olmak tercih edilir.'
        ],
        benefits: [],
        tags: ['#Fintech', '#BackendDeveloper', '#Python', '#Java', '#API']
    },
    {
        id: 'be4',
        title: 'Mid‑Level Backend Developer – Freelance / Startup Projeleri',
        company: 'Freelance / Startup',
        responsibilities: [
            'REST API, veritabanı tasarımı (SQL/NoSQL).',
            'Kod entegrasyonu, sürüm kontrolü.',
            'Hızlı teslimatlar ve maliyet odaklı geliştirme.'
        ],
        qualifications: [
            'PHP, Node.js, Python tecrübesi.',
            'Docker ve bulut altyapı bilgisi.'
        ],
        benefits: [],
        tags: ['#Freelance', '#Startup', '#Backend', '#RESTAPI', '#Docker']
    },
    {
        id: 'be5',
        title: 'Backend Developer (İnteraktif / Mobil Uygulamalar)',
        company: 'Mobil Uygulama Stüdyosu',
        responsibilities: [
            'Mobil uygulama backend\'lerinin güvenli ve hızlı çalışmasını sağlama.',
            'Kullanıcı otorizasyonu, veri senkronizasyonu.',
            'API entegrasyonları ve performans iyileştirme.'
        ],
        qualifications: [
            'REST/GraphQL API tecrübesi.',
            'Mobil backend sistemlerine hakimiyet.'
        ],
        benefits: [],
        tags: ['#MobilUygulama', '#Backend', '#GraphQL', '#API', '#Performans']
    }
  ]
};

// --- SVG ICONS ---
// Using inline SVGs for icons to avoid external dependencies.
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
);

// --- COMPONENTS ---

// Search bar component
const SearchBar = ({ searchTerm, setSearchTerm }) => (
    <div className="relative mb-6">
        <input
            type="text"
            placeholder="İş Başvurusu Ara (örn: #Fintech, Proje Yöneticisi...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon />
        </div>
    </div>
);

// Component to display a single job card in the list
const JobCard = ({ job, onSelect }) => (
    <div
        onClick={() => onSelect(job)}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
    >
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{job.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-3">{job.company}</p>
        <div className="flex flex-wrap gap-2">
            {job.tags.map(tag => (
                <span key={tag} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {tag}
                </span>
            ))}
        </div>
    </div>
);

// Component to display the list of all jobs, categorized and filtered
const JobList = ({ jobs, onSelect, searchTerm }) => {
    const filteredJobs = useMemo(() => {
        if (!searchTerm) return jobs;

        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = {};

        Object.keys(jobs).forEach(category => {
            const categoryJobs = jobs[category].filter(job =>
                job.title.toLowerCase().includes(lowercasedFilter) ||
                job.company.toLowerCase().includes(lowercasedFilter) ||
                job.tags.some(tag => tag.toLowerCase().includes(lowercasedFilter))
            );

            if (categoryJobs.length > 0) {
                filtered[category] = categoryJobs;
            }
        });

        return filtered;
    }, [searchTerm, jobs]);
    
    const hasResults = Object.keys(filteredJobs).length > 0;

    return (
        <div className="space-y-8">
            {hasResults ? (
                Object.keys(filteredJobs).map(category => (
                    <div key={category}>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b-2 border-blue-500">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                            {filteredJobs[category].map(job => (
                                <JobCard key={job.id} job={job} onSelect={onSelect} />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Arama Sonucu Bulunamadı</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Lütfen arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                </div>
            )}
        </div>
    );
};

// Component to display the detailed view of a selected job
const JobDetail = ({ job, onBack }) => {
    const DetailSection = ({ title, items }) => {
        if (!items || items.length === 0) return null;
        return (
            <div>
                <h4 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-3">{title}</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    {items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
            <button
                onClick={onBack}
                className="inline-flex items-center mb-6 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
                <BackIcon />
                Tüm İş İlanları
            </button>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{job.title}</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">{job.company}</p>
            </div>

            <div className="space-y-8">
                <DetailSection title="Görev ve Sorumluluklar" items={job.responsibilities} />
                <DetailSection title="Nitelikler" items={job.qualifications} />
                <DetailSection title="Avantajlar" items={job.benefits} />

                <div>
                    <h4 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-3">Etiketler</h4>
                    <div className="flex flex-wrap gap-2">
                        {job.tags.map(tag => (
                            <span key={tag} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => alert(`${job.title} pozisyonuna başvuru yapılıyor...`)}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all text-lg"
                >
                    Başvur
                </button>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const JobListingsPage = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectJob = (job) => {
        setSelectedJob(job);
    };

    const handleBack = () => {
        setSelectedJob(null);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                `}
            </style>
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">İş Başvuruları</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className={`grid ${selectedJob ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
                    {/* Left Column: Search and Job List */}
                    <div className={`lg:col-span-2 ${selectedJob ? 'hidden lg:block' : 'block'}`}>
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <JobList jobs={jobData} onSelect={handleSelectJob} searchTerm={searchTerm} />
                    </div>

                    {/* Right Column: Job Detail */}
                    <div className="lg:col-span-1">
                        {selectedJob ? (
                            <div className="sticky top-8">
                                <JobDetail job={selectedJob} onBack={handleBack} />
                            </div>
                        ) : (
                            <div className="hidden lg:flex sticky top-8 h-[calc(100vh-10rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center text-center p-8">
                                <div>
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Bir iş ilanı seçin</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Detayları görmek için soldaki listeden bir ilana tıklayın.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobListingsPage;
