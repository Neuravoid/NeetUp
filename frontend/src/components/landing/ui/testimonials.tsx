import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Ayşe Kaya",
    age: 23,
    role: "Frontend Developer",
    company: "TechStart",
    rating: 5,
    text: "NeetUp sayesinde web geliştirme alanındaki yeteneklerimi keşfettim. 6 ay içinde hayalindeki işe kavuştum. Platform gerçekten hayat değiştirici!",
    initials: "AK",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Mehmet Özkan",
    age: 26,
    role: "Dijital Pazarlama Uzmanı",
    company: "GrowthCo",
    rating: 5,
    text: "Uzun süre ne yapacağımı bilemiyordum. NeetUp'ın AI analizi pazarlama alanındaki potansiyelimi gösterdi. Şimdi kendi ajansımı kuruyorum!",
    initials: "MÖ",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Zeynep Demir",
    age: 24,
    role: "UX Designer",
    company: "DesignHub",
    rating: 5,
    text: "Kişiselleştirilmiş yol haritası ve proje önerileri sayesinde portfolyomu güçlendirdim. İlk mülakatımda işe alındım!",
    initials: "ZD",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Can Yılmaz",
    age: 25,
    role: "Girişimci",
    company: "EcoTech Startup",
    rating: 5,
    text: "Girişimci koçu chatbot ile iş fikrimi geliştirdim ve iş planımı oluşturdum. Şimdi kendi startup'ımı yönetiyorum!",
    initials: "CY",
    color: "from-orange-500 to-red-500",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Başarı{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Hikayeleri
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            NeetUp ile potansiyellerini keşfeden ve hayallerindeki kariyerlere kavuşan gençlerin gerçek deneyimlerini
            dinle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                >
                  {testimonial.initials}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {testimonial.name}, {testimonial.age}
                  </h4>
                  <p className="text-purple-600 font-medium">{testimonial.role}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>
                <Quote className="h-8 w-8 text-purple-300" />
              </div>

              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-green-50 text-green-700 px-6 py-3 rounded-full">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white text-xs font-bold border-2 border-white`}
                >
                  {testimonial.initials}
                </div>
              ))}
            </div>
            <span className="font-medium">+150 genç NeetUp ile kariyerini başlattı</span>
          </div>
        </div>
      </div>
    </section>
  )
}
