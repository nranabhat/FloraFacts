'use client'

import { Lobster } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useGallery } from '../context/GalleryContext'
import { useState } from 'react'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Gallery() {
  const { gallery, removeFromGallery } = useGallery()
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleDeleteClick = (index: number) => {
    setSelectedIndex(index)
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = () => {
    if (selectedIndex !== null) {
      setDeletingIndex(selectedIndex)
      setTimeout(() => {
        removeFromGallery(selectedIndex)
        setDeletingIndex(null)
      }, 300)
    }
    setShowConfirmDialog(false)
    setSelectedIndex(null)
  }

  const handleCancelDelete = () => {
    setShowConfirmDialog(false)
    setSelectedIndex(null)
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 mb-8 text-center`}>
        Your Plant Gallery
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item, index) => (
          <div 
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
              hover:shadow-xl transition-all duration-300
              border border-green-100 dark:border-gray-700
              ${deletingIndex === index ? 'scale-95 opacity-50' : ''}`}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={item.image}
                alt={item.plantInfo.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-xl font-semibold text-green-800 dark:text-green-500">
                  {item.plantInfo.name}
                </h2>
                <button
                  onClick={() => handleDeleteClick(index)}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 
                    dark:hover:text-red-400 transition-colors p-1"
                  title="Delete plant"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                {item.plantInfo.scientificName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {item.plantInfo.description}
              </p>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(item.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
          justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full
            shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Delete Plant?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to remove this plant from your gallery?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg
                  transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg
                  hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 