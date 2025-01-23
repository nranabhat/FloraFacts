import { PlantInfo } from '../types/PlantInfo'

interface PlantInfoCardProps {
  plantInfo: PlantInfo
}

// Add emoji mapping for each detail type
const DETAIL_EMOJIS: Record<string, string> = {
  nativeTo: "🌍",
  sunExposure: "☀️",
  waterNeeds: "💧",
  soilType: "🪴",
  growthRate: "📏",
  bloomSeason: "🌸"
}

export default function PlantInfoCard({ plantInfo }: PlantInfoCardProps) {
  return (
    <div className="space-y-6 bg-gradient-to-b from-green-50 to-white 
      dark:from-gray-800 dark:to-gray-800/95 p-6 rounded-xl
      border-2 border-green-100 dark:border-green-900 shadow-lg
      transition-all duration-200 hover:shadow-xl">
      
      {/* Plant Name Section */}
      <div className="text-center space-y-2 pb-4 border-b-2 border-green-100 dark:border-green-900/50">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 
          dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
          {plantInfo.name}
        </h2>
        <p className="font-serif italic text-green-600/80 dark:text-green-400/80 text-sm">
          {plantInfo.scientificName}
        </p>
      </div>

      {/* Description Section */}
      <div className="relative px-4 py-3 bg-white/50 dark:bg-gray-900/30 rounded-lg
        border border-green-100 dark:border-green-900">
        <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-green-100 dark:bg-green-900 
          text-green-800 dark:text-green-200 text-xs rounded-full">
          About this plant
        </span>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {plantInfo.description}
        </p>
      </div>

      {/* Details Grid - changed from 2 columns to 1 */}
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(plantInfo.additionalDetails).map(([key, value]) => (
          value && (
            <div key={key} 
              className="flex items-start gap-3 p-3 bg-white/70 dark:bg-gray-900/30 
                rounded-lg border border-green-100 dark:border-green-900
                hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-2xl" role="img" aria-label={key}>
                {DETAIL_EMOJIS[key]}
              </span>
              <div className="min-w-0">
                <dt className="text-sm font-medium text-green-800 dark:text-green-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </dt>
                <dd className="text-gray-700 dark:text-gray-300 text-sm truncate">
                  {value}
                </dd>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Care Instructions Section */}
      {plantInfo.careInstructions && (
        <div className="relative px-4 py-4 bg-white/50 dark:bg-gray-900/30 rounded-lg
          border border-green-100 dark:border-green-900">
          <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-green-100 dark:bg-green-900 
            text-green-800 dark:text-green-200 text-xs rounded-full">
            Care Guide
          </span>
          <div className="flex gap-3">
            <span className="text-2xl" role="img" aria-label="care">🌱</span>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {plantInfo.careInstructions}
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 