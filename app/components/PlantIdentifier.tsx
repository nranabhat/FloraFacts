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

  const { addToGallery } = useGallery()

  const handleImageCapture = async (imageData: string) => {
    setImage(imageData)
    await identifyPlant(imageData)
  }

  const identifyPlant = async (base64Image: string) => {
    setIsLoading(true)
    setError(null)
    setPlantInfo(null) // Reset plant info when starting new identification
    
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
      addToGallery(base64Image, parsedInfo)
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

        {plantInfo && !isLoading && <PlantInfoCard plantInfo={plantInfo} />}
      </div>
    </div>
  )
}