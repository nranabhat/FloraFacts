'use client'

import { useEffect, useState } from 'react'

const PLANT_SEQUENCE = ['🌱', '🌿', '🌸', '🌺', '🌻', '🌹']
const LOADING_MESSAGES = [
  "Analyzing your plant...",
  "Identifying species...",
  "Gathering plant details...",
  "Almost there..."
]

export default function GardenLoadingBar() {
  const [plantIndex, setPlantIndex] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    // Progress the plants
    const plantInterval = setInterval(() => {
      setPlantIndex(prev => (prev + 1) % PLANT_SEQUENCE.length)
    }, 600)

    // Change messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length)
    }, 2000)

    return () => {
      clearInterval(plantInterval)
      clearInterval(messageInterval)
    }
  }, [])

  return (
    <div className="space-y-4 w-full">
      {/* Loading message */}
      <div className="text-center text-gray-600 dark:text-gray-300 animate-pulse">
        {LOADING_MESSAGES[messageIndex]}
      </div>

      {/* Garden bar */}
      <div className="bg-green-50 dark:bg-gray-700 rounded-lg p-3 
        border-2 border-green-100 dark:border-green-900">
        <div className="flex justify-around items-center">
          {PLANT_SEQUENCE.map((plant, index) => (
            <span 
              key={index}
              className={`text-2xl transition-all duration-300 transform
                ${index <= plantIndex 
                  ? 'opacity-100 scale-110' 
                  : 'opacity-30 scale-90'}`}
            >
              {plant}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
} 