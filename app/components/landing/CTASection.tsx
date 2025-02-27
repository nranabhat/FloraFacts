'use client'

import { Lobster } from 'next/font/google'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

interface CTASectionProps {
  handleGetStarted: () => void
}

export default function CTASection({ handleGetStarted }: CTASectionProps) {
  return (
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
  )
} 