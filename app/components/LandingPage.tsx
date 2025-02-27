'use client'

import { Lobster } from 'next/font/google'
import { useAuthModal } from '../components/AuthModalProvider'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const REVIEWS = [
  {
    name: "Sarah Johnson",
    role: "Home Gardener",
    emoji: "🐱",
    content: "FloraFacts has completely transformed how I care for my plants. The instant identification and care tips are incredibly accurate!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Plant Enthusiast",
    emoji: "🐰",
    content: "As someone who loves discovering new plants, this app is a game-changer. The AI is surprisingly accurate and the care guides are detailed.",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Botanical Student",
    emoji: "🐼",
    content: "I use FloraFacts daily for my studies. It's not just an identification tool - it's a comprehensive plant encyclopedia!",
    rating: 5
  },
  {
    name: "David Wilson",
    role: "Urban Farmer",
    emoji: "🐨",
    content: "The accuracy of plant identification is mind-blowing! It's helped me maintain my rooftop garden with confidence.",
    rating: 5
  },
  {
    name: "Lisa Martinez",
    role: "Interior Designer",
    emoji: "🐸",
    content: "Perfect for my work! I use it to help clients choose and care for indoor plants. The care guides are invaluable.",
    rating: 5
  }
]

export default function LandingPage() {
  const { showModal } = useAuthModal()
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typical mobile breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Desktop scrolling animation
  useEffect(() => {
    if (!scrollRef.current || isPaused || isMobile) return
    
    let animationFrameId: number
    let scrollPosition = 0
    
    const scroll = () => {
      if (!scrollRef.current || isPaused) return
      
      scrollPosition += 0.5
      if (scrollPosition >= scrollRef.current.scrollWidth / 2) {
        scrollPosition = 0
      }
      
      scrollRef.current.scrollLeft = scrollPosition
      animationFrameId = requestAnimationFrame(scroll)
    }
    
    animationFrameId = requestAnimationFrame(scroll)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPaused, isMobile])

  // Mobile swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isMobile) return
      setCurrentIndex((prev) => (prev + 1) % REVIEWS.length)
    },
    onSwipedRight: () => {
      if (!isMobile) return
      setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)
    }
  })

  const handleGetStarted = () => {
    showModal('signup')
  }

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
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

                  {/* Plant Details Grid - Updated to horizontal layout */}
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 text-center mb-12`}>
          Why Choose FloraFacts?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 space-y-4">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Instant Identification
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced AI technology identifies plants in seconds with high accuracy.
            </p>
          </div>
          <div className="text-center p-6 space-y-4">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Detailed Care Guides
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get expert care instructions tailored to each plant's needs.
            </p>
          </div>
          <div className="text-center p-6 space-y-4">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Personal Plant Gallery
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Build and track your plant collection with our digital garden tool.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 overflow-hidden">
        <h2 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 text-center mb-12`}>
          What Our Users Say
        </h2>
        {isMobile ? (
          // Mobile swipeable reviews
          <div {...handlers} className="touch-pan-y">
            <div className="relative w-full max-w-sm mx-auto">
              <div 
                key={`mobile-${currentIndex}`}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg
                  border border-green-100 dark:border-green-900
                  transform transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-green-50 dark:bg-green-900/30 
                    rounded-full text-2xl">
                    {REVIEWS[currentIndex].emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {REVIEWS[currentIndex].name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {REVIEWS[currentIndex].role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {REVIEWS[currentIndex].content}
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(REVIEWS[currentIndex].rating)].map((_, i) => (
                    <span key={i} role="img" aria-label="star">⭐</span>
                  ))}
                </div>
              </div>
              
              {/* Mobile pagination dots */}
              <div className="flex justify-center gap-2 mt-4">
                {REVIEWS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-green-600 w-4' 
                        : 'bg-green-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Desktop scrolling reviews with CSS animation
          <div 
            className="relative w-full"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
          >
            <div 
              className="flex gap-8 animate-scroll hover:[animation-play-state:paused]"
            >
              {/* First set of reviews */}
              {REVIEWS.map((review, index) => (
                <div 
                  key={`first-${index}`}
                  className="flex-shrink-0 w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg
                    border border-green-100 dark:border-green-900
                    transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-50 dark:bg-green-900/30 
                      rounded-full text-2xl">
                      {review.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {review.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {review.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {review.content}
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} role="img" aria-label="star">⭐</span>
                    ))}
                  </div>
                </div>
              ))}
              {/* Second set of reviews for seamless loop */}
              {REVIEWS.map((review, index) => (
                <div 
                  key={`second-${index}`}
                  className="flex-shrink-0 w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg
                    border border-green-100 dark:border-green-900
                    transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-50 dark:bg-green-900/30 
                      rounded-full text-2xl">
                      {review.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {review.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {review.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {review.content}
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} role="img" aria-label="star">⭐</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 text-center mb-12`}>
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg 
            transform hover:-translate-y-1 transition-all duration-300
            border border-green-100 dark:border-gray-700">
            <div className="text-3xl mb-3">📸</div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-500 mb-2">
              Snap or Upload
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Take a photo of any plant or upload from your gallery. Quick, easy, and ready for identification!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg 
            transform hover:-translate-y-1 transition-all duration-300
            border border-green-100 dark:border-gray-700">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-500 mb-2">
              AI Magic
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Our AI instantly identifies your plant and provides detailed information and care recommendations.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg 
            transform hover:-translate-y-1 transition-all duration-300
            border border-green-100 dark:border-gray-700">
            <div className="text-3xl mb-3">🌿</div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-500 mb-2">
              Save & Learn
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Build your plant collection, track discoveries, and access detailed care guides anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center py-12 px-4 bg-gradient-to-b from-green-50 to-white 
          dark:from-gray-800 dark:to-gray-800/95 rounded-2xl border-2 border-green-100 
          dark:border-green-900 shadow-lg">
          <h2 className={`${lobster.className} text-3xl text-green-800 dark:text-green-500 mb-4`}>
            Join FloraFacts Today!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
            Create your free account to start identifying plants, building your collection, 
            and accessing expert care guides.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-green-600 text-white rounded-lg 
              hover:bg-green-700 transition-all duration-300 
              transform hover:scale-105 hover:shadow-md
              font-medium text-lg"
          >
            Get Started - It's Free
          </button>
        </div>
      </section>
    </div>
  )
} 