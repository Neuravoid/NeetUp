import { Linkedin, Github } from 'lucide-react'

const teamMembers = [
  {
    name: "Umut Alkan",
    role: "Product Owner",
    description: "Marmara Üniversitesi İstatistik öğrencisi. Ürün vizyonu ve geliştirme süreçlerini yönetiyor.",
    initials: "UA",
    color: "from-purple-500 to-pink-500",
    linkedin: "https://www.linkedin.com/in/umutalkan42",
    github: "#",
  },
  {
    name: "Rüya İşlek",
    role: "Scrum Master",
    description: "İTÜ Elektronik ve Haberleşme Mühendisliği öğrencisi. Takım koordinasyonu ve backend geliştirme.",
    initials: "Rİ",
    color: "from-blue-500 to-cyan-500",
    linkedin: "https://www.linkedin.com/in/ruyaislek/",
    github: "#",
  },
  {
    name: "Zeynep Turhanoğlu",
    role: "Developer",
    description: "Karabük Üniversitesi Bilgisayar Mühendisliği mezunu. Proje yönetimi ve full-stack geliştirme.",
    initials: "ZT",
    color: "from-green-500 to-emerald-500",
    linkedin: "https://www.linkedin.com/in/zeynepturhanoglu/",
    github: "#",
  },
  {
    name: "Ahmet Tarık Karakaş",
    role: "Developer",
    description: "Fatih Sultan Mehmet Üniversitesi İşletme öğrencisi. Frontend geliştirme ve kullanıcı deneyimi.",
    initials: "AK",
    color: "from-orange-500 to-red-500",
    linkedin: "http://www.linkedin.com/in/ahmettarikkarakas",
    github: "#",
  },
]

export default function Team() {
  return (
    <section id="hakkimizda" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Genç{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Ekibimiz</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            NEET gençlik sorununa çözüm bulmak için bir araya gelen 4 kişilik öğrenci ekibi. Kendi deneyimlerimizden
            yola çıkarak bu projeyi geliştiriyoruz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group text-center bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative mb-6">
                <div
                  className={`w-24 h-24 rounded-full mx-auto bg-gradient-to-r ${member.color} flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  {member.initials}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-purple-600 font-semibold mb-3 text-sm">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.description}</p>

              <div className="flex justify-center space-x-2">
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <Linkedin className="h-4 w-4 text-blue-600" />
                </a>
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <Github className="h-4 w-4 text-gray-600" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Project Story */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Projemizin Hikayesi</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Sorun Tespiti</h4>
              <p className="text-gray-600 text-sm">
                Çevremizde NEET durumunda olan arkadaşlarımızı gözlemleyerek bu soruna odaklandık.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">MVP Geliştirme</h4>
              <p className="text-gray-600 text-sm">
                Minimal ama etkili bir çözüm geliştirmek için agile metodoloji kullanıyoruz.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Sürekli İyileştirme</h4>
              <p className="text-gray-600 text-sm">
                Kullanıcı geri bildirimlerini alarak ürünümüzü sürekli geliştiriyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
