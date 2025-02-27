import React from 'react'

interface ReviewCardProps {
  name: string
  role: string
  emoji: string
  content: string
  rating: number
}

export default function ReviewCard({ name, role, emoji, content, rating }: ReviewCardProps) {
  return (
    <div className="flex-shrink-0 w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg
      border border-green-100 dark:border-green-900
      transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 flex items-center justify-center bg-green-50 dark:bg-green-900/30 
          rounded-full text-2xl">
          {emoji}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {role}
          </p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {content}
      </p>
      <div className="flex text-yellow-400">
        {[...Array(rating)].map((_, i) => (
          <span key={i} role="img" aria-label="star">⭐</span>
        ))}
      </div>
    </div>
  )
} 