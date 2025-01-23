'use client'

import { Lobster } from 'next/font/google'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import { usePathname } from 'next/navigation'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout, userProfileEmoji } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getDisplayName = () => {
    if (!user) return ''
    return user.displayName || user.email?.split('@')[0] || 'User'
  }

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
                transition-colors group`}
            >
              <span className="text-2xl transform group-hover:scale-110 transition-transform duration-200">🌿</span>
              FloraFacts
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className={`relative px-3 py-2 font-medium group overflow-hidden rounded-lg
                  transition-colors duration-300
                  ${pathname === '/' 
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-transparent 
                  dark:from-green-900/40 dark:to-transparent opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300" />
              </Link>

              <Link 
                href="/gallery" 
                className={`relative px-3 py-2 font-medium group overflow-hidden rounded-lg
                  transition-colors duration-300
                  ${pathname === '/gallery' 
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
              >
                <span className="relative z-10">Gallery</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-transparent 
                  dark:from-green-900/40 dark:to-transparent opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300" />
              </Link>

              <Link 
                href="/about" 
                className={`relative px-3 py-2 font-medium group overflow-hidden rounded-lg
                  transition-colors duration-300
                  ${pathname === '/about' 
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
              >
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-transparent 
                  dark:from-green-900/40 dark:to-transparent opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300" />
              </Link>
            </div>

            {user ? (
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 
                    text-gray-600 dark:text-gray-300 
                    font-medium rounded-lg
                    hover:bg-green-50 dark:hover:bg-green-900/20 
                    transition-all duration-300"
                >
                  <span className="text-lg">{userProfileEmoji || '👨'}</span>
                  <span>{getDisplayName()}</span>
                  <svg className="w-4 h-4 transition-transform duration-200 
                    group-hover:translate-y-0.5" 
                    fill="none" viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div 
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg 
                      border border-gray-200 dark:border-gray-700"
                  >
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b 
                      border-gray-200 dark:border-gray-700">
                      {user.email}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                        hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                        hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg 
                  hover:bg-green-700 transition-all duration-300 
                  transform hover:scale-105 hover:shadow-md
                  font-medium"
              >
                Log In
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-green-50 dark:bg-gray-700 
                text-green-800 dark:text-green-400
                hover:bg-green-100 dark:hover:bg-gray-600 
                transition-all duration-300 transform hover:scale-105
                ml-4"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  )
} 