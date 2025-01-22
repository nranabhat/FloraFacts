'use client'

import { Lobster } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useGallery } from '../context/GalleryContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import AuthModal from '../components/AuthModal'
import { LoadingSkeletonCard } from '../components/LoadingSkeleton'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Gallery() {
  const { user } = useAuth()
  const { gallery, removeFromGallery, loading } = useGallery()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (plantId: string) => {
    setSelectedPlantId(plantId)
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedPlantId) return

    try {
      setIsDeleting(true)
      await removeFromGallery(selectedPlantId)
    } catch (error) {
      console.error('Error deleting plant:', error)
    } finally {
      setIsDeleting(false)
      setShowConfirmDialog(false)
      setSelectedPlantId(null)
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 mb-8 text-center`}>
          Your Plant Gallery
        </h1>
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 space-y-4">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              No plants in your gallery yet!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sign in to start identifying and saving your plant discoveries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center justify-center px-6 py-3 
                  bg-green-600 text-white rounded-lg hover:bg-green-700 
                  transition-colors duration-200"
              >
                Log In to Get Started
              </button>
            </div>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    )
  }

  if (gallery.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 mb-8 text-center`}>
          Your Plant Gallery
        </h1>
        
        <div className="text-center py-12">
          <div className="mb-8">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-4">No Plants Yet!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start building your collection by identifying some plants.
            </p>
          </div>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center bg-green-600 dark:bg-green-700 
              text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 
              transition-colors duration-300"
          >
            Identify Your First Plant
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 mb-8 text-center`}>
          Your Plant Gallery
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 mb-8 text-center`}>
          Your Plant Gallery
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
                border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.plantInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {item.plantInfo.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                  {item.plantInfo.scientificName}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                  {item.plantInfo.description}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 
                      dark:hover:text-red-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add Plant Card */}
          <Link
            href="/"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
              border border-gray-200 dark:border-gray-700 transition-all
              hover:shadow-lg hover:border-green-300 dark:hover:border-green-600
              flex flex-col items-center justify-center min-h-[300px]
              group"
          >
            <div className="text-gray-400 dark:text-gray-500 group-hover:text-green-500 
              dark:group-hover:text-green-400 transition-colors">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="mt-4 text-gray-600 dark:text-gray-400 group-hover:text-green-600 
              dark:group-hover:text-green-400 transition-colors">
              Identify New Plant
            </span>
          </Link>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delete Plant
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this plant from your gallery?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 
                    hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg 
                    hover:bg-red-700 transition-colors disabled:opacity-50
                    disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent 
                        rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
} 