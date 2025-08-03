import { Button } from "./button"
import { ArrowRight, Play, Sparkles, Zap, Target, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="pt-24 pb-12 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Beta Sürümü - Erken Erişim</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Potansiyelini{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Keşfet</span>
              , Geleceğini{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Şekillendir
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              NEET gençler için tasarlanan kariyer keşif platformu. Yeteneklerini keşfet, becerilerini geliştir ve
              hayalindeki kariyere ilk adımı at. Şu anda beta aşamasında!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-4"
                >
                  Beta'ya Katıl
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent dark:border-gray-600 dark:text-gray-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Prototip İzle
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Ücretsiz Beta Erişimi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Geri Bildirim Odaklı Geliştirme</span>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-purple-400 to-blue-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Zap className="h-8 w-8 text-yellow-300" />
                  <div>
                    <div className="text-white font-semibold">Yetenek Keşfi</div>
                    <div className="text-blue-100 text-sm">Beta özellik</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Target className="h-8 w-8 text-green-300" />
                  <div>
                    <div className="text-white font-semibold">Kariyer Rehberi</div>
                    <div className="text-blue-100 text-sm">Geliştiriliyor</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-pink-300" />
                  <div>
                    <div className="text-white font-semibold">Topluluk</div>
                    <div className="text-blue-100 text-sm">Yakında</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Beta Sürümü</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Beta Kullanıcıları</div>
                  <div className="text-2xl font-bold text-purple-600">150+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
