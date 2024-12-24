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
    <div className="space-y-4 bg-green-50 p-4 rounded-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-1">
          {plantInfo.name}
        </h2>
        <p className="italic text-green-600 text-sm">
          {plantInfo.scientificName}
        </p>
      </div>

      <div className="text-gray-700 text-center">
        <p className="italic text-base leading-relaxed">
          {plantInfo.description}
        </p>
      </div>

      <div className="text-gray-700">
        <h3 className="font-semibold text-green-700 text-lg mb-2">
          Plant Details
        </h3>
        <table className="w-full border-collapse">
          <tbody>
            {Object.entries(plantInfo.additionalDetails).map(([key, value]) => (
              value && (
                <tr key={key} className="border-b border-green-200 hover:bg-green-100 transition-colors">
                  <td className="py-2 px-3 font-medium text-green-800 text-sm whitespace-nowrap">
                    {DETAIL_EMOJIS[key]} {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </td>
                  <td className="py-2 px-3 text-left text-sm">{value}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {plantInfo.careInstructions && (
        <div className="text-gray-700">
          <h3 className="font-semibold text-green-700 text-lg mb-2">
            Care Instructions
          </h3>
          <p className="text-base leading-relaxed">{plantInfo.careInstructions}</p>
        </div>
      )}
    </div>
  )
} 