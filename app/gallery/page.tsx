'use client'

import { Lobster } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useGallery } from '../context/GalleryContext'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Gallery() {
  const { gallery } = useGallery()

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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
              hover:shadow-xl transition-shadow duration-300
              border border-green-100 dark:border-gray-700"
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
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-500 mb-1">
                {item.plantInfo.name}
              </h2>
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
    </div>
  )
} 