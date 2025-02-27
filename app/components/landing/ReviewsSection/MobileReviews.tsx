import { useSwipeable } from 'react-swipeable'
import { REVIEWS } from '../../../data/reviews'

interface MobileReviewsProps {
  currentIndex: number
  setCurrentIndex: (index: number) => void
}

export default function MobileReviews({ currentIndex, setCurrentIndex }: MobileReviewsProps) {
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentIndex((currentIndex + 1) % REVIEWS.length)
    },
    onSwipedRight: () => {
      setCurrentIndex((currentIndex - 1 + REVIEWS.length) % REVIEWS.length)
    }
  })

  return (
    <div {...handlers} className="touch-pan-y">
      <div className="relative w-full max-w-sm mx-auto">
        <div 
          key={`mobile-${currentIndex}`}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg
            border border-green-100 dark:border-green-900
            transform transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-green-50 dark:bg-green-900/30 
              rounded-full text-2xl">
              {REVIEWS[currentIndex].emoji}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                {REVIEWS[currentIndex].name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {REVIEWS[currentIndex].role}
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {REVIEWS[currentIndex].content}
          </p>
          <div className="flex text-yellow-400">
            {[...Array(REVIEWS[currentIndex].rating)].map((_, i) => (
              <span key={i} role="img" aria-label="star">⭐</span>
            ))}
          </div>
        </div>
        
        {/* Mobile pagination dots */}
        <div className="flex justify-center gap-2 mt-4">
          {REVIEWS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-green-600 w-4' 
                  : 'bg-green-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 