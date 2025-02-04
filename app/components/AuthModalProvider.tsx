'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import AuthModal from './AuthModal'

interface AuthModalContextType {
  showModal: (mode: 'signin' | 'signup' | 'reset') => void
  hideModal: () => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin')

  const showModal = (mode: 'signin' | 'signup' | 'reset') => {
    setMode(mode)
    setIsOpen(true)
  }

  const hideModal = () => setIsOpen(false)

  return (
    <AuthModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={hideModal} initialMode={mode} />
    </AuthModalContext.Provider>
  )
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
} 