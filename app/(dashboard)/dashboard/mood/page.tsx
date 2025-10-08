'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Brain, Plus, Smile, Frown, Meh, TrendingUp, TrendingDown, Heart, Zap, CloudRain } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface MoodEntry {
  id: string
  mood: string
  energy: number
  stress: number
  anxiety?: number | null
  sleep?: number | null
  notes?: string | null
  triggers?: string | null
  loggedAt: string
  createdAt: string
}

export default function MoodPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    mood: 'okay',
    energy: '5',
    stress: '5',
    anxiety: '',
    sleep: '',
    notes: '',
    loggedAt: new Date().toISOString().slice(0, 16),
  })

  useEffect(() => {
    fetchMoodEntries()
  }, [])

  const fetchMoodEntries = async () => {
    try {
      const res = await fetch('/api/mood')
      const data = await res.json()
      setMoodEntries(data)
    } catch (error) {
      console.error('Failed to fetch mood entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      mood: formData.mood,
      energy: parseInt(formData.energy),
      stress: parseInt(formData.stress),
      anxiety: formData.anxiety ? parseInt(formData.anxiety) : undefined,
      sleep: formData.sleep ? parseFloat(formData.sleep) : undefined,
      notes: formData.notes || undefined,
      loggedAt: new Date(formData.loggedAt).toISOString(),
    }

    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchMoodEntries()
        setShowAddForm(false)
        setFormData({
          mood: 'okay',
          energy: '5',
          stress: '5',
          anxiety: '',
          sleep: '',
          notes: '',
          loggedAt: new Date().toISOString().slice(0, 16),
        })
      }
    } catch (error) {
      console.error('Failed to add mood entry:', error)
    }
  }

  const moodConfig = {
    great: { icon: Smile, label: 'Great', emoji: '😄', color: 'green', value: 5 },
    good: { icon: Smile, label: 'Good', emoji: '🙂', color: 'blue', value: 4 },
    okay: { icon: Meh, label: 'Okay', emoji: '😐', color: 'yellow', value: 3 },
    bad: { icon: Frown, label: 'Bad', emoji: '😟', color: 'orange', value: 2 },
    terrible: { icon: Frown, label: 'Terrible', emoji: '😢', color: 'red', value: 1 },
  }

  const calculateAverages = () => {
    if (moodEntries.length === 0) return null

    const recentEntries = moodEntries.slice(0, 7) // Last 7 entries

    const avgMoodValue =
      recentEntries.reduce((sum, entry) => sum + moodConfig[entry.mood as keyof typeof moodConfig].value, 0) /
      recentEntries.length

    const avgEnergy = recentEntries.reduce((sum, entry) => sum + entry.energy, 0) / recentEntries.length
    const avgStress = recentEntries.reduce((sum, entry) => sum + entry.stress, 0) / recentEntries.length

    const anxietyEntries = recentEntries.filter((e) => e.anxiety !== null)
    const avgAnxiety =
      anxietyEntries.length > 0
        ? anxietyEntries.reduce((sum, entry) => sum + (entry.anxiety || 0), 0) / anxietyEntries.length
        : null

    return {
      mood: avgMoodValue,
      energy: avgEnergy,
      stress: avgStress,
      anxiety: avgAnxiety,
    }
  }

  const averages = calculateAverages()

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Health Tracker</h1>
          <p className="text-gray-600">Track your mood, energy, and emotional wellbeing</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Check In
        </Button>
      </div>

      {/* Weekly Averages */}
      {averages && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Smile className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-gray-600">Avg Mood</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {averages.mood.toFixed(1)}/5
              </p>
              <p className="text-xs text-gray-500">Last 7 check-ins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-gray-600">Avg Energy</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {averages.energy.toFixed(1)}/10
              </p>
              <p className="text-xs text-gray-500">Last 7 check-ins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CloudRain className="h-5 w-5 text-red-600" />
                <p className="text-sm text-gray-600">Avg Stress</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {averages.stress.toFixed(1)}/10
              </p>
              <p className="text-xs text-gray-500">Last 7 check-ins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-purple-600" />
                <p className="text-sm text-gray-600">Avg Anxiety</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {averages.anxiety ? averages.anxiety.toFixed(1) : 'N/A'}/10
              </p>
              <p className="text-xs text-gray-500">Last 7 check-ins</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mental Health Check-In</CardTitle>
            <CardDescription>How are you feeling right now?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mood">Overall Mood</Label>
                  <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="great">😄 Great</SelectItem>
                      <SelectItem value="good">🙂 Good</SelectItem>
                      <SelectItem value="okay">😐 Okay</SelectItem>
                      <SelectItem value="bad">😟 Bad</SelectItem>
                      <SelectItem value="terrible">😢 Terrible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="loggedAt">Date & Time</Label>
                  <Input
                    type="datetime-local"
                    id="loggedAt"
                    value={formData.loggedAt}
                    onChange={(e) => setFormData({ ...formData, loggedAt: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="energy">Energy Level</Label>
                  <span className="text-sm font-semibold text-gray-900">{formData.energy}/10</span>
                </div>
                <input
                  type="range"
                  id="energy"
                  min="1"
                  max="10"
                  value={formData.energy}
                  onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Exhausted</span>
                  <span>Energized</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="stress">Stress Level</Label>
                  <span className="text-sm font-semibold text-gray-900">{formData.stress}/10</span>
                </div>
                <input
                  type="range"
                  id="stress"
                  min="1"
                  max="10"
                  value={formData.stress}
                  onChange={(e) => setFormData({ ...formData, stress: e.target.value })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Calm</span>
                  <span>Overwhelmed</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="anxiety">Anxiety Level (optional)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    id="anxiety"
                    placeholder="1-10"
                    value={formData.anxiety}
                    onChange={(e) => setFormData({ ...formData, anxiety: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="sleep">Hours of Sleep Last Night (optional)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    id="sleep"
                    placeholder="7.5"
                    value={formData.sleep}
                    onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="What's on your mind? Any triggers or positive moments..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Check-In</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Mood Entries */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : moodEntries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No check-ins yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your mental health by logging your first check-in</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              First Check-In
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Mental Health History</CardTitle>
            <CardDescription>Your recent check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodEntries.map((entry) => {
                const config = moodConfig[entry.mood as keyof typeof moodConfig]

                return (
                  <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{config.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{config.label}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(entry.loggedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Energy</p>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span className="font-semibold text-gray-900">{entry.energy}/10</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Stress</p>
                        <div className="flex items-center gap-2">
                          <CloudRain className="h-4 w-4 text-red-600" />
                          <span className="font-semibold text-gray-900">{entry.stress}/10</span>
                        </div>
                      </div>
                      {entry.anxiety !== null && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Anxiety</p>
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-purple-600" />
                            <span className="font-semibold text-gray-900">{entry.anxiety}/10</span>
                          </div>
                        </div>
                      )}
                      {entry.sleep !== null && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Sleep</p>
                          <span className="font-semibold text-gray-900">{entry.sleep}h</span>
                        </div>
                      )}
                    </div>

                    {entry.notes && (
                      <p className="text-sm text-gray-700 italic bg-white p-3 rounded">
                        {entry.notes}
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
