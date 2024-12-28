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
    <div className="space-y-4 bg-green-50 dark:bg-gray-800 p-4 rounded-lg 
      border border-green-100 dark:border-gray-700 transition-colors duration-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 mb-1 transition-colors">
          {plantInfo.name}
        </h2>
        <p className="italic text-green-600 dark:text-green-400 text-sm">
          {plantInfo.scientificName}
        </p>
      </div>

      <div className="text-gray-700 dark:text-gray-300 text-center">
        <p className="italic text-base leading-relaxed">
          {plantInfo.description}
        </p>
      </div>

      <div className="text-gray-700 dark:text-gray-300">
        <h3 className="font-semibold text-green-700 dark:text-green-500 text-lg mb-2">
          Plant Details
        </h3>
        <table className="w-full border-collapse">
          <tbody>
            {Object.entries(plantInfo.additionalDetails).map(([key, value]) => (
              value && (
                <tr key={key} className="border-b border-green-200 dark:border-gray-700 
                  hover:bg-green-100 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-2 px-3 font-medium text-green-800 dark:text-green-500 
                    text-sm whitespace-nowrap">
                    {DETAIL_EMOJIS[key]} {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </td>
                  <td className="py-2 px-3 text-left text-sm dark:text-gray-300">
                    {value}
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {plantInfo.careInstructions && (
        <div className="text-gray-700 dark:text-gray-300">
          <h3 className="font-semibold text-green-700 dark:text-green-500 text-lg mb-2">
            Care Instructions
          </h3>
          <p className="text-base leading-relaxed">
            {plantInfo.careInstructions}
          </p>
        </div>
      )}
    </div>
  )
} 