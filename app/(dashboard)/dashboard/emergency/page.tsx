'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Plus, Trash2, Download, ExternalLink, User, Phone, Heart } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import QRCode from 'qrcode'
import { useSession } from 'next-auth/react'

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string | null
  isPrimary: boolean
  createdAt: string
}

interface UserProfile {
  bloodType?: string | null
  conditions?: string
  allergies?: string
}

export default function EmergencyPage() {
  const { data: session } = useSession()
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [profile, setProfile] = useState<UserProfile>({})
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [emergencyId, setEmergencyId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'spouse',
    phone: '',
    email: '',
    isPrimary: false,
  })

  useEffect(() => {
    fetchEmergencyData()
  }, [])

  const fetchEmergencyData = async () => {
    try {
      const [contactsRes, profileRes] = await Promise.all([
        fetch('/api/emergency/contacts'),
        fetch('/api/emergency/profile'),
      ])

      const contactsData = await contactsRes.json()
      const profileData = await profileRes.json()

      setContacts(contactsData.contacts || [])
      setProfile(profileData.profile || {})
      setEmergencyId(profileData.emergencyId || '')

      // Generate QR code
      if (profileData.emergencyId) {
        const url = `${window.location.origin}/emergency/${profileData.emergencyId}`
        const qr = await QRCode.toDataURL(url, { width: 300, margin: 2 })
        setQrCodeUrl(qr)
      }
    } catch (error) {
      console.error('Failed to fetch emergency data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/emergency/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await fetchEmergencyData()
        setShowAddForm(false)
        setFormData({
          name: '',
          relationship: 'spouse',
          phone: '',
          email: '',
          isPrimary: false,
        })
      }
    } catch (error) {
      console.error('Failed to add contact:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this emergency contact?')) return

    try {
      const res = await fetch(`/api/emergency/contacts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchEmergencyData()
      }
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.download = 'emergency-medical-id.png'
    link.href = qrCodeUrl
    link.click()
  }

  const handleViewEmergencyCard = () => {
    window.open(`/emergency/${emergencyId}`, '_blank')
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Medical ID</h1>
          <p className="text-gray-600">Critical information accessible in emergencies</p>
        </div>
        <div className="flex gap-2">
          {emergencyId && (
            <>
              <Button variant="outline" onClick={handleViewEmergencyCard}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Card
              </Button>
              <Button variant="outline" onClick={handleDownloadQR}>
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Alert Banner */}
      <Card className="mb-6 border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">In Case of Emergency</h4>
              <p className="text-sm text-gray-700">
                First responders can scan your QR code or visit your emergency ID link to access critical
                medical information. Keep this card saved on your phone or printed in your wallet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency QR Code</CardTitle>
            <CardDescription>Scan for instant access to medical information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {qrCodeUrl ? (
              <>
                <img src={qrCodeUrl} alt="Emergency Medical ID QR Code" className="mb-4" />
                <p className="text-sm text-gray-600 text-center mb-4">
                  Save this QR code on your phone lock screen or print it for your wallet
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleDownloadQR}>
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button variant="outline" onClick={handleViewEmergencyCard}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview Card
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No emergency ID generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Medical Information</CardTitle>
            <CardDescription>Visible to emergency responders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Name</p>
                <p className="text-lg font-semibold text-gray-900">{session?.user?.name || 'Not set'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Blood Type</p>
                <p className="text-lg font-semibold text-red-600">{profile.bloodType || 'Not set'}</p>
              </div>

              {profile.allergies && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">⚠️ Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(profile.allergies).map((allergy: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.conditions && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Medical Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(profile.conditions).map((condition: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/dashboard/profile">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile Information
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>People to call in case of emergency</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isPrimary" className="cursor-pointer">
                  Set as primary contact
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Contact</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Contacts List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No emergency contacts</h3>
              <p className="text-gray-600 mb-4">Add contacts who should be notified in emergencies</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Contact
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 rounded-lg border-2 ${
                    contact.isPrimary
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                        {contact.isPrimary && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 capitalize mb-2">{contact.relationship}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center gap-1 text-gray-700">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </span>
                        {contact.email && (
                          <span className="text-gray-600">{contact.email}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
