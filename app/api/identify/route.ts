import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
  try {
    const { base64Image } = await request.json()
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' }, 
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    })
    
    // First, verify if it's a plant
    const verificationPrompt = `
      Is this image clearly showing a plant? Please respond with ONLY "yes" or "no".
      If the image is unclear, blurry, or doesn't primarily show a plant, respond with "no".
    `

    const verificationResult = await model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [
          { text: verificationPrompt },
          { inlineData: { 
            mimeType: 'image/jpeg', 
            data: base64Image.split(',')[1] 
          }}
        ]
      }]
    })

    const isPlant = verificationResult.response.text().toLowerCase().includes('yes')

    if (!isPlant) {
      return NextResponse.json(
        { error: 'No plant detected. Please try using a clear picture of a plant.' },
        { status: 400 }
      )
    }

    // If it is a plant, proceed with the detailed analysis
    const analysisPrompt = `
      Analyze this plant image and return ONLY a JSON object with the following structure:
      {
        "name": "Common name of the plant",
        "scientificName": "Full botanical/Latin name",
        "description": "Brief, concise description (1-2 sentences max)",
        "careInstructions": "Key care tips",
        "additionalDetails": {
          "nativeTo": "Region of origin",
          "sunExposure": "Light requirements",
          "waterNeeds": "Watering frequency",
          "soilType": "Preferred soil conditions",
          "growthRate": "Typical growth characteristics",
          "bloomSeason": "Flowering period"
        }
      }
    `
    
    const result = await model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [
          { text: analysisPrompt },
          { inlineData: { 
            mimeType: 'image/jpeg', 
            data: base64Image.split(',')[1] 
          }}
        ]
      }]
    })

    const responseText = result.response.text()
    
    return NextResponse.json({ responseText })
  } catch (error) {
    console.error('Plant Identification Error:', error)
    
    // Check if it's the overloaded model error
    const errorMessage = error instanceof Error ? error.message : 'Failed to identify plant'
    const isOverloadedError = errorMessage.toLowerCase().includes('model is overloaded')
    
    return NextResponse.json(
      { 
        error: isOverloadedError 
          ? 'The model is overloaded. Please try again in a few moments.'
          : 'Failed to identify plant' 
      },
      { status: isOverloadedError ? 503 : 500 }
    )
  }
} 