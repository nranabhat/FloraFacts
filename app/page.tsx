// app/page.tsx
'use client'

import { Lobster } from 'next/font/google'
import PlantIdentifier from './components/PlantIdentifier'
import Footer from './components/Footer'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Home() {
  const handleTitleClick = () => {
    // Reload the page
    window.location.reload()
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <main className="flex-1">
        <div className="flex flex-col items-center justify-center p-8">
          <button 
            onClick={handleTitleClick}
            className={`${lobster.className} text-5xl text-green-800 dark:text-green-500 text-center mb-8 
              relative cursor-pointer
              after:content-[''] after:absolute after:-bottom-2 after:left-0 after:right-0
              after:h-1 after:bg-green-600 dark:after:bg-green-400 after:rounded-full after:transform after:scale-x-75
              hover:scale-105 transition-transform duration-300
              focus:outline-none
            `}
          >
            FloraFacts
          </button>
          <div className="w-full max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-8rem)] flex justify-center">
            <PlantIdentifier />
          </div>

          {/* How It Works Section */}
          <div className="mt-16 w-full max-w-4xl">
            <h2 className={`${lobster.className} text-3xl text-green-800 dark:text-green-500 text-center mb-8`}>
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg 
                transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-500 mb-2">
                  Snap or Upload
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Take a photo of any plant that catches your eye, or upload one from your garden adventures!
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg 
                transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-500 mb-2">
                  AI Magic
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Our plant-loving AI analyzes your photo faster than you can say &quot;photosynthesis&quot;!
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg 
                transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">🌿</div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-500 mb-2">
                  Plant Paradise
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Get instant info about your plant, from care tips to fun facts. No green thumb required!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}