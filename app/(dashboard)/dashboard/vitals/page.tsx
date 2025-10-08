'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Activity, Droplets, Thermometer, Gauge, Weight, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface VitalSign {
  id: string
  type: string
  systolic?: number | null
  diastolic?: number | null
  value?: number | null
  unit: string
  notes?: string | null
  measuredAt: string
  createdAt: string
}

export default function VitalsPage() {
  const [vitals, setVitals] = useState<VitalSign[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'blood_pressure',
    systolic: '',
    diastolic: '',
    value: '',
    measuredAt: new Date().toISOString().slice(0, 16),
    notes: '',
  })

  useEffect(() => {
    fetchVitals()
  }, [])

  const fetchVitals = async () => {
    try {
      const res = await fetch('/api/vitals')
      const data = await res.json()
      setVitals(data)
    } catch (error) {
      console.error('Failed to fetch vitals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: any = {
      type: formData.type,
      measuredAt: new Date(formData.measuredAt).toISOString(),
      notes: formData.notes || undefined,
    }

    // Blood pressure needs both systolic and diastolic
    if (formData.type === 'blood_pressure') {
      payload.systolic = parseInt(formData.systolic)
      payload.diastolic = parseInt(formData.diastolic)
    } else {
      payload.value = parseFloat(formData.value)
    }

    try {
      const res = await fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchVitals()
        setShowAddForm(false)
        setFormData({
          type: 'blood_pressure',
          systolic: '',
          diastolic: '',
          value: '',
          measuredAt: new Date().toISOString().slice(0, 16),
          notes: '',
        })
      }
    } catch (error) {
      console.error('Failed to add vital sign:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this measurement?')) return

    try {
      const res = await fetch(`/api/vitals/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchVitals()
      }
    } catch (error) {
      console.error('Failed to delete vital sign:', error)
    }
  }

  const vitalTypeConfig = {
    blood_pressure: { icon: Heart, label: 'Blood Pressure', unit: 'mmHg', color: 'red' },
    heart_rate: { icon: Activity, label: 'Heart Rate', unit: 'bpm', color: 'pink' },
    spo2: { icon: Droplets, label: 'Oxygen Saturation', unit: '%', color: 'blue' },
    temperature: { icon: Thermometer, label: 'Temperature', unit: '°F', color: 'orange' },
    glucose: { icon: Gauge, label: 'Blood Glucose', unit: 'mg/dL', color: 'purple' },
    weight: { icon: Weight, label: 'Weight', unit: 'kg', color: 'green' },
  }

  const groupedVitals = vitals.reduce((acc, vital) => {
    if (!acc[vital.type]) acc[vital.type] = []
    acc[vital.type].push(vital)
    return acc
  }, {} as Record<string, VitalSign[]>)

  const calculateAverage = (vitalList: VitalSign[], field: 'value' | 'systolic' | 'diastolic') => {
    const values = vitalList.map(v => v[field]).filter(Boolean) as number[]
    if (values.length === 0) return null
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
  }

  const calculateTrend = (vitalList: VitalSign[], field: 'value' | 'systolic' | 'diastolic') => {
    if (vitalList.length < 2) return null
    const recent = vitalList[0][field]
    const previous = vitalList[1][field]
    if (!recent || !previous) return null
    return recent > previous ? 'up' : recent < previous ? 'down' : 'stable'
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vital Signs Tracker</h1>
          <p className="text-gray-600">Monitor your key health metrics over time</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Measurement
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Measurement</CardTitle>
            <CardDescription>Record a vital sign measurement</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Measurement Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                      <SelectItem value="heart_rate">Heart Rate</SelectItem>
                      <SelectItem value="spo2">Oxygen Saturation (SpO2)</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="glucose">Blood Glucose</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="measuredAt">Date & Time</Label>
                  <Input
                    type="datetime-local"
                    id="measuredAt"
                    value={formData.measuredAt}
                    onChange={(e) => setFormData({ ...formData, measuredAt: e.target.value })}
                    required
                  />
                </div>
              </div>

              {formData.type === 'blood_pressure' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="systolic">Systolic (top number)</Label>
                    <Input
                      type="number"
                      id="systolic"
                      placeholder="120"
                      value={formData.systolic}
                      onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolic">Diastolic (bottom number)</Label>
                    <Input
                      type="number"
                      id="diastolic"
                      placeholder="80"
                      value={formData.diastolic}
                      onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="value">
                    Value ({vitalTypeConfig[formData.type as keyof typeof vitalTypeConfig]?.unit})
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    id="value"
                    placeholder={formData.type === 'temperature' ? '98.6' : ''}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Any observations or context..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Measurement</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Vital Signs by Type */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : Object.keys(groupedVitals).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vital signs recorded yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your health metrics by adding your first measurement</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Measurement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.entries(groupedVitals).map(([type, vitalList]) => {
            const config = vitalTypeConfig[type as keyof typeof vitalTypeConfig]
            const Icon = config.icon
            const avg = calculateAverage(vitalList, type === 'blood_pressure' ? 'systolic' : 'value')
            const trend = calculateTrend(vitalList, type === 'blood_pressure' ? 'systolic' : 'value')

            return (
              <Card key={type}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-${config.color}-100`}>
                        <Icon className={`h-6 w-6 text-${config.color}-600`} />
                      </div>
                      <div>
                        <CardTitle>{config.label}</CardTitle>
                        <CardDescription>{vitalList.length} measurements</CardDescription>
                      </div>
                    </div>
                    {avg && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {avg} {config.unit}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                          {trend === 'up' && <TrendingUp className="h-3 w-3 text-red-500" />}
                          {trend === 'down' && <TrendingDown className="h-3 w-3 text-green-500" />}
                          <span>Average</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vitalList.slice(0, 5).map((vital) => (
                      <div key={vital.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {type === 'blood_pressure'
                                ? `${vital.systolic}/${vital.diastolic}`
                                : vital.value}{' '}
                              {vital.unit}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(vital.measuredAt).toLocaleString()}
                            </span>
                          </div>
                          {vital.notes && (
                            <p className="text-sm text-gray-600 mt-1">{vital.notes}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(vital.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {vitalList.length > 5 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        + {vitalList.length - 5} more measurements
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
