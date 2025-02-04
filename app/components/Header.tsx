'use client'

import { Lobster } from 'next/font/google'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from './AuthModalProvider'
import { usePathname } from 'next/navigation'
import { useMobileMenu } from './MobileMenuProvider'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout, userProfileEmoji } = useAuth()
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const { showModal } = useAuthModal()
  const { showMenu } = useMobileMenu()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Always show header if at the top of the page
      if (currentScrollY <= 0) {
        setIsVisible(true)
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = () => {
    showModal('signin')
  }

  const handleSignUp = () => {
    showModal('signup')
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 
      shadow-sm transition-all duration-300 transform
      ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/"
              className={`${lobster.className} text-2xl flex items-center gap-2 
                text-green-800 dark:text-green-500 
                hover:text-green-600 dark:hover:text-green-400 
                transition-colors group`}
            >
              <span className="text-2xl transform group-hover:scale-110 transition-transform duration-200">
                🌿
              </span>
              FloraFacts
            </Link>
          </div>

          {/* Right side: Navigation + Theme + Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <Link 
              href="/"
              className={`relative px-3 py-2 font-medium group overflow-hidden rounded-lg
                transition-colors duration-300
                ${pathname === '/' 
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
            >
              Home
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
              Gallery
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
              About
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-green-50 dark:bg-gray-700 
                text-green-800 dark:text-green-400
                hover:bg-green-100 dark:hover:bg-gray-600 
                transition-all duration-300 transform hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Auth Buttons */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    ref={buttonRef}
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 px-3 py-2 
                      text-gray-600 dark:text-gray-300 
                      font-medium rounded-lg
                      hover:bg-green-50 dark:hover:bg-green-900/20 
                      transition-all duration-300"
                  >
                    <span className="text-lg">{userProfileEmoji || '👤'}</span>
                    <span>{user.displayName || user.email?.split('@')[0]}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 
                        ${showUserDropdown ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div 
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
                        py-1 z-50"
                    >
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 
                        border-b border-gray-200 dark:border-gray-700">
                        {user.email}
                      </div>
                      
                      <Link
                        href="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                          hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile Settings
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleLogout()
                          setShowUserDropdown(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 
                          dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 
                      border border-gray-300 dark:border-gray-600
                      rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                      transition-all duration-300"
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg 
                      hover:bg-green-700 transition-all duration-300 
                      transform hover:scale-105 hover:shadow-md
                      font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={showMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="sr-only">Open menu</span>
            <svg 
              className="w-6 h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}