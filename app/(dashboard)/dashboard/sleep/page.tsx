'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Moon, Plus, Trash2, TrendingUp, Clock, Star, AlertCircle } from 'lucide-react'

interface SleepLog {
  id: string
  bedTime: string
  wakeTime: string
  totalHours: number
  quality: number
  deepSleep?: number | null
  remSleep?: number | null
  awakenings?: number | null
  notes?: string | null
  createdAt: string
}

export default function SleepPage() {
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    bedTime: '',
    wakeTime: '',
    quality: '7',
    deepSleep: '',
    remSleep: '',
    awakenings: '',
    notes: '',
  })

  useEffect(() => {
    fetchSleepLogs()
  }, [])

  const fetchSleepLogs = async () => {
    try {
      const res = await fetch('/api/sleep')
      const data = await res.json()
      setSleepLogs(data)
    } catch (error) {
      console.error('Failed to fetch sleep logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const bedTime = new Date(formData.bedTime)
    const wakeTime = new Date(formData.wakeTime)
    const totalHours = (wakeTime.getTime() - bedTime.getTime()) / (1000 * 60 * 60)

    const payload = {
      bedTime: bedTime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      totalHours,
      quality: parseInt(formData.quality),
      deepSleep: formData.deepSleep ? parseFloat(formData.deepSleep) : undefined,
      remSleep: formData.remSleep ? parseFloat(formData.remSleep) : undefined,
      awakenings: formData.awakenings ? parseInt(formData.awakenings) : undefined,
      notes: formData.notes || undefined,
    }

    try {
      const res = await fetch('/api/sleep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchSleepLogs()
        setShowAddForm(false)
        setFormData({
          bedTime: '',
          wakeTime: '',
          quality: '7',
          deepSleep: '',
          remSleep: '',
          awakenings: '',
          notes: '',
        })
      }
    } catch (error) {
      console.error('Failed to add sleep log:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sleep log?')) return

    try {
      const res = await fetch(`/api/sleep/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchSleepLogs()
      }
    } catch (error) {
      console.error('Failed to delete sleep log:', error)
    }
  }

  const calculateAverages = () => {
    if (sleepLogs.length === 0) return null

    const recentLogs = sleepLogs.slice(0, 7)

    return {
      avgHours: recentLogs.reduce((sum, log) => sum + log.totalHours, 0) / recentLogs.length,
      avgQuality: recentLogs.reduce((sum, log) => sum + log.quality, 0) / recentLogs.length,
      totalNights: recentLogs.length,
    }
  }

  const getSleepScore = (hours: number, quality: number) => {
    let score = 0

    // Hours score (0-50 points)
    if (hours >= 7 && hours <= 9) score += 50
    else if (hours >= 6 && hours < 7) score += 40
    else if (hours >= 5 && hours < 6) score += 30
    else score += 20

    // Quality score (0-50 points)
    score += quality * 5

    return Math.min(100, score)
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-600'
    if (quality >= 6) return 'text-blue-600'
    if (quality >= 4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const averages = calculateAverages()

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sleep Tracker</h1>
          <p className="text-gray-600">Monitor your sleep patterns and quality</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Sleep
        </Button>
      </div>

      {/* Weekly Summary */}
      {averages && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm text-gray-600">Avg Sleep</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{averages.avgHours.toFixed(1)}h</p>
              <p className="text-xs text-gray-500 mt-1">Last {averages.totalNights} nights</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <p className="text-sm text-gray-600">Avg Quality</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{averages.avgQuality.toFixed(1)}/10</p>
              <p className="text-xs text-gray-500 mt-1">Sleep quality rating</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-gray-600">Sleep Score</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {getSleepScore(averages.avgHours, averages.avgQuality)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Out of 100</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sleep Recommendations */}
      {averages && averages.avgHours < 7 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Sleep Recommendation</h4>
                <p className="text-sm text-gray-700">
                  You're averaging {averages.avgHours.toFixed(1)} hours of sleep. Most adults need 7-9 hours
                  for optimal health. Try going to bed 30 minutes earlier tonight.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Log Sleep Session</CardTitle>
            <CardDescription>Record your sleep from last night</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedTime">Bed Time</Label>
                  <Input
                    type="datetime-local"
                    id="bedTime"
                    value={formData.bedTime}
                    onChange={(e) => setFormData({ ...formData, bedTime: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="wakeTime">Wake Time</Label>
                  <Input
                    type="datetime-local"
                    id="wakeTime"
                    value={formData.wakeTime}
                    onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="quality">Sleep Quality</Label>
                  <span className="text-sm font-semibold text-gray-900">{formData.quality}/10</span>
                </div>
                <input
                  type="range"
                  id="quality"
                  min="1"
                  max="10"
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="deepSleep">Deep Sleep (hours, optional)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    id="deepSleep"
                    placeholder="2.5"
                    value={formData.deepSleep}
                    onChange={(e) => setFormData({ ...formData, deepSleep: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="remSleep">REM Sleep (hours, optional)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    id="remSleep"
                    placeholder="1.5"
                    value={formData.remSleep}
                    onChange={(e) => setFormData({ ...formData, remSleep: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="awakenings">Awakenings (optional)</Label>
                  <Input
                    type="number"
                    min="0"
                    id="awakenings"
                    placeholder="2"
                    value={formData.awakenings}
                    onChange={(e) => setFormData({ ...formData, awakenings: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Dreams, interruptions, how you felt..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Sleep Log</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sleep Logs */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : sleepLogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Moon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sleep data yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your sleep to understand your patterns</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log First Night
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sleep History</CardTitle>
            <CardDescription>Your recent sleep sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sleepLogs.map((log) => {
                const score = getSleepScore(log.totalHours, log.quality)
                const bedTime = new Date(log.bedTime)
                const wakeTime = new Date(log.wakeTime)

                return (
                  <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {wakeTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {bedTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })} → {wakeTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(log.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total Sleep</p>
                        <p className="text-lg font-bold text-indigo-600">{log.totalHours.toFixed(1)}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Quality</p>
                        <p className={`text-lg font-bold ${getQualityColor(log.quality)}`}>
                          {log.quality}/10
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Sleep Score</p>
                        <p className="text-lg font-bold text-gray-900">{score}/100</p>
                      </div>
                      {log.awakenings !== null && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Awakenings</p>
                          <p className="text-lg font-bold text-gray-900">{log.awakenings}</p>
                        </div>
                      )}
                    </div>

                    {(log.deepSleep || log.remSleep) && (
                      <div className="mt-3 flex gap-4 text-sm">
                        {log.deepSleep && (
                          <span className="text-blue-600">
                            Deep: {log.deepSleep.toFixed(1)}h
                          </span>
                        )}
                        {log.remSleep && (
                          <span className="text-purple-600">
                            REM: {log.remSleep.toFixed(1)}h
                          </span>
                        )}
                      </div>
                    )}

                    {log.notes && (
                      <p className="text-sm text-gray-700 mt-3 pt-3 border-t italic">
                        {log.notes}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
