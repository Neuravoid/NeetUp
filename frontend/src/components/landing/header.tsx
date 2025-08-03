import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "./button"
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#ozellikler" className="text-gray-600 hover:text-purple-600 transition-colors">
              Özellikler
            </a>
            <a href="#nasil-calisir" className="text-gray-600 hover:text-purple-600 transition-colors">
              Nasıl Çalışır
            </a>
            <a href="#fiyatlandirma" className="text-gray-600 hover:text-purple-600 transition-colors">
              Fiyatlandırma
            </a>
            <a href="#hakkimizda" className="text-gray-600 hover:text-purple-600 transition-colors">
              Hakkımızda
            </a>
          </nav>

          {/* CTA Buttons - Moved to the right */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-50 hover:text-purple-600 hover:border-purple-500 font-medium">
                Giriş Yap
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Kayıt Ol
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#ozellikler" 
                className="text-gray-600 hover:text-purple-600 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Özellikler
              </a>
              <a 
                href="#nasil-calisir" 
                className="text-gray-600 hover:text-purple-600 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Nasıl Çalışır
              </a>
              <a 
                href="#fiyatlandirma" 
                className="text-gray-600 hover:text-purple-600 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Fiyatlandırma
              </a>
              <a 
                href="#hakkimizda" 
                className="text-gray-600 hover:text-purple-600 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50 mb-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </a>
              <div className="flex flex-col space-y-3 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center border-gray-300 text-gray-800 hover:bg-gray-50 hover:text-purple-600 hover:border-purple-500 font-medium">
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
