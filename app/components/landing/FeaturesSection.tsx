'use client'

import { Lobster } from 'next/font/google'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function FeaturesSection() {
  return (
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
  )
} 