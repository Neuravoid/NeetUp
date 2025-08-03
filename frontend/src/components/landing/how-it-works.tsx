import { ArrowRight, CheckCircle, Brain, Map, BookOpen, Briefcase } from 'lucide-react'

const steps = [
  {
    step: "01",
    title: "Yetenek Testi Al",
    description: "AI destekli kapsamlı testlerle ilgi alanlarını ve gizli yeteneklerini keşfet.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
  },
  {
    step: "02",
    title: "Kişisel Yol Haritanı Al",
    description: "Yapay zeka, test sonuçlarına göre sana özel bir beceri ve kariyer planı oluşturur.",
    icon: Map,
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: "03",
    title: "Becerilerini Geliştir",
    description: "Önerilen kurslar ve projelerle adım adım ilerle, portfolyonu güçlendir.",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
  },
  {
    step: "04",
    title: "Kariyerini Başlat",
    description: "Hazır olduğunda, sana uygun iş fırsatlarıyla eşleştirilir ve kariyerini başlatırsın.",
    icon: Briefcase,
    color: "from-orange-500 to-red-500",
  },
]

export default function HowItWorks() {
  return (
    <section id="nasil-calisir" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nasıl{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Çalışır?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sadece 4 basit adımda potansiyelini keşfet ve hayalindeki kariyere başla. Her adım seni hedefe bir adım daha
            yaklaştırır.
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center">
                    {step.step}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{step.title}</h3>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>

                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Tamamen ücretsiz başlangıç</span>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex items-center space-x-2 text-purple-600 font-medium">
                    <span>Sonraki adım</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Visual Element */}
              <div className="flex-1">
                <div className="relative">
                  <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-12 shadow-xl`}>
                    <div className="text-center">
                      <step.icon className="h-24 w-24 text-white mx-auto mb-6" />
                      <div className="text-white/90 text-lg font-medium">
                        {step.step === "01" && "Kişilik ve yetenek analizi"}
                        {step.step === "02" && "Özelleştirilmiş plan"}
                        {step.step === "03" && "Pratik ve deneyim"}
                        {step.step === "04" && "İş fırsatları"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
