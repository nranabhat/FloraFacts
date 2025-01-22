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
  Timestamp 
} from 'firebase/firestore'
import { db } from '../lib/firebase'

interface GalleryItem {
  id: string
  image: string
  plantInfo: PlantInfo
  timestamp: Date
}

interface GalleryContextType {
  gallery: GalleryItem[]
  addToGallery: (image: string, plantInfo: PlantInfo) => Promise<void>
  removeFromGallery: (plantId: string) => Promise<void>
  clearGallery: () => Promise<void>
  loading: boolean
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

export function GalleryProvider({ children }: { children: ReactNode }) {
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
        const plants = querySnapshot.docs.map(doc => ({
          id: doc.id,
          image: doc.data().image,
          plantInfo: doc.data().plantInfo,
          timestamp: (doc.data().timestamp as Timestamp).toDate()
        }))

        console.log('Processed plants:', plants)
        setGallery(plants)
      } catch (error) {
        console.error('Error loading gallery. Full error:', error)
        console.error('Error message:', error.message)
        console.error('Error code:', error.code)
      } finally {
        setLoading(false)
      }
    }

    loadGallery()
  }, [user])

  const addToGallery = async (image: string, plantInfo: PlantInfo) => {
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
      console.log('Plant saved successfully with ID:', newPlantRef.id)

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
      console.error('Detailed gallery error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof Error ? (error as any).code : undefined,
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  }

  const removeFromGallery = async (plantId: string) => {
    if (!user) return

    try {
      const plantRef = doc(db, 'users', user.uid, 'plants', plantId)
      await deleteDoc(plantRef)

      // Update local state
      setGallery(prev => prev.filter(item => item.id !== plantId))
    } catch (error) {
      console.error('Error removing from gallery:', error)
      throw error
    }
  }

  const clearGallery = async () => {
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

  return (
    <GalleryContext.Provider value={{ 
      gallery, 
      addToGallery, 
      removeFromGallery,
      clearGallery,
      loading
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