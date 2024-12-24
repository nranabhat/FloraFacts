'use client'

import { Lobster } from 'next/font/google'
import Link from 'next/link'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Branding */}
          <div className="flex items-center">
            <Link 
              href="/"
              className={`${lobster.className} text-2xl text-green-800 
              flex items-center gap-2 hover:text-green-700 transition-colors`}
            >
              <span className="text-2xl">🌿</span>
              FloraFacts
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <Link 
              href="/"
              className="text-gray-600 hover:text-green-800 transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              href="/gallery"
              className="text-gray-600 hover:text-green-800 transition-colors text-sm font-medium"
            >
              Gallery
            </Link>
            <Link 
              href="/about"
              className="text-gray-600 hover:text-green-800 transition-colors text-sm font-medium"
            >
              About Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 