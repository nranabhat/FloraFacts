'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  reauthenticateWithPopup,
  updateProfile
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { doc, deleteDoc, collection, getDocs, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  deleteAccount: (password?: string) => Promise<void>
  updateUserEmail: (newEmail: string, password?: string) => Promise<void>
  reauthenticate: (password?: string) => Promise<void>
  updateDisplayName: (displayName: string) => Promise<void>
  updateProfileEmoji: (emoji: string) => Promise<void>
  userProfileEmoji: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProfileEmoji, setUserProfileEmoji] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Load profile emoji when user changes
  useEffect(() => {
    async function loadProfileEmoji() {
      if (user) {
        const profileRef = doc(db, 'users', user.uid, 'profile', 'info')
        const profileDoc = await getDoc(profileRef)
        if (profileDoc.exists() && profileDoc.data().profileEmoji) {
          setUserProfileEmoji(profileDoc.data().profileEmoji)
        } else {
          setUserProfileEmoji('👨') // Default emoji
        }
      } else {
        setUserProfileEmoji(null)
      }
    }
    loadProfileEmoji()
  }, [user])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Google Log In error:', error)
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Email Log In error:', error)
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Email sign up error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  const reauthenticate = async (password?: string) => {
    if (!user) throw new Error('No user logged in')

    try {
      if (user.providerData[0].providerId === 'google.com') {
        const provider = new GoogleAuthProvider()
        await reauthenticateWithPopup(user, provider)
      } else {
        if (!password) throw new Error('Password required')
        const credential = EmailAuthProvider.credential(user.email!, password)
        await reauthenticateWithCredential(user, credential)
      }
    } catch (error) {
      console.error('Reauthentication error:', error)
      throw error
    }
  }

  const updateUserEmail = async (newEmail: string, password?: string) => {
    if (!user) return

    try {
      await reauthenticate(password)
      await updateEmail(user, newEmail)
      
      // Update email in Firestore
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'info')
      await setDoc(userProfileRef, { email: newEmail }, { merge: true })
    } catch (error) {
      console.error('Email update error:', error)
      throw error
    }
  }

  const deleteAccount = async (password?: string) => {
    if (!user) return

    try {
      await reauthenticate(password)
      
      // Delete user data from Firestore
      const userRef = doc(db, 'users', user.uid)
      
      // Delete all plants
      const plantsRef = collection(userRef, 'plants')
      const plantsSnapshot = await getDocs(plantsRef)
      await Promise.all(plantsSnapshot.docs.map(doc => deleteDoc(doc.ref)))
      
      // Delete profile
      const profileRef = doc(userRef, 'profile', 'info')
      await deleteDoc(profileRef)
      
      // Delete user document
      await deleteDoc(userRef)
      
      // Delete Firebase Auth account
      await user.delete()
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  // Add validation function
  const validateDisplayName = (displayName: string): string | null => {
    if (displayName.length < 2) {
      return 'Display name must be at least 2 characters long'
    }
    if (displayName.length > 50) {
      return 'Display name must be less than 50 characters'
    }
    // Only allow letters, numbers, spaces, and common special characters
    if (!/^[a-zA-Z0-9\s._-]+$/.test(displayName)) {
      return 'Display name can only contain letters, numbers, spaces, dots, underscores, and hyphens'
    }
    return null
  }

  const updateDisplayName = async (displayName: string) => {
    if (!user) return

    const validationError = validateDisplayName(displayName)
    if (validationError) {
      throw new Error(validationError)
    }

    try {
      await updateProfile(user, { displayName })
      
      // Update display name in Firestore
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'info')
      await setDoc(userProfileRef, { displayName }, { merge: true })
    } catch (error) {
      console.error('Display name update error:', error)
      throw error
    }
  }

  const updateProfileEmoji = async (emoji: string) => {
    if (!user) return

    try {
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'info')
      await setDoc(userProfileRef, { profileEmoji: emoji }, { merge: true })
      setUserProfileEmoji(emoji) // Update local state
    } catch (error) {
      console.error('Emoji update error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
      resetPassword,
      deleteAccount,
      updateUserEmail,
      reauthenticate,
      updateDisplayName,
      updateProfileEmoji,
      userProfileEmoji
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 