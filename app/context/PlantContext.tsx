'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { PlantInfo } from '../types/PlantInfo'

interface PlantContextType {
  currentPlant: {
    image: string | null
    plantInfo: PlantInfo | null
  }
  setCurrentPlant: (image: string | null, plantInfo: PlantInfo | null) => void
  clearCurrentPlant: () => void
}

const PlantContext = createContext<PlantContextType | undefined>(undefined)

export function PlantProvider({ children }: { children: ReactNode }) {
  const [currentPlant, setCurrentPlant] = useState<{
    image: string | null
    plantInfo: PlantInfo | null
  }>({
    image: null,
    plantInfo: null
  })

  const setCurrentPlantData = (image: string | null, plantInfo: PlantInfo | null) => {
    setCurrentPlant({ image, plantInfo })
  }

  const clearCurrentPlant = () => {
    setCurrentPlant({ image: null, plantInfo: null })
  }

  return (
    <PlantContext.Provider value={{
      currentPlant,
      setCurrentPlant: setCurrentPlantData,
      clearCurrentPlant
    }}>
      {children}
    </PlantContext.Provider>
  )
}

export function usePlant() {
  const context = useContext(PlantContext)
  if (context === undefined) {
    throw new Error('usePlant must be used within a PlantProvider')
  }
  return context
} 