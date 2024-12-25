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
    
    const prompt = `
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

      Important: 
      - Respond ONLY with valid, parseable JSON
      - Keep description very concise
      - Provide practical, actionable details
    `
    
    const result = await model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [
          { text: prompt },
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
    return NextResponse.json(
      { error: 'Failed to identify plant' }, 
      { status: 500 }
    )
  }
} 