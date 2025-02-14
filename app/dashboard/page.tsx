'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import PlantIdentifier from '../components/PlantIdentifier'
import { Lobster } from 'next/font/google'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <button 
        onClick={() => router.refresh()}
        className={`${lobster.className} text-5xl text-green-800 dark:text-green-500 text-center mb-8 
          relative cursor-pointer
          after:content-[''] after:absolute after:-bottom-2 after:left-0 after:right-0
          after:h-1 after:bg-green-600 dark:after:bg-green-400 after:rounded-full after:transform after:scale-x-75
          hover:scale-105 transition-transform duration-300
          focus:outline-none
        `}
      >
        FloraFacts
      </button>
      <div className="w-full max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-8rem)] flex justify-center">
        <PlantIdentifier />
      </div>
    </div>
  )
} 