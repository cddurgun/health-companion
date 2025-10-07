'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Activity, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { Symptom } from '@prisma/client'
import { formatDate } from '@/lib/utils'

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    severity: '5',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchSymptoms()
  }, [])

  const fetchSymptoms = async () => {
    try {
      const res = await fetch('/api/symptoms')
      const data = await res.json()
      setSymptoms(data.symptoms || [])
    } catch (error) {
      console.error('Error fetching symptoms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          severity: parseInt(formData.severity),
        }),
      })

      if (res.ok) {
        setFormData({
          location: '',
          description: '',
          severity: '5',
          startDate: new Date().toISOString().split('T')[0],
          notes: '',
        })
        setShowForm(false)
        fetchSymptoms()
      }
    } catch (error) {
      console.error('Error creating symptom:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this symptom?')) return

    try {
      const res = await fetch(`/api/symptoms/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchSymptoms()
      }
    } catch (error) {
      console.error('Error deleting symptom:', error)
    }
  }

  const handleMarkResolved = async (id: string) => {
    try {
      const res = await fetch(`/api/symptoms/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: true }),
      })

      if (res.ok) {
        fetchSymptoms()
      }
    } catch (error) {
      console.error('Error updating symptom:', error)
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'text-green-600 bg-green-100'
    if (severity <= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-600" />
            Symptom Tracker
          </h1>
          <p className="text-gray-600">
            Log and monitor your symptoms over time
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Symptom
        </Button>
      </div>

      {/* Add Symptom Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Log New Symptom</CardTitle>
            <CardDescription>
              Record details about your symptom for tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location / Body Part *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Head, Stomach, Lower back"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the symptom (e.g., throbbing pain, dull ache)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">
                  Severity: {formData.severity}/10
                </Label>
                <input
                  id="severity"
                  type="range"
                  min="1"
                  max="10"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information (triggers, treatments tried, etc.)"
                  rows={3}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Symptom'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Symptoms List */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : symptoms.length === 0 ? (
        <Card className="p-12 text-center">
          <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No symptoms logged yet</h3>
          <p className="text-gray-600 mb-4">
            Start tracking your symptoms to monitor your health over time
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Symptom
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {symptoms.map((symptom) => (
            <Card key={symptom.id} className={symptom.resolved ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {symptom.location}
                      {symptom.resolved && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Started: {formatDate(symptom.startDate)}
                      {symptom.endDate && ` • Ended: ${formatDate(symptom.endDate)}`}
                    </CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
                    {symptom.severity}/10
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{symptom.description}</p>

                {symptom.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {symptom.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {!symptom.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkResolved(symptom.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(symptom.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {symptoms.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{symptoms.length}</div>
                <div className="text-sm text-gray-600">Total Logged</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {symptoms.filter(s => s.resolved).length}
                </div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {symptoms.filter(s => !s.resolved).length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
