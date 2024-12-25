'use client'

import { useState } from 'react'
import PhotoHandler from './PhotoHandler'
import PlantInfoCard from './PlantInfoCard'
import { PlantInfo } from '../types/PlantInfo'
import Image from 'next/image'
import { useGallery } from '../context/GalleryContext'

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
    
    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to identify plant')
      }

      const { responseText } = await response.json()
      const parsedInfo = parseJsonResponse(responseText)
      
      setPlantInfo(parsedInfo)
      addToGallery(base64Image, parsedInfo)
    } catch (err) {
      console.error('Plant Identification Error:', err)
      
      if (err instanceof Error) {
        setError(err.message === 'Failed to fetch' 
          ? 'Network error. Please check your internet connection.' 
          : err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
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
      <div className="w-full bg-white rounded-xl shadow-lg p-4 space-y-3">
        <PhotoHandler 
          onImageCapture={handleImageCapture}
          currentImage={image}
        />

        {isLoading && (
          <div className="text-center text-green-600 text-base">
            Identifying plant...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center text-base">
            {error}
          </div>
        )}

        {plantInfo && !isLoading && <PlantInfoCard plantInfo={plantInfo} />}
      </div>
    </div>
  )
}