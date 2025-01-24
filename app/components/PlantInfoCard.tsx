import { PlantInfo } from '../types/PlantInfo'

interface PlantInfoCardProps {
  plantInfo: PlantInfo
}

// Add emoji mapping with tooltips
const DETAIL_EMOJIS: Record<string, { icon: string, tooltip: string }> = {
  nativeTo: { icon: "🌍", tooltip: "Native To" },
  sunExposure: { icon: "☀️", tooltip: "Sun Exposure" },
  waterNeeds: { icon: "💧", tooltip: "Water Needs" },
  soilType: { icon: "🪴", tooltip: "Soil Type" },
  growthRate: { icon: "📏", tooltip: "Growth Rate" },
  bloomSeason: { icon: "🌸", tooltip: "Bloom Season" }
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

      {/* Details Grid - updated layout */}
      <div className="space-y-3">
        {Object.entries(plantInfo.additionalDetails).map(([key, value]) => (
          value && (
            <div key={key} 
              className="flex items-center gap-4 p-3 bg-white/70 dark:bg-gray-900/30 
                rounded-lg border border-green-100 dark:border-green-900
                hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative group">
                <span 
                  className="text-2xl cursor-help"
                  role="img" 
                  aria-label={DETAIL_EMOJIS[key]?.tooltip}
                >
                  {DETAIL_EMOJIS[key]?.icon}
                </span>
                
                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
                  bg-gray-800 dark:bg-gray-700 text-white text-xs rounded
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  whitespace-nowrap pointer-events-none">
                  {DETAIL_EMOJIS[key]?.tooltip}
                </span>
              </div>

              <span className="text-gray-700 dark:text-gray-300 text-sm break-words flex-1">
                {value}
              </span>
            </div>
          )
        ))}
      </div>

      {/* Care Instructions Section */}
      <div className="relative px-4 py-4 bg-white/50 dark:bg-gray-900/30 rounded-lg
        border border-green-100 dark:border-green-900">
        <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-green-100 dark:bg-green-900 
          text-green-800 dark:text-green-200 text-xs rounded-full">
          Care Guide
        </span>
        <div className="flex gap-3">
          <span className="text-2xl" role="img" aria-label="care">🌱</span>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words">
            {plantInfo.careInstructions}
          </p>
        </div>
      </div>
    </div>
  )
} 