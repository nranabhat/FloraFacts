'use client'

import { useAuthModal } from './AuthModalProvider'
import { useEffect, useState } from 'react'

// Import section components
import HeroSection from './landing/HeroSection'
import FeaturesSection from './landing/FeaturesSection'
import ReviewsSection from './landing/ReviewsSection'
import HowItWorksSection from './landing/HowItWorksSection'
import CTASection from './landing/CTASection'

export default function LandingPage() {
  const { showModal } = useAuthModal()
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typical mobile breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleGetStarted = () => {
    showModal('signup')
  }

  return (
    <div className="space-y-24 pb-12">
      <HeroSection handleGetStarted={handleGetStarted} />
      <FeaturesSection />
      <ReviewsSection isMobile={isMobile} />
      <HowItWorksSection />
      <CTASection handleGetStarted={handleGetStarted} />
    </div>
  )
} 