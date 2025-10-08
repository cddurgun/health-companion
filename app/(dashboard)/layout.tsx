'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, LayoutDashboard, MessageSquare, Activity, Pill, Calendar, User, LogOut, Menu, X, TrendingUp, Utensils, Brain, Dumbbell, Moon, Award, FlaskConical, MapPin, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'main' },
    { name: 'Health Score', href: '/dashboard/health-score', icon: Award, section: 'main' },
    { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare, section: 'main' },

    // Tracking Section
    { name: 'Vital Signs', href: '/dashboard/vitals', icon: TrendingUp, section: 'tracking' },
    { name: 'Symptoms', href: '/dashboard/symptoms', icon: Activity, section: 'tracking' },
    { name: 'Pain Log', href: '/dashboard/pain', icon: MapPin, section: 'tracking' },
    { name: 'Medications', href: '/dashboard/medications', icon: Pill, section: 'tracking' },
    { name: 'Lab Results', href: '/dashboard/labs', icon: FlaskConical, section: 'tracking' },

    // Lifestyle Section
    { name: 'Nutrition', href: '/dashboard/nutrition', icon: Utensils, section: 'lifestyle' },
    { name: 'Exercise', href: '/dashboard/exercise', icon: Dumbbell, section: 'lifestyle' },
    { name: 'Sleep', href: '/dashboard/sleep', icon: Moon, section: 'lifestyle' },
    { name: 'Mental Health', href: '/dashboard/mood', icon: Brain, section: 'lifestyle' },

    // Care Section
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar, section: 'care' },
    { name: 'Health Tips', href: '/dashboard/health-tips', icon: Heart, section: 'care' },
    { name: 'Emergency ID', href: '/dashboard/emergency', icon: AlertCircle, section: 'care' },
    { name: 'AI Insights', href: '/dashboard/insights', icon: Sparkles, section: 'care' },
    { name: 'Profile', href: '/dashboard/profile', icon: User, section: 'care' },
  ]

  const groupedNav = {
    main: navigation.filter(item => item.section === 'main'),
    tracking: navigation.filter(item => item.section === 'tracking'),
    lifestyle: navigation.filter(item => item.section === 'lifestyle'),
    care: navigation.filter(item => item.section === 'care'),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-gray-900">HealthCompanion</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-64 bg-white border-r z-40 transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="font-bold text-gray-900">HealthCompanion</h1>
                <p className="text-xs text-gray-500">Your Health Journey</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Main Section */}
            <div className="space-y-1">
              {groupedNav.main.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Tracking Section */}
            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Health Tracking
              </h3>
              <div className="space-y-1">
                {groupedNav.tracking.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Lifestyle Section */}
            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Lifestyle
              </h3>
              <div className="space-y-1">
                {groupedNav.lifestyle.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Care Section */}
            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Care & Support
              </h3>
              <div className="space-y-1">
                {groupedNav.care.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
