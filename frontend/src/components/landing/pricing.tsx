import { Button } from "./button"
import { Check, Zap, Crown } from 'lucide-react'

const plans = [
  {
    name: "Beta Erişimi",
    price: "Ücretsiz",
    period: "Şu an için",
    description: "MVP özelliklerini test et ve geri bildirim ver",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    features: [
      "Temel yetenek analizi",
      "Kariyer rehberi erişimi",
      "Basit kaynak önerileri",
      "Topluluk desteği",
      "Beta özelliklerine erken erişim",
    ],
    cta: "Beta'ya Katıl",
    popular: true,
  },
  {
    name: "Gelecek Planı",
    price: "~50₺",
    period: "/ay (tahmini)",
    description: "Tam sürüm çıktığında sunulacak premium özellikler",
    icon: Crown,
    color: "from-purple-500 to-blue-500",
    features: [
      "Beta'nın tüm özellikleri",
      "Gelişmiş AI analizi",
      "Kişiselleştirilmiş yol haritası",
      "Öncelikli destek",
      "Detaylı raporlar",
      "İş eşleştirme (yakında)",
    ],
    cta: "Bilgilendirilmek İstiyorum",
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="fiyatlandirma" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Basit{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Fiyatlandırma
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Şu anda MVP aşamasındayız ve her şey ücretsiz! Gelecekte sürdürülebilir bir model planlıyoruz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? "border-purple-200 scale-105" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                    Şu An Aktif
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}>
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full py-3 text-lg font-medium ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="space-y-4">
            <p className="text-gray-600">
              💡 <strong>Not:</strong> Şu anda tüm özellikler ücretsiz! Geri bildirimleriniz bizim için çok değerli.
            </p>
            <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
              <span>✓ Öğrenci dostu fiyatlandırma</span>
              <span>✓ Şeffaf geliştirme süreci</span>
              <span>✓ Topluluk odaklı yaklaşım</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
