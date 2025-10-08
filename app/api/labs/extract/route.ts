import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = file.type

    // Use GPT-4 Vision to extract lab results
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a medical data extraction assistant. Analyze this lab report and extract the following information in JSON format:
{
  "testName": "Name of the lab test (e.g., Complete Blood Count)",
  "testDate": "Date of test in YYYY-MM-DD format",
  "provider": "Lab provider name (e.g., Quest Diagnostics)",
  "results": [
    {
      "name": "Test parameter name (e.g., Hemoglobin)",
      "value": "Test value",
      "unit": "Unit of measurement",
      "referenceRange": "Normal reference range",
      "flag": "HIGH or LOW if abnormal, otherwise null"
    }
  ]
}

Extract all available test results. If any field is not visible, use null. Be precise and extract exact values.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    })

    const content = response.choices[0].message.content
    if (!content) {
      return NextResponse.json({ extracted: false })
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ extracted: false })
    }

    const extractedData = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      extracted: true,
      ...extractedData,
    })
  } catch (error) {
    console.error('Error extracting lab data:', error)
    return NextResponse.json({ extracted: false, error: 'Failed to extract data' }, { status: 500 })
  }
}
