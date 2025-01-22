'use client'

import { useState } from 'react'
import PhotoHandler from './PhotoHandler'
import PlantInfoCard from './PlantInfoCard'
import { PlantInfo } from '../types/PlantInfo'
import Image from 'next/image'
import { useGallery } from '../context/GalleryContext'

const LoadingAnimation = () => (
  <div className="flex justify-center items-center py-4">
    <div className="relative w-12 h-12">
      {/* Spinning outer leaf */}
      <div className="absolute inset-0 animate-spin-slow">
        <div className="w-4 h-4 bg-green-400 dark:bg-green-500 
          rounded-full transform -translate-y-2
          shadow-lg"></div>
      </div>
      
      {/* Counter-spinning inner leaf */}
      <div className="absolute inset-0 animate-spin-reverse-slow">
        <div className="w-3 h-3 bg-green-500 dark:bg-green-600 
          rounded-full transform translate-y-2
          shadow-lg"></div>
      </div>
    </div>
  </div>
)

export default function PlantIdentifier() {
  const [image, setImage] = useState<string | null>(null)
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { addToGallery } = useGallery()

  const handleImageCapture = async (imageData: string) => {
    setImage(imageData)
    setSaved(false) // Reset saved state for new identification
    await identifyPlant(imageData)
  }

  const identifyPlant = async (base64Image: string) => {
    setIsLoading(true)
    setError(null)
    setPlantInfo(null)
    
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
        throw new Error(data.error || 'Failed to identify plant')
      }

      const parsedInfo = parseJsonResponse(data.responseText)
      setPlantInfo(parsedInfo)
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
    if (!image || !plantInfo) {
      console.log('Missing image or plantInfo:', { image: !!image, plantInfo: !!plantInfo })
      return
    }
    
    try {
      setIsSaving(true)
      console.log('Attempting to save to gallery:', { plantInfo })
      await addToGallery(image, plantInfo)
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
    setImage(null)
    setPlantInfo(null)
    setError(null)
    setSaved(false)
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
          currentImage={image}
        />

        {isLoading && <LoadingAnimation />}

        {error && (
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-red-500 dark:text-red-400 text-base">
              {error}
            </div>
          </div>
        )}

        {plantInfo && !isLoading && (
          <>
            <PlantInfoCard plantInfo={plantInfo} />
            
            <div className="flex gap-4 justify-center mt-6">
              {!saved ? (
                <button
                  onClick={handleSaveToGallery}
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
              ) : (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </span>
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
    </div>
  )
}