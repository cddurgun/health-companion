'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Activity, Pill, Calendar, TrendingUp, Heart } from 'lucide-react'
import Link from 'next/link'
import { HealthTip } from '@prisma/client'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [healthTip, setHealthTip] = useState<HealthTip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/health-tips/daily')
      .then(res => res.json())
      .then(data => {
        setHealthTip(data.tip)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const firstName = session?.user?.name?.split(' ')[0] || 'there'

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-gray-600">
          Here's an overview of your health journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Active Chats"
          value="3"
          icon={<MessageSquare className="h-5 w-5" />}
          trend="+2 this week"
          color="blue"
        />
        <StatsCard
          title="Symptoms Tracked"
          value="12"
          icon={<Activity className="h-5 w-5" />}
          trend="5 resolved"
          color="green"
        />
        <StatsCard
          title="Medications"
          value="4"
          icon={<Pill className="h-5 w-5" />}
          trend="All on track"
          color="purple"
        />
        <StatsCard
          title="Appointments"
          value="2"
          icon={<Calendar className="h-5 w-5" />}
          trend="Next: Oct 15"
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Health Tip of the Day */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl">Health Tip of the Day</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : healthTip ? (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{healthTip.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {healthTip.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {healthTip.content}
                    </p>
                  </div>
                </div>
                {healthTip.evidence && (
                  <p className="text-sm text-gray-500 mt-4 pt-4 border-t">
                    <strong>Evidence:</strong> {healthTip.evidence}
                  </p>
                )}
                <Link href="/dashboard/health-tips">
                  <Button variant="outline" className="mt-4">
                    View All Health Tips
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-gray-600">No health tips available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/chat">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start AI Chat
              </Button>
            </Link>
            <Link href="/dashboard/symptoms">
              <Button variant="outline" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                Log Symptom
              </Button>
            </Link>
            <Link href="/dashboard/medications">
              <Button variant="outline" className="w-full justify-start">
                <Pill className="mr-2 h-4 w-4" />
                Track Medication
              </Button>
            </Link>
            <Link href="/dashboard/appointments">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest health interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ActivityItem
              icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
              title="Chat with AI Companion"
              description="Discussed sleep quality concerns"
              time="2 hours ago"
            />
            <ActivityItem
              icon={<Activity className="h-5 w-5 text-green-600" />}
              title="Logged Symptom"
              description="Mild headache, severity: 3/10"
              time="1 day ago"
            />
            <ActivityItem
              icon={<Pill className="h-5 w-5 text-purple-600" />}
              title="Medication Taken"
              description="Vitamin D3 - 1000 IU"
              time="1 day ago"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({ title, value, icon, trend, color }: {
  title: string
  value: string
  icon: React.ReactNode
  trend: string
  color: string
}) {
  const colorMap: any = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <div className={`p-2 rounded-lg ${colorMap[color]}`}>
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </p>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ icon, title, description, time }: {
  icon: React.ReactNode
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
      <div className="p-2 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </div>
  )
}
