'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Calendar, Heart } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <User className="h-8 w-8 text-blue-600" />
          Your Profile
        </h1>
        <p className="text-gray-600">
          Manage your account and health information
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-2xl">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {session?.user?.name || 'User'}
                </h3>
                <p className="text-gray-600">{session?.user?.email}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{session?.user?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Full Name</p>
                  <p className="text-gray-900">{session?.user?.name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Member Since</p>
                  <p className="text-gray-900">October 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Health Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p className="mb-4">
              Your health profile helps personalize recommendations and care.
            </p>
            <div className="space-y-2 text-xs">
              <p><strong>Conditions:</strong> Not set</p>
              <p><strong>Allergies:</strong> Not set</p>
              <p><strong>Health Goals:</strong> Not set</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Cards */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
          <CardDescription>
            Your data is encrypted and securely stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>✓ End-to-end encryption for all health data</p>
            <p>✓ HIPAA compliant data handling</p>
            <p>✓ Your data is never shared without consent</p>
            <p>✓ Regular security audits and updates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
