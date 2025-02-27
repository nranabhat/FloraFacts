'use client'

import { useState } from 'react'
import { Lobster } from 'next/font/google'
import MobileReviews from './MobileReviews'
import DesktopReviews from './DesktopReviews'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

interface ReviewsSectionProps {
  isMobile: boolean
}

export default function ReviewsSection({ isMobile }: ReviewsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <section className="max-w-7xl mx-auto px-4 overflow-hidden">
      <h2 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 text-center mb-12`}>
        What Our Users Say
      </h2>
      
      {isMobile ? (
        <MobileReviews 
          currentIndex={currentIndex} 
          setCurrentIndex={(idx) => setCurrentIndex(idx)} 
        />
      ) : (
        <DesktopReviews />
      )}
    </section>
  )
} 