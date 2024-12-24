'use client'

import { useState, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import PhotoHandler from './PhotoHandler'
import PlantInfoCard from './PlantInfoCard'
import { PlantInfo } from '../types/PlantInfo'
import Image from 'next/image'

export default function PlantIdentifier() {
  const [image, setImage] = useState<string | null>(null)
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleImageCapture = async (imageData: string) => {
    setImage(imageData)
    await identifyPlant(imageData)
  }

  const identifyPlant = async (base64Image: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured')
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      })
      
      // Updated prompt to request more structured JSON
      const prompt = `
        Analyze this plant image and return ONLY a JSON object with the following structure:
        {
          "name": "Common name of the plant",
          "scientificName": "Full botanical/Latin name",
          "description": "Brief, concise description (1-2 sentences max)",
          "careInstructions": "Key care tips",
          "additionalDetails": {
            "nativeTo": "Region of origin",
            "sunExposure": "Light requirements",
            "waterNeeds": "Watering frequency",
            "soilType": "Preferred soil conditions",
            "growthRate": "Typical growth characteristics",
            "bloomSeason": "Flowering period"
          }
        }

        Important: 
        - Respond ONLY with valid, parseable JSON
        - Keep description very concise
        - Provide practical, actionable details
      `
      
      const base64Data = base64Image.split(',')[1]
      
      const result = await model.generateContent({
        contents: [{ 
          role: 'user', 
          parts: [
            { text: prompt },
            { inlineData: { 
              mimeType: 'image/jpeg', 
              data: base64Data 
            }}
          ]
        }]
      })

      const responseText = result.response.text()
      
      const parsedInfo = parseJsonResponse(responseText)
      
      setPlantInfo(parsedInfo)
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Important: Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              resolve(true);
            };
          }
        });
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

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