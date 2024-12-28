'use client'

import { Lobster } from 'next/font/google'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className={`${lobster.className} text-2xl flex items-center gap-2 
                text-green-800 dark:text-green-500 
                hover:text-green-600 dark:hover:text-green-400 
                transition-colors`}
            >
              <span className="text-2xl">🌿</span>
              FloraFacts
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/gallery" 
              className="text-green-800 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300"
            >
              Gallery
            </Link>
            <Link 
              href="/about" 
              className="text-green-800 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300"
            >
              About
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-green-100 dark:bg-gray-700 text-green-800 dark:text-green-400
                hover:bg-green-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
} 