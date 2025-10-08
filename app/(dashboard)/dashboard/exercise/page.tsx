'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dumbbell, Plus, Trash2, TrendingUp, Flame, Clock, MapPin } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ExerciseLog {
  id: string
  exerciseType: string
  activity: string
  duration: number
  intensity: string
  calories?: number | null
  distance?: number | null
  notes?: string | null
  performedAt: string
  createdAt: string
}

export default function ExercisePage() {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    exerciseType: 'cardio',
    activity: '',
    duration: '',
    intensity: 'moderate',
    calories: '',
    distance: '',
    notes: '',
    performedAt: new Date().toISOString().slice(0, 16),
  })

  useEffect(() => {
    fetchExerciseLogs()
  }, [])

  const fetchExerciseLogs = async () => {
    try {
      const res = await fetch('/api/exercise')
      const data = await res.json()
      setExerciseLogs(data)
    } catch (error) {
      console.error('Failed to fetch exercise logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      exerciseType: formData.exerciseType,
      activity: formData.activity,
      duration: parseInt(formData.duration),
      intensity: formData.intensity,
      calories: formData.calories ? parseFloat(formData.calories) : undefined,
      distance: formData.distance ? parseFloat(formData.distance) : undefined,
      notes: formData.notes || undefined,
      performedAt: new Date(formData.performedAt).toISOString(),
    }

    try {
      const res = await fetch('/api/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchExerciseLogs()
        setShowAddForm(false)
        setFormData({
          exerciseType: 'cardio',
          activity: '',
          duration: '',
          intensity: 'moderate',
          calories: '',
          distance: '',
          notes: '',
          performedAt: new Date().toISOString().slice(0, 16),
        })
      }
    } catch (error) {
      console.error('Failed to add exercise log:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise log?')) return

    try {
      const res = await fetch(`/api/exercise/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchExerciseLogs()
      }
    } catch (error) {
      console.error('Failed to delete exercise log:', error)
    }
  }

  const exerciseTypeConfig = {
    cardio: { label: 'Cardio', emoji: '🏃', color: 'red' },
    strength: { label: 'Strength', emoji: '💪', color: 'orange' },
    flexibility: { label: 'Flexibility', emoji: '🧘', color: 'purple' },
    sports: { label: 'Sports', emoji: '⚽', color: 'blue' },
  }

  const intensityConfig = {
    light: { label: 'Light', color: 'green' },
    moderate: { label: 'Moderate', color: 'yellow' },
    vigorous: { label: 'Vigorous', color: 'red' },
  }

  const calculateWeeklyStats = () => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const weeklyLogs = exerciseLogs.filter(
      (log) => new Date(log.performedAt) >= sevenDaysAgo
    )

    return {
      totalWorkouts: weeklyLogs.length,
      totalMinutes: weeklyLogs.reduce((sum, log) => sum + log.duration, 0),
      totalCalories: weeklyLogs.reduce((sum, log) => sum + (log.calories || 0), 0),
      totalDistance: weeklyLogs.reduce((sum, log) => sum + (log.distance || 0), 0),
    }
  }

  const groupLogsByDate = () => {
    const grouped: Record<string, ExerciseLog[]> = {}
    exerciseLogs.forEach((log) => {
      const date = new Date(log.performedAt).toDateString()
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(log)
    })
    return Object.entries(grouped).sort(
      ([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()
    )
  }

  const weeklyStats = calculateWeeklyStats()

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Log</h1>
          <p className="text-gray-600">Track your workouts and physical activity</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Workout
        </Button>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600">Workouts</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weeklyStats.totalWorkouts}</p>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weeklyStats.totalMinutes}</p>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-gray-600">Calories</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{Math.round(weeklyStats.totalCalories)}</p>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-600">Distance</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weeklyStats.totalDistance.toFixed(1)}</p>
            <p className="text-xs text-gray-500">km this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Log Workout</CardTitle>
            <CardDescription>Record your exercise session</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exerciseType">Exercise Type</Label>
                  <Select
                    value={formData.exerciseType}
                    onValueChange={(value) => setFormData({ ...formData, exerciseType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardio">🏃 Cardio</SelectItem>
                      <SelectItem value="strength">💪 Strength Training</SelectItem>
                      <SelectItem value="flexibility">🧘 Flexibility</SelectItem>
                      <SelectItem value="sports">⚽ Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="activity">Activity</Label>
                  <Input
                    id="activity"
                    placeholder="e.g., Running, Weightlifting, Yoga"
                    value={formData.activity}
                    onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    type="number"
                    id="duration"
                    placeholder="45"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="intensity">Intensity</Label>
                  <Select
                    value={formData.intensity}
                    onValueChange={(value) => setFormData({ ...formData, intensity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="vigorous">Vigorous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories Burned (optional)</Label>
                  <Input
                    type="number"
                    id="calories"
                    placeholder="350"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="distance">Distance (km, optional)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="distance"
                    placeholder="5.2"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="performedAt">Date & Time</Label>
                <Input
                  type="datetime-local"
                  id="performedAt"
                  value={formData.performedAt}
                  onChange={(e) => setFormData({ ...formData, performedAt: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="How did it feel? Any PRs?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Workout</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Exercise Logs */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : exerciseLogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workouts logged yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your fitness journey</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log First Workout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupLogsByDate().map(([date, logs]) => {
            const isToday = date === new Date().toDateString()
            const dailyMinutes = logs.reduce((sum, log) => sum + log.duration, 0)
            const dailyCalories = logs.reduce((sum, log) => sum + (log.calories || 0), 0)

            return (
              <Card key={date}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {isToday && <span className="text-blue-600">Today</span>}
                        {!isToday && new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardTitle>
                      <CardDescription>{logs.length} workouts</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{dailyMinutes} min</div>
                      <div className="text-sm text-gray-600">{Math.round(dailyCalories)} cal</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {logs.map((log) => {
                      const typeConfig = exerciseTypeConfig[log.exerciseType as keyof typeof exerciseTypeConfig]
                      const intensityBadge = intensityConfig[log.intensity as keyof typeof intensityConfig]

                      return (
                        <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-3xl">{typeConfig.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{log.activity}</h4>
                              <span className="text-sm text-gray-500">
                                {new Date(log.performedAt).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {log.duration} min
                              </span>
                              <span className={`px-2 py-0.5 rounded-full bg-${intensityBadge.color}-100 text-${intensityBadge.color}-700 text-xs font-medium`}>
                                {intensityBadge.label}
                              </span>
                              {log.calories && (
                                <span className="inline-flex items-center gap-1">
                                  <Flame className="h-4 w-4 text-orange-600" />
                                  {Math.round(log.calories)} cal
                                </span>
                              )}
                              {log.distance && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-blue-600" />
                                  {log.distance} km
                                </span>
                              )}
                            </div>
                            {log.notes && (
                              <p className="text-sm text-gray-700 italic">{log.notes}</p>
                            )}
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
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
