'use client'

import { Lobster } from 'next/font/google'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function HowItWorksSection() {
  return (
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
  )
} 