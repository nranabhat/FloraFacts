'use client'

import { Lobster } from 'next/font/google'
import Image from 'next/image'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

interface HeroSectionProps {
  handleGetStarted: () => void
}

export default function HeroSection({ handleGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20
      bg-gradient-to-b from-green-50 via-green-50/50 to-white 
      dark:from-gray-900/50 dark:via-gray-900/30 dark:to-transparent">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text content */}
        <div className="text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
          <h1 className={`${lobster.className} text-6xl md:text-7xl leading-tight`}>
            <span className="text-gray-800 dark:text-gray-100">Discover the World of </span>
            <span className="text-green-600 dark:text-green-400 
              relative inline-block
              after:content-[''] after:absolute after:-bottom-2 after:left-0 after:right-0
              after:h-1 after:bg-green-400 dark:after:bg-green-500 after:rounded-full
              after:transform after:scale-x-75">
              Plants
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-light">
            Instantly identify plants, get expert care guides, and build your botanical knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-green-600 text-white text-lg rounded-lg 
                hover:bg-green-700 transition-all duration-300 
                transform hover:scale-105 hover:shadow-lg
                flex items-center justify-center gap-2"
            >
              <span>Get Started - It's Free</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right side - Preview Image */}
        <div className="relative max-w-xl mx-auto lg:mx-0">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl 
            border border-green-100/50 dark:border-green-900/30
            bg-white dark:bg-gray-800">
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60"></div>
            </div>

            {/* Plant Image - Reduced height */}
            <div className="relative w-full h-[300px]">
              <Image
                src="/dashboard-preview.jpg"
                alt="Plant identification preview"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            
            {/* Plant Info Card - Now with more details */}
            <div className="p-5 border-t border-green-100 dark:border-green-900
              bg-white dark:bg-gray-800">
              <div className="space-y-4">
                {/* Title and Icon */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                      Japanese Honeysuckle
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      Lonicera japonica
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-7 h-7 
                    bg-green-50 dark:bg-green-900/30 rounded-full">
                    <span className="text-lg">🌿</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A vigorous, twining vine with fragrant, white flowers that gradually 
                  turn yellow, followed by dark berries.
                </p>

                {/* Plant Details Grid */}
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm
                    border border-gray-100 dark:border-gray-800">
                    <span className="flex items-center justify-center w-5 h-5 
                      bg-blue-50 dark:bg-blue-900/30 rounded-full">
                      <span className="text-base">🌍</span>
                    </span>
                    Eastern Asia
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm
                    border border-gray-100 dark:border-gray-800">
                    <span className="flex items-center justify-center w-5 h-5 
                      bg-yellow-50 dark:bg-yellow-900/30 rounded-full">
                      <span className="text-base">☀️</span>
                    </span>
                    Full sun to partial shade
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm
                    border border-gray-100 dark:border-gray-800">
                    <span className="flex items-center justify-center w-5 h-5 
                      bg-blue-50 dark:bg-blue-900/30 rounded-full">
                      <span className="text-base">💧</span>
                    </span>
                    Regular watering
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm
                    border border-gray-100 dark:border-gray-800">
                    <span className="flex items-center justify-center w-5 h-5 
                      bg-amber-50 dark:bg-amber-900/30 rounded-full">
                      <span className="text-base">🪴</span>
                    </span>
                    Well-drained soil
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm
                    border border-gray-100 dark:border-gray-800">
                    <span className="flex items-center justify-center w-5 h-5 
                      bg-purple-50 dark:bg-purple-900/30 rounded-full">
                      <span className="text-base">📏</span>
                    </span>
                    Fast-growing
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm
                    border border-gray-100 dark:border-gray-800">
                    <span className="flex items-center justify-center w-5 h-5 
                      bg-pink-50 dark:bg-pink-900/30 rounded-full">
                      <span className="text-base">🌸</span>
                    </span>
                    Spring and summer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 