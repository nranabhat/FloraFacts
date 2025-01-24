'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  userProfileEmoji: string | null
  onAuthClick: (mode: 'signin' | 'signup') => void
}

export default function MobileMenu({ isOpen, onClose, userProfileEmoji, onAuthClick }: MobileMenuProps) {
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
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-gray-800 
        shadow-xl transition-transform duration-300 ease-in-out transform
        border-l border-gray-200 dark:border-gray-700">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 
            dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span className="sr-only">Close menu</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* User info if logged in */}
        {user && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{userProfileEmoji || '👤'}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.displayName || user.email?.split('@')[0]}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-6 space-y-2">
          <Link
            href="/"
            onClick={onClose}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              pathname === '/' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Home
          </Link>
          <Link
            href="/gallery"
            onClick={onClose}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              pathname === '/gallery'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Gallery
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              pathname === '/about'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Add this in the navigation section for non-logged in users */}
        {!user && (
          <div className="p-6 space-y-2">
            <button
              onClick={() => {
                onAuthClick('signin')
                onClose()
              }}
              className="block w-full px-4 py-2 text-gray-600 dark:text-gray-300 
                border border-gray-300 dark:border-gray-600 rounded-lg
                hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Log In
            </button>
            <button
              onClick={() => {
                onAuthClick('signup')
                onClose()
              }}
              className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg 
                hover:bg-green-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* User actions */}
        {user ? (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/profile"
              onClick={onClose}
              className="block px-4 py-2 text-gray-600 dark:text-gray-300 
                hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg mb-2"
            >
              Profile Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-gray-600 dark:text-gray-300 
                hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
} 