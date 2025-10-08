'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Lightbulb, Target, Zap, Brain, RefreshCw } from 'lucide-react'

interface Correlation {
  metric1: string
  metric2: string
  strength: number
  direction: 'positive' | 'negative'
  confidence: string
  insight: string
}

interface Prediction {
  category: string
  prediction: string
  confidence: string
  recommendation: string
}

interface Pattern {
  title: string
  description: string
  frequency: string
  impact: string
}

interface InsightsData {
  correlations: Correlation[]
  predictions: Prediction[]
  patterns: Pattern[]
  recommendations: string[]
  healthTrends: {
    improving: string[]
    declining: string[]
    stable: string[]
  }
  dataQuality: {
    score: number
    message: string
  }
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/insights')
      const data = await res.json()
      setInsights(data)
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewInsights = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/insights/generate', { method: 'POST' })
      const data = await res.json()
      setInsights(data)
    } catch (error) {
      console.error('Failed to generate insights:', error)
    } finally {
      setGenerating(false)
    }
  }

  const getCorrelationColor = (strength: number) => {
    if (strength > 0.7) return 'text-green-600 bg-green-50 border-green-200'
    if (strength > 0.4) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            AI Health Insights
          </h1>
          <p className="text-gray-600">Discover patterns, correlations, and personalized recommendations</p>
        </div>
        <Button onClick={generateNewInsights} disabled={generating}>
          <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Refresh Insights'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your health data...</p>
        </div>
      ) : !insights ? (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No insights generated yet</h3>
            <p className="text-gray-600 mb-6">
              Track more health data to unlock AI-powered insights about your wellness patterns
            </p>
            <Button onClick={generateNewInsights} disabled={generating}>
              <Sparkles className="h-4 w-4 mr-2" />
              {generating ? 'Generating...' : 'Generate Insights'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Data Quality */}
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Data Quality Score</h3>
                  <p className="text-sm text-gray-600">{insights.dataQuality.message}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">{insights.dataQuality.score}%</div>
                  <p className="text-xs text-gray-500">Confidence Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Trends */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Improving
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insights.healthTrends.improving.length === 0 ? (
                  <p className="text-sm text-gray-600">No improving trends detected</p>
                ) : (
                  <ul className="space-y-2">
                    {insights.healthTrends.improving.map((trend, idx) => (
                      <li key={idx} className="text-sm text-green-800 font-medium">
                        ✓ {trend}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="text-gray-700 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 rotate-90" />
                  Stable
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insights.healthTrends.stable.length === 0 ? (
                  <p className="text-sm text-gray-600">No stable trends</p>
                ) : (
                  <ul className="space-y-2">
                    {insights.healthTrends.stable.map((trend, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        → {trend}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insights.healthTrends.declining.length === 0 ? (
                  <p className="text-sm text-gray-600">No concerning trends</p>
                ) : (
                  <ul className="space-y-2">
                    {insights.healthTrends.declining.map((trend, idx) => (
                      <li key={idx} className="text-sm text-orange-800 font-medium">
                        ⚠ {trend}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Correlations */}
          {insights.correlations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Discovered Correlations
                </CardTitle>
                <CardDescription>Relationships between your health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.correlations.map((corr, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${getCorrelationColor(corr.strength)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {corr.metric1} {corr.direction === 'positive' ? '↔' : '↕'} {corr.metric2}
                          </h4>
                          <p className="text-sm text-gray-700">{corr.insight}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold">{(corr.strength * 100).toFixed(0)}%</div>
                          <p className="text-xs text-gray-600">{corr.confidence}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Predictions */}
          {insights.predictions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Predictions
                </CardTitle>
                <CardDescription>What to expect based on your current patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {insights.predictions.map((pred, idx) => (
                    <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">{pred.category}</h4>
                      <p className="text-sm text-gray-700 mb-3">{pred.prediction}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-600 font-medium">{pred.confidence} confidence</span>
                      </div>
                      {pred.recommendation && (
                        <p className="text-sm text-purple-800 mt-2 pt-2 border-t border-purple-200">
                          💡 {pred.recommendation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patterns */}
          {insights.patterns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Behavioral Patterns
                </CardTitle>
                <CardDescription>Recurring trends in your health data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.patterns.map((pattern, idx) => (
                    <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-1">{pattern.title}</h4>
                      <p className="text-sm text-gray-700 mb-2">{pattern.description}</p>
                      <div className="flex gap-4 text-xs text-blue-700">
                        <span>📊 Frequency: {pattern.frequency}</span>
                        <span>⚡ Impact: {pattern.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {insights.recommendations.length > 0 && (
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Lightbulb className="h-5 w-5" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>Actions to improve your health based on AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-900 flex-1">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
