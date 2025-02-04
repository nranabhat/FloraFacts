'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  userProfileEmoji: string | null
  onLogin: () => void
  onSignUp: () => void
  theme: string
  onThemeToggle: () => void
}

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  userProfileEmoji, 
  onLogin,
  onSignUp,
  theme,
  onThemeToggle 
}: MobileMenuProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleLogout = async () => {
    try {
      await logout()
      onClose()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] md:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-gray-800 
        shadow-2xl transition-transform duration-300 ease-in-out transform
        border-l border-gray-200 dark:border-gray-700 overflow-y-auto
        flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 
          border-b border-gray-200 dark:border-gray-700 p-4
          flex items-center justify-between"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
              text-gray-500 hover:text-gray-700 dark:text-gray-400 
              dark:hover:text-gray-200 transition-colors"
          >
            <span className="sr-only">Close menu</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info if logged in */}
        {user && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{userProfileEmoji || '👤'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
              pathname === '/' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span>Home</span>
          </Link>
          <Link
            href="/gallery"
            onClick={onClose}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
              pathname === '/gallery'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span>Gallery</span>
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
              pathname === '/about'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span>About</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl
              text-gray-600 dark:text-gray-300 
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
          </button>
        </nav>

        {/* Auth Buttons or User Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!user ? (
            <div className="space-y-2">
              <button
                onClick={onLogin}
                className="w-full px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 
                  border-2 border-gray-300 dark:border-gray-600
                  hover:bg-gray-50 dark:hover:bg-gray-700 
                  transition-colors font-medium"
              >
                Log In
              </button>
              <button
                onClick={onSignUp}
                className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl 
                  hover:bg-green-700 transition-colors font-medium"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/profile"
                onClick={onClose}
                className="block w-full px-4 py-2.5 text-gray-600 dark:text-gray-300 
                  hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-center"
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-red-600 dark:text-red-400 
                  hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl 
                  transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 