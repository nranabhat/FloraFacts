import { REVIEWS } from '../../../data/reviews'
import ReviewCard from './ReviewCard'

export default function DesktopReviews() {
  return (
    <div 
      className="relative w-full"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <div className="flex gap-8 animate-scroll hover:[animation-play-state:paused]">
        {/* First set of reviews */}
        {REVIEWS.map((review, index) => (
          <ReviewCard
            key={`first-${index}`}
            name={review.name}
            role={review.role}
            emoji={review.emoji}
            content={review.content}
            rating={review.rating}
          />
        ))}
        
        {/* Second set of reviews for seamless loop */}
        {REVIEWS.map((review, index) => (
          <ReviewCard
            key={`second-${index}`}
            name={review.name}
            role={review.role}
            emoji={review.emoji}
            content={review.content}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  )
} 