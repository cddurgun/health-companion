import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch all user health data from last 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const [vitals, symptoms, moodEntries, sleepLogs, exerciseLogs, foodLogs, painLogs] = await Promise.all([
      prisma.vitalSign.findMany({
        where: { userId: user.id, createdAt: { gte: ninetyDaysAgo } },
        orderBy: { measuredAt: 'desc' },
      }),
      prisma.symptom.findMany({
        where: { userId: user.id },
      }),
      prisma.moodEntry.findMany({
        where: { userId: user.id, createdAt: { gte: ninetyDaysAgo } },
        orderBy: { loggedAt: 'desc' },
      }),
      prisma.sleepLog.findMany({
        where: { userId: user.id, createdAt: { gte: ninetyDaysAgo } },
        orderBy: { wakeTime: 'desc' },
      }),
      prisma.exerciseLog.findMany({
        where: { userId: user.id, createdAt: { gte: ninetyDaysAgo } },
        orderBy: { performedAt: 'desc' },
      }),
      prisma.foodLog.findMany({
        where: { userId: user.id, createdAt: { gte: ninetyDaysAgo } },
        orderBy: { consumedAt: 'desc' },
      }),
      prisma.painLog.findMany({
        where: { userId: user.id, createdAt: { gte: ninetyDaysAgo } },
        orderBy: { loggedAt: 'desc' },
      }),
    ])

    // Calculate data quality score
    const dataPoints = vitals.length + symptoms.length + moodEntries.length + sleepLogs.length + exerciseLogs.length + foodLogs.length + painLogs.length
    const dataQualityScore = Math.min(100, Math.round((dataPoints / 100) * 100))

    // Prepare data summary for AI
    const dataSummary = {
      user: {
        age: user.age,
        sex: user.sex,
      },
      metrics: {
        vitalsCount: vitals.length,
        symptomsCount: symptoms.length,
        activeSymptoms: symptoms.filter(s => !s.resolved).length,
        moodEntriesCount: moodEntries.length,
        sleepLogsCount: sleepLogs.length,
        exerciseLogsCount: exerciseLogs.length,
        foodLogsCount: foodLogs.length,
        painLogsCount: painLogs.length,
      },
      recentMoods: moodEntries.slice(0, 7).map(m => ({ mood: m.mood, energy: m.energy, stress: m.stress })),
      recentSleep: sleepLogs.slice(0, 7).map(s => ({ hours: s.totalHours, quality: s.quality })),
      recentExercise: exerciseLogs.slice(0, 7).map(e => ({ type: e.exerciseType, duration: e.duration })),
      activePain: painLogs.filter(p => p.intensity >= 5).slice(0, 5).map(p => ({ bodyPart: p.bodyPart, intensity: p.intensity })),
    }

    // Use GPT-4 to generate insights
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an AI health insights analyst. Analyze the user's health data and provide actionable insights in JSON format. Be specific, evidence-based, and helpful.`,
        },
        {
          role: 'user',
          content: `Analyze this health data and provide insights:

${JSON.stringify(dataSummary, null, 2)}

Provide a JSON response with the following structure:
{
  "correlations": [
    {
      "metric1": "Sleep Hours",
      "metric2": "Energy Levels",
      "strength": 0.85,
      "direction": "positive",
      "confidence": "High",
      "insight": "Your energy levels strongly correlate with sleep duration"
    }
  ],
  "predictions": [
    {
      "category": "Energy",
      "prediction": "Based on recent sleep debt, expect lower energy this week",
      "confidence": "Medium",
      "recommendation": "Prioritize 7-8 hours of sleep tonight"
    }
  ],
  "patterns": [
    {
      "title": "Weekend Exercise Consistency",
      "description": "You consistently exercise more on weekends (3x more than weekdays)",
      "frequency": "Weekly",
      "impact": "Moderate"
    }
  ],
  "recommendations": [
    "Consider going to bed 30 minutes earlier to improve energy levels",
    "Track food intake more consistently for better nutrition insights",
    "Your stress levels are elevated - try 10 minutes of meditation daily"
  ],
  "healthTrends": {
    "improving": ["Sleep consistency", "Exercise frequency"],
    "declining": ["Mood scores", "Energy levels"],
    "stable": ["Pain levels"]
  }
}

Provide 2-4 items in each category. Be specific and actionable. Base insights on the actual data provided.`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response')
    }

    const insights = JSON.parse(jsonMatch[0])

    // Add data quality info
    insights.dataQuality = {
      score: dataQualityScore,
      message: dataQualityScore >= 70
        ? 'Excellent data coverage for accurate insights'
        : dataQualityScore >= 40
        ? 'Good data coverage. Track more metrics for deeper insights'
        : 'Limited data. Continue tracking to unlock more insights',
    }

    return NextResponse.json(insights)
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
