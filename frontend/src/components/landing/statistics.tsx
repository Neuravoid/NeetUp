import { TrendingUp, Users, Award, Clock, BarChart3, Target } from 'lucide-react'

const stats = [
  {
    icon: Users,
    number: "150+",
    label: "Beta Kullanıcısı",
    description: "Platformumuzu test eden erken kullanıcılar",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    number: "78%",
    label: "Memnuniyet",
    description: "Beta kullanıcılarının memnuniyet oranı",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Clock,
    number: "3 Ay",
    label: "Geliştirme Süresi",
    description: "MVP'yi geliştirmek için harcanan süre",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Award,
    number: "5+",
    label: "Özellik",
    description: "Şu anda aktif olan temel özellik sayısı",
    color: "from-orange-500 to-red-500",
  },
]

const milestones = [
  { icon: Target, label: "Hedef: 500 Kullanıcı", value: "30%" },
  { icon: BarChart3, label: "Özellik Tamamlanma", value: "60%" },
  { icon: Users, label: "Geri Bildirim Oranı", value: "85%" },
]

export default function Statistics() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            MVP <span className="text-yellow-300">İstatistiklerimiz</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Henüz başlangıç aşamasındayız ama ilk sonuçlar umut verici! Beta kullanıcılarımızın geri bildirimleri ile
            büyüyoruz.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.color} mb-4`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-xl font-semibold text-yellow-300 mb-2">{stat.label}</div>
              <div className="text-blue-100 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Development Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Geliştirme Durumu</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <milestone.icon className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{milestone.value}</div>
                <div className="text-blue-100 text-sm">{milestone.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm">
              <span>🚧</span>
              <span>Aktif geliştirme aşamasında - Her hafta yeni özellikler ekliyoruz!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
