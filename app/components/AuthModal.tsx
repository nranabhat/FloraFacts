'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FirebaseError } from 'firebase/app'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { auth } from '../lib/firebase'
import Image from 'next/image'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup' | 'reset'
}

// Add this type at the top of the file
type AuthErrorCode = 
  | 'auth/invalid-credential'
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/weak-password'
  | 'auth/user-not-found'
  | 'auth/wrong-password'

// Separate error messages into a constant object
const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  'auth/invalid-credential': 'Incorrect email or password. Please try again.',
  'auth/email-already-in-use': 'This email is already registered. Please Log In instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/user-not-found': 'Incorrect email or password. Please try again.',
  'auth/wrong-password': 'Incorrect email or password. Please try again.'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth()

  // Add ref for modal content
  const modalRef = useRef<HTMLDivElement>(null)

  // Add click away listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getErrorMessage = (error: FirebaseError) => {
    const code = error.code as AuthErrorCode
    return AUTH_ERROR_MESSAGES[code] ?? 'An error occurred. Please try again.'
  }

  const checkEmailSignInMethods = async (email: string) => {
    try {
      setIsCheckingEmail(true)
      const methods = await fetchSignInMethodsForEmail(auth, email)
      
      if (methods.includes('google.com')) {
        setError('This email is linked to a Google account. Please Log In with Google.')
        setPassword('')
        return true
      }
      return false
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleEmailBlur = async () => {
    if (email && (mode === 'signin' || mode === 'signup')) {
      await checkEmailSignInMethods(email)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      if (mode === 'signin' || mode === 'signup') {
        const isGoogleAccount = await checkEmailSignInMethods(email)
        if (isGoogleAccount) return
      }

      switch (mode) {
        case 'signin':
          await signInWithEmail(email, password)
          onClose()
          break
        case 'signup':
          await signUpWithEmail(email, password)
          onClose()
          break
        case 'reset':
          await resetPassword(email)
          setResetSent(true)
          break
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        // Only log the error code in development
        if (process.env.NODE_ENV === 'development') {
          console.debug('Auth error:', err.code)
        }
        setError(getErrorMessage(err))
        if (err.code === 'auth/email-already-in-use') {
          setMode('signin')
        }
      } else {
        setError('An unexpected error occurred.')
      }
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      onClose()
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(getErrorMessage(err))
      } else {
        setError('Failed to Log In with Google.')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div 
        ref={modalRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          {mode === 'signin' ? 'Log In' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-green-50/50 dark:bg-green-950/30 
            rounded-lg border border-green-100 dark:border-green-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-300/90 text-sm">
              <svg className="w-5 h-5 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            {error.includes('Google account') && (
              <button
                onClick={handleGoogleSignIn}
                className="block w-full mt-3 text-sm text-green-700 dark:text-green-400 
                  hover:text-green-800 dark:hover:text-green-300 transition-colors"
              >
                Click here to Log In with Google
              </button>
            )}
          </div>
        )}

        {mode === 'reset' && resetSent ? (
          <div className="text-center">
            <p className="text-green-600 dark:text-green-400 mb-4">
              Password reset email sent! Check your inbox.
            </p>
            <button
              onClick={() => setMode('signin')}
              className="text-green-600 hover:underline"
            >
              Return to Log In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 
                  dark:bg-gray-700 dark:text-white shadow-sm p-2.5 
                  focus:border-green-500 dark:focus:border-green-500 
                  focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 
                  transition-colors"
                required
              />
            </div>

            {mode !== 'reset' && !error?.includes('Google account') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 
                    dark:bg-gray-700 dark:text-white shadow-sm p-2.5 
                    focus:border-green-500 dark:focus:border-green-500 
                    focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 
                    transition-colors"
                  required
                />
              </div>
            )}

            {!error?.includes('Google account') && (
              <button
                type="submit"
                disabled={isCheckingEmail}
                className="w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 
                  transition-colors disabled:opacity-50"
              >
                {isCheckingEmail ? 'Checking...' : 
                  mode === 'signin' ? 'Log In' : 
                  mode === 'signup' ? 'Sign Up' : 
                  'Send Reset Email'}
              </button>
            )}
          </form>
        )}

        {mode !== 'reset' && (
          <>
            <div className="mt-6 mb-6 flex items-center">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 
                flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 
                transition-colors"
            >
              <Image 
                src="/google-icon.svg" 
                alt="Google Logo" 
                width={20} 
                height={20}
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'signin' && (
            <div className="space-y-2">
              <div>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-green-600 hover:underline"
                >
                  Sign up
                </button>
              </div>
              <div>
                <button
                  onClick={() => setMode('reset')}
                  className="text-green-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}
          {mode === 'signup' && (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-green-600 hover:underline"
              >
                Log In
              </button>
            </>
          )}
          {mode === 'reset' && !resetSent && (
            <>
              Remember your password?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-green-600 hover:underline"
              >
                Log In
              </button>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 
            dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span className="sr-only">Close</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
} 