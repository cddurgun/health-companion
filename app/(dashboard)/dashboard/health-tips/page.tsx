'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Activity, Brain, Moon, Shield, Salad } from 'lucide-react'
import { HealthTip } from '@prisma/client'

const categoryIcons: any = {
  nutrition: <Salad className="h-5 w-5" />,
  exercise: <Activity className="h-5 w-5" />,
  'mental-health': <Brain className="h-5 w-5" />,
  sleep: <Moon className="h-5 w-5" />,
  preventive: <Shield className="h-5 w-5" />,
}

const categoryColors: any = {
  nutrition: 'bg-green-100 text-green-600',
  exercise: 'bg-blue-100 text-blue-600',
  'mental-health': 'bg-purple-100 text-purple-600',
  sleep: 'bg-indigo-100 text-indigo-600',
  preventive: 'bg-orange-100 text-orange-600',
}

export default function HealthTipsPage() {
  const [tips, setTips] = useState<HealthTip[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/health-tips')
      .then(res => res.json())
      .then(data => {
        setTips(data.tips || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['all', 'nutrition', 'exercise', 'mental-health', 'sleep', 'preventive']
  const filteredTips = selectedCategory === 'all'
    ? tips
    : tips.filter(tip => tip.category === selectedCategory)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Heart className="h-8 w-8 text-blue-600" />
          Daily Health Tips
        </h1>
        <p className="text-gray-600">
          Evidence-based health recommendations to improve your wellbeing
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === 'all' ? 'All Tips' : category.replace('-', ' ')}
          </Button>
        ))}
      </div>

      {/* Tips Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-10 w-10 bg-gray-200 rounded-lg mb-2" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => (
            <Card key={tip.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`inline-flex p-3 rounded-lg ${categoryColors[tip.category]} w-fit mb-2`}>
                  {categoryIcons[tip.category] || <Heart className="h-5 w-5" />}
                </div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{tip.icon}</span>
                  {tip.title}
                </CardTitle>
                <CardDescription className="capitalize text-xs">
                  {tip.category.replace('-', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{tip.content}</p>
                {tip.evidence && (
                  <p className="text-xs text-gray-500 pt-4 border-t">
                    <strong>Evidence:</strong> {tip.evidence}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredTips.length === 0 && (
        <Card className="p-12 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tips found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </Card>
      )}
    </div>
  )
}
