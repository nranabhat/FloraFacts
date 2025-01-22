'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { PlantInfo } from '../types/PlantInfo'
import { useAuth } from './AuthContext'
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import toast from 'react-hot-toast'

// Define the structure of a gallery item
export interface GalleryItem {
  id: string
  image: string
  plantInfo: PlantInfo
  timestamp: Date
}

// Define the context structure
interface GalleryContextType {
  gallery: GalleryItem[]
  addToGallery: (image: string, plantInfo: PlantInfo) => Promise<void>
  removeFromGallery: (plantId: string) => Promise<void>
  clearGallery: () => Promise<void>
  loading: boolean
}

// Create context with undefined check
const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

// Props interface for the provider
interface GalleryProviderProps {
  children: ReactNode
}

export function GalleryProvider({ children }: GalleryProviderProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load gallery from Firestore when user changes
  useEffect(() => {
    async function loadGallery() {
      if (!user) {
        console.log('No user, clearing gallery')
        setGallery([])
        setLoading(false)
        return
      }

      try {
        console.log('Loading gallery for user:', user.uid)
        setLoading(true)
        const plantsRef = collection(db, 'users', user.uid, 'plants')
        const q = query(plantsRef, orderBy('timestamp', 'desc'))
        const querySnapshot = await getDocs(q)
        
        console.log('Found documents:', querySnapshot.size)
        const plants = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            image: data.image,
            plantInfo: data.plantInfo as PlantInfo,
            timestamp: (data.timestamp as Timestamp).toDate()
          }
        })

        console.log('Processed plants:', plants)
        setGallery(plants)
      } catch (error) {
        console.error('Error loading gallery:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGallery()
  }, [user])

  const addToGallery = async (image: string, plantInfo: PlantInfo): Promise<void> => {
    if (!user) {
      console.log('No user found, cannot add to gallery')
      return
    }

    try {
      console.log('Adding plant to gallery:', { 
        userId: user.uid,
        userEmail: user.email,
        plantInfo 
      })

      // Check if plant already exists
      const isDuplicate = gallery.some(item => 
        item.plantInfo.name === plantInfo.name && 
        item.plantInfo.scientificName === plantInfo.scientificName
      )

      if (isDuplicate) {
        console.log('Plant is duplicate, skipping')
        return
      }

      // Create a new document reference with auto-generated ID
      const plantsRef = collection(db, 'users', user.uid, 'plants')
      const newPlantRef = doc(plantsRef)
      
      const plantData = {
        image,
        plantInfo,
        timestamp: serverTimestamp()
      }

      console.log('About to save plant data:', {
        path: `users/${user.uid}/plants/${newPlantRef.id}`,
        data: plantData
      })

      await setDoc(newPlantRef, plantData)
      toast.success('Plant added to gallery')

      // Update local state
      setGallery(prev => [{
        id: newPlantRef.id,
        image,
        plantInfo,
        timestamp: new Date()
      }, ...prev])

      // Update user profile if it doesn't exist
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'info')
      await setDoc(userProfileRef, {
        email: user.email
      }, { merge: true })

    } catch (error) {
      toast.error('Failed to add plant to gallery')
      console.error('Error adding to gallery:', error)
      throw error
    }
  }

  const removeFromGallery = async (plantId: string): Promise<void> => {
    if (!user) return

    try {
      const plantRef = doc(db, 'users', user.uid, 'plants', plantId)
      await deleteDoc(plantRef)
      toast.success('Plant removed from gallery')

      // Update local state
      setGallery(prev => prev.filter(item => item.id !== plantId))
    } catch (error) {
      toast.error('Failed to remove plant')
      console.error('Error removing from gallery:', error)
      throw error
    }
  }

  const clearGallery = async (): Promise<void> => {
    if (!user) return

    try {
      const plantsRef = collection(db, 'users', user.uid, 'plants')
      const querySnapshot = await getDocs(plantsRef)
      
      // Delete all plant documents
      await Promise.all(
        querySnapshot.docs.map(doc => deleteDoc(doc.ref))
      )

      setGallery([])
    } catch (error) {
      console.error('Error clearing gallery:', error)
      throw error
    }
  }

  const value: GalleryContextType = {
    gallery,
    addToGallery,
    removeFromGallery,
    clearGallery,
    loading
  }

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  )
}

export function useGallery(): GalleryContextType {
  const context = useContext(GalleryContext)
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider')
  }
  return context
} 