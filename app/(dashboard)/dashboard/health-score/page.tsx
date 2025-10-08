'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Award,
  Activity,
  Brain,
  Utensils,
  Dumbbell,
  Moon,
  Heart,
  Shield,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

interface HealthScore {
  id: string
  overallScore: number
  physicalHealth: number
  mentalHealth: number
  nutrition: number
  exercise: number
  sleep: number
  stress: number
  preventiveCare: number
  socialHealth: number
  calculatedAt: string
}

interface HealthMetrics {
  vitalsCount: number
  symptomsActive: number
  medicationsActive: number
  appointmentsUpcoming: number
  foodLogsWeek: number
  exerciseLogsWeek: number
  sleepLogsWeek: number
  moodEntriesWeek: number
}

export default function HealthScorePage() {
  const [score, setScore] = useState<HealthScore | null>(null)
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    fetchHealthScore()
    fetchMetrics()
  }, [])

  const fetchHealthScore = async () => {
    try {
      const res = await fetch('/api/health-score')
      const data = await res.json()
      setScore(data.latestScore)
    } catch (error) {
      console.error('Failed to fetch health score:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/health-score/metrics')
      const data = await res.json()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    }
  }

  const calculateHealthScore = async () => {
    setCalculating(true)
    try {
      const res = await fetch('/api/health-score/calculate', { method: 'POST' })
      const data = await res.json()
      setScore(data)
      await fetchMetrics()
    } catch (error) {
      console.error('Failed to calculate health score:', error)
    } finally {
      setCalculating(false)
    }
  }

  const dimensions = [
    {
      key: 'physicalHealth',
      label: 'Physical Health',
      icon: Activity,
      color: 'blue',
      description: 'Vital signs, symptoms, and physical wellness',
      link: '/dashboard/vitals',
    },
    {
      key: 'mentalHealth',
      label: 'Mental Health',
      icon: Brain,
      color: 'purple',
      description: 'Mood, stress levels, and emotional wellbeing',
      link: '/dashboard/mood',
    },
    {
      key: 'nutrition',
      label: 'Nutrition',
      icon: Utensils,
      color: 'green',
      description: 'Diet quality and nutritional balance',
      link: '/dashboard/nutrition',
    },
    {
      key: 'exercise',
      label: 'Exercise',
      icon: Dumbbell,
      color: 'orange',
      description: 'Physical activity and fitness level',
      link: '/dashboard/exercise',
    },
    {
      key: 'sleep',
      label: 'Sleep',
      icon: Moon,
      color: 'indigo',
      description: 'Sleep quality and duration',
      link: '/dashboard/sleep',
    },
    {
      key: 'stress',
      label: 'Stress Management',
      icon: Heart,
      color: 'red',
      description: 'Stress levels and coping mechanisms',
      link: '/dashboard/mood',
    },
    {
      key: 'preventiveCare',
      label: 'Preventive Care',
      icon: Shield,
      color: 'teal',
      description: 'Checkups, screenings, and medications',
      link: '/dashboard/appointments',
    },
    {
      key: 'socialHealth',
      label: 'Social Health',
      icon: Users,
      color: 'pink',
      description: 'Social connections and support system',
      link: '/dashboard/mood',
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Attention'
  }

  const getRecommendations = () => {
    if (!score) return []

    const recommendations = []

    if (score.physicalHealth < 60) {
      recommendations.push({
        title: 'Track Your Vital Signs',
        description: 'Regular monitoring helps catch issues early',
        action: 'Add Vitals',
        link: '/dashboard/vitals',
        icon: Activity,
      })
    }

    if (score.nutrition < 60) {
      recommendations.push({
        title: 'Improve Your Nutrition',
        description: 'Log meals to understand your eating patterns',
        action: 'Track Meals',
        link: '/dashboard/nutrition',
        icon: Utensils,
      })
    }

    if (score.exercise < 60) {
      recommendations.push({
        title: 'Increase Physical Activity',
        description: 'Aim for 150 minutes of moderate exercise per week',
        action: 'Log Exercise',
        link: '/dashboard/exercise',
        icon: Dumbbell,
      })
    }

    if (score.sleep < 60) {
      recommendations.push({
        title: 'Prioritize Sleep',
        description: 'Track your sleep to identify patterns and improve quality',
        action: 'Track Sleep',
        link: '/dashboard/sleep',
        icon: Moon,
      })
    }

    return recommendations.slice(0, 3)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Health Score</h1>
          <p className="text-gray-600">Comprehensive view of your overall wellness</p>
        </div>
        <Button onClick={calculateHealthScore} disabled={calculating}>
          <TrendingUp className="h-4 w-4 mr-2" />
          {calculating ? 'Calculating...' : 'Update Score'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : !score ? (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Health Score Yet</h3>
            <p className="text-gray-600 mb-6">
              Calculate your personalized health score based on your tracked data
            </p>
            <Button onClick={calculateHealthScore} disabled={calculating}>
              <TrendingUp className="h-4 w-4 mr-2" />
              {calculating ? 'Calculating...' : 'Calculate My Score'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overall Score Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Overall Health Score</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-6xl font-bold ${getScoreColor(score.overallScore)}`}>
                      {score.overallScore}
                    </span>
                    <span className="text-2xl text-gray-400">/100</span>
                  </div>
                  <p className={`text-lg font-semibold mt-2 ${getScoreColor(score.overallScore)}`}>
                    {getScoreLabel(score.overallScore)}
                  </p>
                </div>
                <div className="text-right">
                  <Award className={`h-20 w-20 ${getScoreColor(score.overallScore)}`} />
                  <p className="text-xs text-gray-500 mt-2">
                    Updated {new Date(score.calculatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    score.overallScore >= 80
                      ? 'bg-green-600'
                      : score.overallScore >= 60
                      ? 'bg-yellow-600'
                      : score.overallScore >= 40
                      ? 'bg-orange-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${score.overallScore}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Dimensions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dimensions.map((dimension) => {
              const Icon = dimension.icon
              const dimensionScore = score[dimension.key as keyof HealthScore] as number

              return (
                <Card key={dimension.key} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`h-5 w-5 text-${dimension.color}-600`} />
                      <span className={`text-2xl font-bold ${getScoreColor(dimensionScore)}`}>
                        {dimensionScore}
                      </span>
                    </div>
                    <CardTitle className="text-sm">{dimension.label}</CardTitle>
                    <CardDescription className="text-xs">{dimension.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full bg-${dimension.color}-600`}
                        style={{ width: `${dimensionScore}%` }}
                      ></div>
                    </div>
                    <Link href={dimension.link}>
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        Improve <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Recommendations */}
          {getRecommendations().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>Actions to improve your health score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecommendations().map((rec, index) => {
                    const Icon = rec.icon
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                        <Link href={rec.link}>
                          <Button size="sm">{rec.action}</Button>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Coverage */}
          {metrics && (
            <Card>
              <CardHeader>
                <CardTitle>Data Coverage</CardTitle>
                <CardDescription>More data means a more accurate health score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{metrics.vitalsCount}</p>
                      <p className="text-xs text-gray-600">Vital Signs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Utensils className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{metrics.foodLogsWeek}</p>
                      <p className="text-xs text-gray-600">Meals This Week</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Dumbbell className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{metrics.exerciseLogsWeek}</p>
                      <p className="text-xs text-gray-600">Workouts This Week</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{metrics.sleepLogsWeek}</p>
                      <p className="text-xs text-gray-600">Sleep Logs This Week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
