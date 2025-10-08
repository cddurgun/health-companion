import { prisma } from '@/lib/prisma'
import { AlertCircle, Phone, Heart, User, Pill } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function PublicEmergencyCard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch user data by emergency ID (which is the user ID)
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      age: true,
      sex: true,
      bloodType: true,
      conditions: true,
      allergies: true,
      emergencyContacts: {
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
        take: 3,
      },
      medications: {
        where: { active: true },
        select: { name: true, dosage: true },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const allergies = user.allergies ? JSON.parse(user.allergies) : []
  const conditions = user.conditions ? JSON.parse(user.conditions) : []

  return (
    <div className="min-h-screen bg-red-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Emergency Banner */}
        <div className="bg-white rounded-lg p-6 mb-4 text-center border-4 border-red-700">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-red-600 mb-2">EMERGENCY MEDICAL ID</h1>
          <p className="text-gray-700 text-lg">
            This information is for emergency responders only
          </p>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-lg p-8 mb-4 shadow-xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-6 w-6" />
                Patient Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-xl font-semibold text-gray-900">{user.name || 'Not provided'}</p>
                </div>
                {user.age && (
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="text-lg font-semibold text-gray-900">{user.age} years old</p>
                  </div>
                )}
                {user.sex && (
                  <div>
                    <p className="text-sm text-gray-600">Sex</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{user.sex}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Blood Type</p>
                  <p className="text-2xl font-bold text-red-600">{user.bloodType || 'Unknown'}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-6 w-6" />
                Emergency Contacts
              </h2>
              <div className="space-y-3">
                {user.emergencyContacts.length === 0 ? (
                  <p className="text-gray-600">No emergency contacts listed</p>
                ) : (
                  user.emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 rounded-lg ${
                        contact.isPrimary ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-100'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">
                        {contact.name}
                        {contact.isPrimary && (
                          <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                            PRIMARY
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-700 capitalize">{contact.relationship}</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">{contact.phone}</p>
                      {contact.email && (
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Critical Medical Information */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Allergies */}
          <div className="bg-red-50 rounded-lg p-6 border-4 border-red-400">
            <h2 className="text-xl font-bold text-red-700 mb-3 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              ⚠️ ALLERGIES
            </h2>
            {allergies.length === 0 ? (
              <p className="text-gray-700">No known allergies</p>
            ) : (
              <div className="space-y-2">
                {allergies.map((allergy: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg"
                  >
                    {allergy}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Conditions */}
          <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-400">
            <h2 className="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">
              <Heart className="h-6 w-6" />
              Medical Conditions
            </h2>
            {conditions.length === 0 ? (
              <p className="text-gray-700">No conditions listed</p>
            ) : (
              <div className="space-y-2">
                {conditions.map((condition: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-yellow-200 text-yellow-900 px-3 py-2 rounded font-semibold"
                  >
                    {condition}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Medications */}
        {user.medications.length > 0 && (
          <div className="bg-white rounded-lg p-6 mt-4 border-2 border-blue-300">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="h-6 w-6 text-blue-600" />
              Active Medications
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {user.medications.map((med) => (
                <div key={med.name} className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-gray-900">{med.name}</p>
                  <p className="text-sm text-gray-700">{med.dosage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-white rounded-lg p-4 mt-4 text-center">
          <p className="text-sm text-gray-600">
            Generated by HealthCompanion Emergency Medical ID System
          </p>
          <p className="text-xs text-gray-500 mt-1">
            For emergency use only. Patient privacy protected by HIPAA.
          </p>
        </div>
      </div>
    </div>
  )
}
