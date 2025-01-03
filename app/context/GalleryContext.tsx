'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { PlantInfo } from '../types/PlantInfo'

interface GalleryItem {
  image: string
  plantInfo: PlantInfo
  timestamp: Date
}

interface GalleryContextType {
  gallery: GalleryItem[]
  addToGallery: (image: string, plantInfo: PlantInfo) => void
  removeFromGallery: (index: number) => void
  clearGallery: () => void
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

interface GalleryItemParsed {
  image: string;
  plantInfo: PlantInfo;
  timestamp: string;
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  // Load gallery from localStorage on mount
  useEffect(() => {
    const savedGallery = localStorage.getItem('plantGallery')
    if (savedGallery) {
      try {
        const parsed = JSON.parse(savedGallery) as GalleryItemParsed[]
        const galleryWithDates = parsed.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        setGallery(galleryWithDates)
      } catch (error) {
        console.error('Error loading gallery:', error)
      }
    }
  }, [])

  const addToGallery = (image: string, plantInfo: PlantInfo) => {
    // Check if plant already exists in gallery
    const isDuplicate = gallery.some(item => 
      item.plantInfo.name === plantInfo.name && 
      item.plantInfo.scientificName === plantInfo.scientificName
    )

    // If it's a duplicate, don't add it
    if (isDuplicate) {
      return
    }

    const newGallery = [...gallery, {
      image,
      plantInfo,
      timestamp: new Date()
    }]
    setGallery(newGallery)
    
    try {
      localStorage.setItem('plantGallery', JSON.stringify(newGallery))
    } catch (error) {
      console.error('Error saving to gallery:', error)
    }
  }

  const removeFromGallery = (index: number) => {
    const newGallery = gallery.filter((_, i) => i !== index)
    setGallery(newGallery)
    try {
      localStorage.setItem('plantGallery', JSON.stringify(newGallery))
    } catch (error) {
      console.error('Error saving to gallery:', error)
    }
  }

  const clearGallery = () => {
    setGallery([])
    localStorage.removeItem('plantGallery')
  }

  return (
    <GalleryContext.Provider value={{ 
      gallery, 
      addToGallery, 
      removeFromGallery,
      clearGallery 
    }}>
      {children}
    </GalleryContext.Provider>
  )
}

export function useGallery() {
  const context = useContext(GalleryContext)
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider')
  }
  return context
} 