import { Brain, Map, BookOpen, MessageSquare, Briefcase, Trophy } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "Temel Yetenek Analizi",
    description: "Basit testlerle ilgi alanlarını ve güçlü yönlerini keşfet. (Beta sürümü)",
    color: "from-purple-500 to-pink-500",
    status: "Beta",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    icon: Map,
    title: "Kariyer Rehberi",
    description: "Farklı kariyer yolları hakkında temel bilgiler ve öneriler.",
    color: "from-blue-500 to-cyan-500",
    status: "Geliştiriliyor",
    statusColor: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: BookOpen,
    title: "Kaynak Önerileri",
    description: "Ücretsiz online kurs ve öğrenme materyali önerileri.",
    color: "from-green-500 to-emerald-500",
    status: "Beta",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    icon: MessageSquare,
    title: "Basit Chatbot",
    description: "Temel kariyer sorularına yanıt veren basit sohbet botu.",
    color: "from-orange-500 to-red-500",
    status: "Prototip",
    statusColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: Briefcase,
    title: "İş İlanı Toplama",
    description: "Çeşitli sitelerden toplanan entry-level iş ilanları.",
    color: "from-indigo-500 to-purple-500",
    status: "Yakında",
    statusColor: "bg-gray-100 text-gray-700",
  },
  {
    icon: Trophy,
    title: "Basit Portfolyo",
    description: "Temel bilgiler ve projelerini sergileyebileceğin basit profil.",
    color: "from-yellow-500 to-orange-500",
    status: "Yakında",
    statusColor: "bg-gray-100 text-gray-700",
  },
]

export default function Features() {
  return (
    <section id="ozellikler" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            MVP{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Özelliklerimiz
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            NeetUp'ın ilk sürümünde yer alan temel özellikler. Geri bildirimlerinizle birlikte sürekli geliştiriyoruz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 bg-white relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${feature.color} opacity-10 rounded-full -translate-y-16 translate-x-16`}
              ></div>

              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${feature.statusColor}`}>
                  {feature.status}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
            <span>💡</span>
            <span>Önerileriniz bizim için çok değerli! Geri bildirim gönderin.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
