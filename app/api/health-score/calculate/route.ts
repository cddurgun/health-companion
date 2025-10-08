import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Fetch all relevant data from the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [vitals, symptoms, medications, appointments, foodLogs, exerciseLogs, sleepLogs, moodEntries] =
      await Promise.all([
        prisma.vitalSign.findMany({
          where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.symptom.findMany({
          where: { userId: user.id },
        }),
        prisma.medication.findMany({
          where: { userId: user.id, active: true },
        }),
        prisma.appointment.findMany({
          where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.foodLog.findMany({
          where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.exerciseLog.findMany({
          where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.sleepLog.findMany({
          where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.moodEntry.findMany({
          where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
        }),
      ])

    // Calculate Physical Health (0-100)
    let physicalHealth = 50 // baseline

    // Boost for tracking vitals
    if (vitals.length > 0) physicalHealth += 20
    if (vitals.length > 10) physicalHealth += 10

    // Penalty for active symptoms
    const activeSymptoms = symptoms.filter((s) => !s.resolved)
    physicalHealth -= activeSymptoms.length * 5
    physicalHealth = Math.max(0, Math.min(100, physicalHealth))

    // Calculate Mental Health (0-100)
    let mentalHealth = 50

    if (moodEntries.length > 0) {
      const avgMood =
        moodEntries.reduce((sum, entry) => {
          const moodValue = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 }[entry.mood] || 3
          return sum + moodValue
        }, 0) / moodEntries.length

      mentalHealth = avgMood * 20 // Convert to 0-100 scale

      // Factor in stress levels
      const avgStress =
        moodEntries.reduce((sum, entry) => sum + entry.stress, 0) / moodEntries.length
      mentalHealth -= (avgStress - 5) * 5 // Stress > 5 reduces score
    }

    mentalHealth = Math.max(0, Math.min(100, mentalHealth))

    // Calculate Nutrition (0-100)
    let nutrition = 50

    const mealsPerWeek = foodLogs.length
    if (mealsPerWeek >= 21) nutrition = 90 // 3 meals/day
    else if (mealsPerWeek >= 14) nutrition = 75
    else if (mealsPerWeek >= 7) nutrition = 60
    else if (mealsPerWeek > 0) nutrition = 50

    // Bonus for balanced macros
    if (foodLogs.length > 0) {
      const logsWithMacros = foodLogs.filter((log) => log.protein && log.carbs && log.fat)
      if (logsWithMacros.length > foodLogs.length * 0.5) {
        nutrition += 10
      }
    }

    nutrition = Math.max(0, Math.min(100, nutrition))

    // Calculate Exercise (0-100)
    let exercise = 50

    const workoutsPerWeek = exerciseLogs.length
    if (workoutsPerWeek >= 5) exercise = 95
    else if (workoutsPerWeek >= 3) exercise = 85
    else if (workoutsPerWeek >= 1) exercise = 65
    else exercise = 30

    // Bonus for consistency
    const uniqueDays = new Set(exerciseLogs.map((log) => new Date(log.performedAt).toDateString()))
    if (uniqueDays.size >= 5) exercise = Math.min(100, exercise + 5)

    exercise = Math.max(0, Math.min(100, exercise))

    // Calculate Sleep (0-100)
    let sleep = 50

    if (sleepLogs.length > 0) {
      const avgHours = sleepLogs.reduce((sum, log) => sum + log.totalHours, 0) / sleepLogs.length
      const avgQuality = sleepLogs.reduce((sum, log) => sum + log.quality, 0) / sleepLogs.length

      // Ideal sleep: 7-9 hours
      if (avgHours >= 7 && avgHours <= 9) sleep = 90
      else if (avgHours >= 6 && avgHours <= 10) sleep = 70
      else sleep = 50

      // Quality bonus
      sleep += avgQuality * 2 // Quality is 1-10, add up to 20 points
    }

    sleep = Math.max(0, Math.min(100, sleep))

    // Calculate Stress (0-100) - Lower stress = higher score
    let stress = 50

    if (moodEntries.length > 0) {
      const avgStress =
        moodEntries.reduce((sum, entry) => sum + entry.stress, 0) / moodEntries.length

      // Convert stress (1-10) to score (100-0)
      stress = 100 - avgStress * 10

      // Bonus for low anxiety
      if (moodEntries.some((entry) => entry.anxiety !== null)) {
        const avgAnxiety =
          moodEntries
            .filter((entry) => entry.anxiety !== null)
            .reduce((sum, entry) => sum + (entry.anxiety || 0), 0) /
          moodEntries.filter((entry) => entry.anxiety !== null).length

        stress = (stress + (100 - avgAnxiety * 10)) / 2
      }
    }

    stress = Math.max(0, Math.min(100, stress))

    // Calculate Preventive Care (0-100)
    let preventiveCare = 50

    // Medications adherence
    if (medications.length > 0) preventiveCare += 20

    // Recent appointments
    if (appointments.length > 0) preventiveCare += 20

    // Completed appointments
    const completedAppts = appointments.filter((a) => a.status === 'completed')
    if (completedAppts.length > 0) preventiveCare += 10

    preventiveCare = Math.max(0, Math.min(100, preventiveCare))

    // Calculate Social Health (0-100)
    // For now, use a baseline with mood-based adjustments
    let socialHealth = 60

    if (moodEntries.length > 0) {
      // Assume social connections correlate with better mood
      const avgEnergy =
        moodEntries.reduce((sum, entry) => sum + entry.energy, 0) / moodEntries.length
      socialHealth = 40 + avgEnergy * 6 // Energy 1-10 contributes to social health
    }

    socialHealth = Math.max(0, Math.min(100, socialHealth))

    // Calculate Overall Score (weighted average)
    const overallScore = Math.round(
      (physicalHealth * 0.15 +
        mentalHealth * 0.15 +
        nutrition * 0.15 +
        exercise * 0.15 +
        sleep * 0.15 +
        stress * 0.1 +
        preventiveCare * 0.1 +
        socialHealth * 0.05)
    )

    // Create new health score record
    const healthScore = await prisma.healthScore.create({
      data: {
        userId: user.id,
        overallScore,
        physicalHealth: Math.round(physicalHealth),
        mentalHealth: Math.round(mentalHealth),
        nutrition: Math.round(nutrition),
        exercise: Math.round(exercise),
        sleep: Math.round(sleep),
        stress: Math.round(stress),
        preventiveCare: Math.round(preventiveCare),
        socialHealth: Math.round(socialHealth),
        calculatedAt: new Date(),
      },
    })

    return NextResponse.json(healthScore)
  } catch (error) {
    console.error('Error calculating health score:', error)
    return NextResponse.json({ error: 'Failed to calculate health score' }, { status: 500 })
  }
}
