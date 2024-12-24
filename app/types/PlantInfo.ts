export interface PlantInfo {
  name: string
  scientificName: string
  description: string
  careInstructions: string
  additionalDetails: {
    nativeTo?: string
    sunExposure?: string
    waterNeeds?: string
    soilType?: string
    growthRate?: string
    bloomSeason?: string
  }
} 