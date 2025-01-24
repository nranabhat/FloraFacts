'use client'

import { useState } from 'react'
import PhotoHandler from './PhotoHandler'
import PlantInfoCard from './PlantInfoCard'
import { PlantInfo } from '../types/PlantInfo'
import Image from 'next/image'
import { useGallery } from '../context/GalleryContext'
import toast from 'react-hot-toast'
import { usePlant } from '../context/PlantContext'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import GardenLoadingBar from './GardenLoadingBar'
import Link from 'next/link'

export default function PlantIdentifier() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSaveTooltip, setShowSaveTooltip] = useState(false)

  const { currentPlant, setCurrentPlant } = usePlant()
  const { addToGallery } = useGallery()
  const { user } = useAuth()

  const handleImageCapture = async (imageData: string) => {
    setCurrentPlant(imageData, null)
    setSaved(false)
    await identifyPlant(imageData)
  }

  const identifyPlant = async (base64Image: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to identify plant')
        throw new Error(data.error || 'Failed to identify plant')
      }

      toast.success('Plant identified successfully!')

      const parsedInfo = parseJsonResponse(data.responseText)
      setCurrentPlant(base64Image, parsedInfo)
    } catch (err) {
      console.error('Plant Identification Error:', err)
      
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(
        errorMessage === 'Rats! We couldn\'t find a plant in this image. Please try again.' 
          ? errorMessage 
          : 'Rats! We couldn\'t find a plant in this image. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToGallery = async () => {
    if (!currentPlant.image || !currentPlant.plantInfo) {
      console.log('Missing image or plantInfo:', { image: !!currentPlant.image, plantInfo: !!currentPlant.plantInfo })
      return
    }
    
    try {
      setIsSaving(true)
      console.log('Attempting to save to gallery:', { plantInfo: currentPlant.plantInfo })
      await addToGallery(currentPlant.image, currentPlant.plantInfo)
      setSaved(true)
    } catch (error) {
      console.error('Detailed save error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      setError('Failed to save to gallery. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleIdentifyAnother = () => {
    setCurrentPlant(null, null)
    setError(null)
    setSaved(false)
  }

  const handleSaveClick = () => {
    if (!user) {
      setShowSaveTooltip(true)
      setTimeout(() => setShowSaveTooltip(false), 3000)
      return
    }

    handleSaveToGallery()
  }

  // JSON parsing function with error handling
  const parseJsonResponse = (responseText: string): PlantInfo => {
    try {
      // Remove any code block markers or extra text
      const jsonMatch = responseText.match(/```json?\n?([\s\S]*?)```/i) || 
                        responseText.match(/({[\s\S]*?})/);
      
      const cleanedText = jsonMatch ? jsonMatch[1] : responseText;
      
      // Parse the JSON
      const parsedData = JSON.parse(cleanedText);
      
      // Validate the structure
      return {
        name: parsedData.name || 'Unknown Plant',
        scientificName: parsedData.scientificName || 'N/A',
        description: parsedData.description || 'No description available',
        careInstructions: parsedData.careInstructions || 'No care instructions found',
        additionalDetails: parsedData.additionalDetails || {}
      };
    } catch (error) {
      console.error('JSON Parsing Error:', error);
      
      // Fallback in case of parsing failure
      return {
        name: 'Plant Identification Error',
        scientificName: 'N/A',
        description: 'Unable to parse plant information',
        careInstructions: 'Please try uploading the image again',
        additionalDetails: {}
      };
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Left vine */}
      <div className="absolute -left-16 top-0 h-full w-16 hidden md:block">
        <div className="relative h-full w-full">
          <Image
            src="/vine-border.svg"
            alt="Decorative vine"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Right vine - flipped horizontally */}
      <div className="absolute -right-16 top-0 h-full w-16 hidden md:block">
        <div className="relative h-full w-full">
          <Image
            src="/vine-border.svg"
            alt="Decorative vine"
            fill
            className="object-contain scale-x-[-1]"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-3 
        border border-green-100 dark:border-gray-700 transition-colors duration-200">
        <PhotoHandler 
          onImageCapture={handleImageCapture}
          currentImage={currentPlant.image}
        />

        {isLoading && (
          <div className="p-8">
            <GardenLoadingBar />
          </div>
        )}

        {error && (
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-red-500 dark:text-red-400 text-base">
              {error}
            </div>
          </div>
        )}

        {currentPlant.plantInfo && !isLoading && (
          <>
            <PlantInfoCard plantInfo={currentPlant.plantInfo} />
            
            <div className="flex justify-center gap-4 mt-6">
              {!saved ? (
                <div className="relative">
                  {showSaveTooltip && !user && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 
                      bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg
                      border border-green-100 dark:border-green-900 w-72 text-center
                      text-sm text-gray-600 dark:text-gray-300"
                    >
                      ✨ 
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="inline-flex items-center gap-1 font-medium 
                          text-green-600 dark:text-green-400 hover:underline"
                      >
                        Sign up
                      </button>
                      {' '}to save this plant and start your collection!
                    </div>
                  )}
                  
                  <button
                    onClick={handleSaveClick}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg 
                      hover:bg-green-700 transition-colors disabled:opacity-50
                      disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent 
                          rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : !user ? (
                      <>
                        <span>🔒</span>
                        Save to Gallery
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save to Gallery
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/gallery"
                    className="px-4 py-2 bg-green-100 dark:bg-green-900/30 
                      text-green-700 dark:text-green-300 rounded-lg
                      hover:bg-green-200 dark:hover:bg-green-800/30 
                      transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View in Gallery
                  </Link>
                </div>
              )}
              
              <button
                onClick={handleIdentifyAnother}
                className="px-4 py-2 border border-green-600 text-green-600 
                  dark:border-green-400 dark:text-green-400 rounded-lg
                  hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                Identify Another
              </button>
            </div>
          </>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </div>
  )
}