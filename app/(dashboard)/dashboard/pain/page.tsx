'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Plus, Trash2, AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PainLog {
  id: string
  bodyPart: string
  intensity: number
  quality?: string | null
  triggers?: string | null
  relievedBy?: string | null
  notes?: string | null
  loggedAt: string
  createdAt: string
}

export default function PainPage() {
  const [painLogs, setPainLogs] = useState<PainLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    bodyPart: 'head',
    intensity: '5',
    quality: '',
    triggers: '',
    relievedBy: '',
    notes: '',
    loggedAt: new Date().toISOString().slice(0, 16),
  })

  useEffect(() => {
    fetchPainLogs()
  }, [])

  const fetchPainLogs = async () => {
    try {
      const res = await fetch('/api/pain')
      const data = await res.json()
      setPainLogs(data)
    } catch (error) {
      console.error('Failed to fetch pain logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      bodyPart: formData.bodyPart,
      intensity: parseInt(formData.intensity),
      quality: formData.quality || undefined,
      triggers: formData.triggers || undefined,
      relievedBy: formData.relievedBy || undefined,
      notes: formData.notes || undefined,
      loggedAt: new Date(formData.loggedAt).toISOString(),
    }

    try {
      const res = await fetch('/api/pain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchPainLogs()
        setShowAddForm(false)
        setFormData({
          bodyPart: 'head',
          intensity: '5',
          quality: '',
          triggers: '',
          relievedBy: '',
          notes: '',
          loggedAt: new Date().toISOString().slice(0, 16),
        })
      }
    } catch (error) {
      console.error('Failed to add pain log:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pain log?')) return

    try {
      const res = await fetch(`/api/pain/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchPainLogs()
      }
    } catch (error) {
      console.error('Failed to delete pain log:', error)
    }
  }

  const bodyPartEmojis: Record<string, string> = {
    head: '🧠',
    neck: '👔',
    shoulder: '💪',
    back: '🦴',
    chest: '💓',
    abdomen: '🫃',
    arm: '💪',
    hand: '✋',
    leg: '🦵',
    knee: '🦿',
    foot: '🦶',
    other: '📍',
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-green-100 text-green-700 border-green-200'
    if (intensity <= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (intensity <= 8) return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 3) return 'Mild'
    if (intensity <= 6) return 'Moderate'
    if (intensity <= 8) return 'Severe'
    return 'Critical'
  }

  const groupLogsByBodyPart = () => {
    const grouped: Record<string, PainLog[]> = {}
    painLogs.forEach((log) => {
      if (!grouped[log.bodyPart]) grouped[log.bodyPart] = []
      grouped[log.bodyPart].push(log)
    })
    return Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length)
  }

  const severePainLogs = painLogs.filter((log) => log.intensity >= 7)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pain Log</h1>
          <p className="text-gray-600">Track pain locations, intensity, and patterns</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Pain
        </Button>
      </div>

      {/* Severe Pain Alert */}
      {severePainLogs.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Severe Pain Detected</h4>
                <p className="text-sm text-gray-700">
                  You have {severePainLogs.length} severe pain {severePainLogs.length === 1 ? 'entry' : 'entries'} (7+ intensity).
                  If pain persists or worsens, please consult Uzm.Dr. Abdullah Durgun or seek medical attention.
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
            <CardTitle>Log Pain</CardTitle>
            <CardDescription>Record a pain episode</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bodyPart">Body Part</Label>
                  <Select
                    value={formData.bodyPart}
                    onValueChange={(value) => setFormData({ ...formData, bodyPart: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="head">🧠 Head</SelectItem>
                      <SelectItem value="neck">👔 Neck</SelectItem>
                      <SelectItem value="shoulder">💪 Shoulder</SelectItem>
                      <SelectItem value="back">🦴 Back</SelectItem>
                      <SelectItem value="chest">💓 Chest</SelectItem>
                      <SelectItem value="abdomen">🫃 Abdomen</SelectItem>
                      <SelectItem value="arm">💪 Arm</SelectItem>
                      <SelectItem value="hand">✋ Hand</SelectItem>
                      <SelectItem value="leg">🦵 Leg</SelectItem>
                      <SelectItem value="knee">🦿 Knee</SelectItem>
                      <SelectItem value="foot">🦶 Foot</SelectItem>
                      <SelectItem value="other">📍 Other</SelectItem>
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
                  <Label htmlFor="intensity">Pain Intensity</Label>
                  <span className="text-sm font-semibold text-gray-900">
                    {formData.intensity}/10 - {getIntensityLabel(parseInt(formData.intensity))}
                  </span>
                </div>
                <input
                  type="range"
                  id="intensity"
                  min="1"
                  max="10"
                  value={formData.intensity}
                  onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No pain</span>
                  <span>Worst pain</span>
                </div>
              </div>

              <div>
                <Label htmlFor="quality">Pain Quality (optional)</Label>
                <Select
                  value={formData.quality}
                  onValueChange={(value) => setFormData({ ...formData, quality: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pain type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sharp">Sharp</SelectItem>
                    <SelectItem value="dull">Dull</SelectItem>
                    <SelectItem value="throbbing">Throbbing</SelectItem>
                    <SelectItem value="burning">Burning</SelectItem>
                    <SelectItem value="stabbing">Stabbing</SelectItem>
                    <SelectItem value="aching">Aching</SelectItem>
                    <SelectItem value="cramping">Cramping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="triggers">Triggers (optional)</Label>
                  <Input
                    id="triggers"
                    placeholder="e.g., Movement, stress, weather"
                    value={formData.triggers}
                    onChange={(e) => setFormData({ ...formData, triggers: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="relievedBy">Relieved By (optional)</Label>
                  <Input
                    id="relievedBy"
                    placeholder="e.g., Rest, medication, heat"
                    value={formData.relievedBy}
                    onChange={(e) => setFormData({ ...formData, relievedBy: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Pain Log</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pain Logs */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : painLogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pain logged</h3>
            <p className="text-gray-600 mb-4">Start tracking pain to identify patterns and triggers</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log First Pain
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupLogsByBodyPart().map(([bodyPart, logs]) => {
            const avgIntensity = logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length

            return (
              <Card key={bodyPart}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{bodyPartEmojis[bodyPart] || '📍'}</span>
                      <div>
                        <CardTitle className="capitalize">{bodyPart}</CardTitle>
                        <CardDescription>{logs.length} episodes logged</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        Avg: {avgIntensity.toFixed(1)}/10
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${getIntensityColor(avgIntensity)}`}>
                        {getIntensityLabel(Math.round(avgIntensity))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getIntensityColor(log.intensity)}`}>
                                {log.intensity}/10
                              </span>
                              {log.quality && (
                                <span className="text-sm text-gray-600 capitalize">{log.quality}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(log.loggedAt).toLocaleString()}
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

                        {(log.triggers || log.relievedBy) && (
                          <div className="grid md:grid-cols-2 gap-3 text-sm mb-2">
                            {log.triggers && (
                              <div>
                                <span className="font-medium text-gray-700">Triggers: </span>
                                <span className="text-gray-600">{log.triggers}</span>
                              </div>
                            )}
                            {log.relievedBy && (
                              <div>
                                <span className="font-medium text-gray-700">Relief: </span>
                                <span className="text-gray-600">{log.relievedBy}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {log.notes && (
                          <p className="text-sm text-gray-700 italic bg-white p-2 rounded">
                            {log.notes}
                          </p>
                        )}
                      </div>
                    ))}
                    {logs.length > 5 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        + {logs.length - 5} more episodes
                      </p>
                    )}
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
