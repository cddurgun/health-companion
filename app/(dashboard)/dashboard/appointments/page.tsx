'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarIcon, User, Plus, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Appointment } from '@prisma/client'
import { formatDate } from '@/lib/utils'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    doctorName: 'Uzm.Dr. Abdullah Durgun',
    date: '',
    time: '',
    reason: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments')
      const data = await res.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          doctorName: 'Uzm.Dr. Abdullah Durgun',
          date: '',
          time: '',
          reason: '',
          notes: '',
        })
        setShowForm(false)
        fetchAppointments()
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchAppointments()
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        fetchAppointments()
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const upcomingAppointments = appointments.filter(a =>
    a.status === 'scheduled' && new Date(a.date) >= new Date()
  )
  const pastAppointments = appointments.filter(a =>
    a.status === 'completed' || (a.status === 'scheduled' && new Date(a.date) < new Date())
  )
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-orange-600" />
            Appointments
          </h1>
          <p className="text-gray-600">
            Book and manage your appointments with Uzm.Dr. Abdullah Durgun
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-5 w-5 mr-2" />
          Book Appointment
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Doctor Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Your Doctor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Uzm.Dr. Abdullah Durgun</h3>
                <p className="text-sm text-gray-600">Internal Medicine Specialist</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Specialties:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Preventive Care</li>
                <li>Chronic Disease Management</li>
                <li>Health & Wellness Consultations</li>
                <li>Annual Physical Exams</li>
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500">
                Available Monday - Friday, 9:00 AM - 5:00 PM
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Book Appointment Form */}
        <Card className={`lg:col-span-2 ${!showForm && 'hidden'}`}>
          <CardHeader>
            <CardTitle>Book New Appointment</CardTitle>
            <CardDescription>
              Schedule your consultation with Uzm.Dr. Abdullah Durgun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Appointment Time *</Label>
                  <select
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Annual checkup, Follow-up, Specific concern"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information for the doctor..."
                  rows={3}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Booking...' : 'Book Appointment'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
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
      ) : appointments.length === 0 ? (
        <Card className="p-12 text-center">
          <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
          <p className="text-gray-600 mb-4">
            Book your first appointment with Uzm.Dr. Abdullah Durgun
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Book Appointment
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Appointments ({upcomingAppointments.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {upcomingAppointments.map((apt) => (
                  <Card key={apt.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-blue-600" />
                            {formatDate(apt.date)} at {apt.time}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            <strong>With:</strong> {apt.doctorName}
                          </CardDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(apt.status)}`}>
                          {getStatusIcon(apt.status)}
                          {apt.status}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1"><strong>Reason:</strong></p>
                        <p className="text-gray-900">{apt.reason}</p>
                      </div>

                      {apt.notes && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-blue-900">
                            <strong>Notes:</strong> {apt.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(apt.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Completed
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(apt.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Past Appointments ({pastAppointments.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pastAppointments.map((apt) => (
                  <Card key={apt.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {formatDate(apt.date)} at {apt.time}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {apt.doctorName} • {apt.reason}
                          </CardDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(apt.status)}`}>
                          {getStatusIcon(apt.status)}
                          {apt.status}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {appointments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
                <div className="text-sm text-gray-600">Total Appointments</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {appointments.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
