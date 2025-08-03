import { Button } from "./button"
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Beta Sürümü - Geri Bildirimlerinizi Bekliyoruz</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Bizimle Birlikte
            <br />
            <span className="text-yellow-300">Büyümeye Başla</span>
          </h2>

          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            NeetUp henüz MVP aşamasında ama potansiyeli keşfetmek için yeterli! Beta kullanıcımız ol, geri
            bildirimlerinle ürünümüzü şekillendirmeye yardım et.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold">
              Beta'ya Katıl
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4 bg-transparent"
            >
              Geri Bildirim Gönder
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl font-bold text-yellow-300 mb-2">150+</div>
              <div className="text-blue-100">Beta Kullanıcısı</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold text-yellow-300 mb-2">78%</div>
              <div className="text-blue-100">Memnuniyet Oranı</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold text-yellow-300 mb-2">3 Ay</div>
              <div className="text-blue-100">Geliştirme Süreci</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
