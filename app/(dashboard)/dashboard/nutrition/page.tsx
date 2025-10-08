'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Utensils, Plus, Trash2, TrendingUp, Coffee, Apple, Pizza } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FoodLog {
  id: string
  mealType: string
  foodName: string
  calories?: number | null
  protein?: number | null
  carbs?: number | null
  fat?: number | null
  notes?: string | null
  photoUrl?: string | null
  consumedAt: string
  createdAt: string
}

interface DailyTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
  meals: number
}

export default function NutritionPage() {
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: '',
    consumedAt: new Date().toISOString().slice(0, 16),
  })

  useEffect(() => {
    fetchFoodLogs()
  }, [])

  const fetchFoodLogs = async () => {
    try {
      const res = await fetch('/api/nutrition')
      const data = await res.json()
      setFoodLogs(data)
    } catch (error) {
      console.error('Failed to fetch food logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      mealType: formData.mealType,
      foodName: formData.foodName,
      calories: formData.calories ? parseFloat(formData.calories) : undefined,
      protein: formData.protein ? parseFloat(formData.protein) : undefined,
      carbs: formData.carbs ? parseFloat(formData.carbs) : undefined,
      fat: formData.fat ? parseFloat(formData.fat) : undefined,
      notes: formData.notes || undefined,
      consumedAt: new Date(formData.consumedAt).toISOString(),
    }

    try {
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchFoodLogs()
        setShowAddForm(false)
        setFormData({
          mealType: 'breakfast',
          foodName: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          notes: '',
          consumedAt: new Date().toISOString().slice(0, 16),
        })
      }
    } catch (error) {
      console.error('Failed to add food log:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food log?')) return

    try {
      const res = await fetch(`/api/nutrition/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchFoodLogs()
      }
    } catch (error) {
      console.error('Failed to delete food log:', error)
    }
  }

  const mealTypeConfig = {
    breakfast: { icon: Coffee, label: 'Breakfast', color: 'yellow' },
    lunch: { icon: Utensils, label: 'Lunch', color: 'orange' },
    dinner: { icon: Pizza, label: 'Dinner', color: 'red' },
    snack: { icon: Apple, label: 'Snack', color: 'green' },
  }

  const calculateDailyTotals = (date: string): DailyTotals => {
    const logsForDay = foodLogs.filter(
      (log) => new Date(log.consumedAt).toDateString() === new Date(date).toDateString()
    )

    return {
      calories: logsForDay.reduce((sum, log) => sum + (log.calories || 0), 0),
      protein: logsForDay.reduce((sum, log) => sum + (log.protein || 0), 0),
      carbs: logsForDay.reduce((sum, log) => sum + (log.carbs || 0), 0),
      fat: logsForDay.reduce((sum, log) => sum + (log.fat || 0), 0),
      meals: logsForDay.length,
    }
  }

  const getTodayTotals = (): DailyTotals => {
    return calculateDailyTotals(new Date().toISOString())
  }

  const groupLogsByDate = () => {
    const grouped: Record<string, FoodLog[]> = {}
    foodLogs.forEach((log) => {
      const date = new Date(log.consumedAt).toDateString()
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(log)
    })
    return Object.entries(grouped).sort(
      ([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()
    )
  }

  const todayTotals = getTodayTotals()

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition Diary</h1>
          <p className="text-gray-600">Track your meals and nutritional intake</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Meal
        </Button>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Calories</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(todayTotals.calories)}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Protein</p>
            <p className="text-2xl font-bold text-blue-600">{Math.round(todayTotals.protein)}</p>
            <p className="text-xs text-gray-500">grams</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Carbs</p>
            <p className="text-2xl font-bold text-orange-600">{Math.round(todayTotals.carbs)}</p>
            <p className="text-xs text-gray-500">grams</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Fat</p>
            <p className="text-2xl font-bold text-purple-600">{Math.round(todayTotals.fat)}</p>
            <p className="text-xs text-gray-500">grams</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Meals</p>
            <p className="text-2xl font-bold text-green-600">{todayTotals.meals}</p>
            <p className="text-xs text-gray-500">logged</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Log a Meal</CardTitle>
            <CardDescription>Record what you ate</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mealType">Meal Type</Label>
                  <Select
                    value={formData.mealType}
                    onValueChange={(value) => setFormData({ ...formData, mealType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                      <SelectItem value="lunch">☀️ Lunch</SelectItem>
                      <SelectItem value="dinner">🌙 Dinner</SelectItem>
                      <SelectItem value="snack">🍎 Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="consumedAt">Date & Time</Label>
                  <Input
                    type="datetime-local"
                    id="consumedAt"
                    value={formData.consumedAt}
                    onChange={(e) => setFormData({ ...formData, consumedAt: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="foodName">Food / Meal Name</Label>
                <Input
                  id="foodName"
                  placeholder="e.g., Grilled chicken salad"
                  value={formData.foodName}
                  onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="calories">Calories (kcal)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="calories"
                    placeholder="450"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="protein"
                    placeholder="35"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="carbs"
                    placeholder="40"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="fat"
                    placeholder="15"
                    value={formData.fat}
                    onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Tasted great, felt full for hours..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Meal</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Food Logs by Date */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : foodLogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No meals logged yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your nutrition by logging your first meal</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log First Meal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupLogsByDate().map(([date, logs]) => {
            const dailyTotals = calculateDailyTotals(date)
            const isToday = date === new Date().toDateString()

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
                      <CardDescription>{logs.length} meals logged</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(dailyTotals.calories)} <span className="text-sm text-gray-500">kcal</span>
                      </div>
                      <div className="text-xs text-gray-600 space-x-2">
                        <span className="text-blue-600">{Math.round(dailyTotals.protein)}g P</span>
                        <span className="text-orange-600">{Math.round(dailyTotals.carbs)}g C</span>
                        <span className="text-purple-600">{Math.round(dailyTotals.fat)}g F</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {logs.map((log) => {
                      const config = mealTypeConfig[log.mealType as keyof typeof mealTypeConfig]
                      const Icon = config.icon

                      return (
                        <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`p-2 bg-${config.color}-100 rounded-lg`}>
                            <Icon className={`h-5 w-5 text-${config.color}-600`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{log.foodName}</h4>
                              <span className="text-sm text-gray-500">
                                {new Date(log.consumedAt).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="inline-flex items-center gap-1 mr-3">
                                <span className="font-medium">{config.label}</span>
                              </span>
                              {log.calories && (
                                <span className="mr-3">{Math.round(log.calories)} cal</span>
                              )}
                            </p>
                            {(log.protein || log.carbs || log.fat) && (
                              <div className="flex gap-4 text-xs mb-2">
                                {log.protein && (
                                  <span className="text-blue-600 font-medium">
                                    {Math.round(log.protein)}g protein
                                  </span>
                                )}
                                {log.carbs && (
                                  <span className="text-orange-600 font-medium">
                                    {Math.round(log.carbs)}g carbs
                                  </span>
                                )}
                                {log.fat && (
                                  <span className="text-purple-600 font-medium">
                                    {Math.round(log.fat)}g fat
                                  </span>
                                )}
                              </div>
                            )}
                            {log.notes && (
                              <p className="text-sm text-gray-600 italic">{log.notes}</p>
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
