// app/page.tsx
'use client'

import { Lobster } from 'next/font/google'
import PlantIdentifier from './components/PlantIdentifier'
import Footer from './components/Footer'
import { useAuth } from './context/AuthContext'
import { useAuthModal } from './components/AuthModalProvider'
import { useRouter } from 'next/navigation'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})


export default function Home() {
  const { user } = useAuth()
  const { showModal } = useAuthModal()
  const router = useRouter()

  const handleTitleClick = () => {
    // Reload the page
    router.refresh()
  }

  const handleGetStarted = () => {
    showModal('signup')
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
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Card 1 */}
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

              {/* Card 2 */}
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

              {/* Card 3 */}
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

            {/* CTA Section - Only show if user is not logged in */}
            {!user && (
              <div className="text-center py-8 px-4 bg-gradient-to-b from-green-50 to-white 
                dark:from-gray-800 dark:to-gray-800/95 rounded-2xl border-2 border-green-100 
                dark:border-green-900 shadow-lg transform hover:shadow-xl transition-all duration-300">
                <h3 className={`${lobster.className} text-2xl text-green-800 dark:text-green-500 mb-3`}>
                  Join FloraFacts Today!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
                  Create your free account to save plants, build your personal collection, 
                  and access your plant information anywhere.
                </p>
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg 
                    hover:bg-green-700 transition-all duration-300 
                    transform hover:scale-105 hover:shadow-md
                    font-medium text-lg"
                >
                  Get Started - It&apos;s Free
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}