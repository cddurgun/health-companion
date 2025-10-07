'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pill, Plus, Trash2, Power, PowerOff } from 'lucide-react'
import { Medication } from '@prisma/client'
import { formatDate } from '@/lib/utils'

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchMedications()
  }, [])

  const fetchMedications = async () => {
    try {
      const res = await fetch('/api/medications')
      const data = await res.json()
      setMedications(data.medications || [])
    } catch (error) {
      console.error('Error fetching medications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          name: '',
          dosage: '',
          frequency: '',
          startDate: new Date().toISOString().split('T')[0],
          notes: '',
        })
        setShowForm(false)
        fetchMedications()
      }
    } catch (error) {
      console.error('Error creating medication:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medication?')) return

    try {
      const res = await fetch(`/api/medications/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchMedications()
      }
    } catch (error) {
      console.error('Error deleting medication:', error)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/medications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      })

      if (res.ok) {
        fetchMedications()
      }
    } catch (error) {
      console.error('Error updating medication:', error)
    }
  }

  const activeMeds = medications.filter(m => m.active)
  const inactiveMeds = medications.filter(m => !m.active)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Pill className="h-8 w-8 text-purple-600" />
            Medication Tracker
          </h1>
          <p className="text-gray-600">
            Manage your medications and never miss a dose
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Medication
        </Button>
      </div>

      {/* Add Medication Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Medication</CardTitle>
            <CardDescription>
              Enter your medication details for tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medication Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Aspirin, Metformin"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 100mg, 2 tablets"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <select
                    id="frequency"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    required
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Every 4 hours">Every 4 hours</option>
                    <option value="Every 6 hours">Every 6 hours</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="Every 12 hours">Every 12 hours</option>
                    <option value="As needed">As needed</option>
                    <option value="Weekly">Weekly</option>
                  </select>
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
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Special instructions, side effects to watch for, etc."
                  rows={3}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Medication'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Medications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : medications.length === 0 ? (
        <Card className="p-12 text-center">
          <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No medications added yet</h3>
          <p className="text-gray-600 mb-4">
            Start tracking your medications for better health management
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Medication
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active Medications */}
          {activeMeds.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Power className="h-5 w-5 text-green-600" />
                Active Medications ({activeMeds.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {activeMeds.map((med) => (
                  <Card key={med.id} className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{med.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {med.dosage} • {med.frequency}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">Active</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600 mb-4">
                        <p>Started: {formatDate(med.startDate)}</p>
                        {med.notes && (
                          <div className="mt-2 bg-purple-50 rounded-lg p-3">
                            <p className="text-sm text-purple-900">
                              <strong>Notes:</strong> {med.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(med.id, med.active)}
                        >
                          <PowerOff className="h-4 w-4 mr-2" />
                          Mark Inactive
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(med.id)}
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
            </div>
          )}

          {/* Inactive Medications */}
          {inactiveMeds.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PowerOff className="h-5 w-5 text-gray-400" />
                Past Medications ({inactiveMeds.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {inactiveMeds.map((med) => (
                  <Card key={med.id} className="opacity-60 border-l-4 border-l-gray-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{med.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {med.dosage} • {med.frequency}
                          </CardDescription>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Inactive</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600 mb-4">
                        <p>Started: {formatDate(med.startDate)}</p>
                        {med.endDate && <p>Ended: {formatDate(med.endDate)}</p>}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(med.id, med.active)}
                        >
                          <Power className="h-4 w-4 mr-2" />
                          Reactivate
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(med.id)}
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
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {medications.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{medications.length}</div>
                <div className="text-sm text-gray-600">Total Medications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{activeMeds.length}</div>
                <div className="text-sm text-gray-600">Currently Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{inactiveMeds.length}</div>
                <div className="text-sm text-gray-600">Past/Inactive</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
