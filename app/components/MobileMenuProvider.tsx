'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import MobileMenu from './MobileMenu'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from './AuthModalProvider'
import { useTheme } from '../context/ThemeContext'

interface MobileMenuContextType {
  showMenu: () => void
  hideMenu: () => void
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined)

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const { userProfileEmoji } = useAuth()
  const { showModal } = useAuthModal()
  const { theme, toggleTheme } = useTheme()

  const showMenu = () => setIsOpen(true)
  const hideMenu = () => setIsOpen(false)

  const handleLogin = () => {
    hideMenu()
    showModal('signin')
  }

  const handleSignUp = () => {
    hideMenu()
    showModal('signup')
  }

  return (
    <MobileMenuContext.Provider value={{ showMenu, hideMenu }}>
      {children}
      <MobileMenu 
        isOpen={isOpen}
        onClose={hideMenu}
        userProfileEmoji={userProfileEmoji}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
    </MobileMenuContext.Provider>
  )
}

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext)
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider')
  }
  return context
} 