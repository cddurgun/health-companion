'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Heart, Brain, Activity, Shield, Users, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">HealthCompanion</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Your Personal Health Journey Starts Here
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Expert Health Guidance<br />
            <span className="text-blue-600">Powered by AI</span>
          </h2>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized health recommendations, track your wellness journey, and connect with healthcare professionals—all in one beautiful platform.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-12 text-sm text-gray-500 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              HIPAA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              Human Doctor Oversight
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-green-600" />
              Evidence-Based Care
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Better Health
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and features designed to empower your health journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="AI Health Companion"
            description="Chat 24/7 with our compassionate AI assistant trained on medical knowledge and tailored to your health profile."
            color="blue"
          />

          <FeatureCard
            icon={<Activity className="h-6 w-6" />}
            title="Symptom Tracker"
            description="Log and monitor your symptoms over time. Share detailed reports with your doctor for better care."
            color="green"
          />

          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="Daily Health Tips"
            description="Receive personalized, evidence-based health recommendations based on your conditions and goals."
            color="purple"
          />

          <FeatureCard
            icon={<Heart className="h-6 w-6" />}
            title="Medication Management"
            description="Never miss a dose. Track your medications, set reminders, and monitor your treatment plan."
            color="red"
          />

          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Doctor Appointments"
            description="Book and manage appointments with Uzm.Dr. Abdullah Durgun, Internal Medicine Specialist. Get expert medical care when you need it."
            color="orange"
          />

          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Emergency Detection"
            description="Our system recognizes medical emergencies and immediately guides you to appropriate care."
            color="yellow"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Create Your Profile"
              description="Sign up and tell us about your health goals, conditions, and concerns. Your data is private and secure."
            />

            <StepCard
              number="2"
              title="Start Chatting"
              description="Ask questions, log symptoms, get personalized health tips—all through our friendly AI companion."
            />

            <StepCard
              number="3"
              title="Connect with Doctors"
              description="When needed, seamlessly book appointments with our human doctors who have full context of your journey."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-blue-600 rounded-2xl p-12 text-white"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control of Your Health?
          </h3>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of people using HealthCompanion to live healthier, happier lives.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">HealthCompanion</span>
          </div>
          <p className="text-sm">
            © 2025 HealthCompanion. Empowering your health journey with AI and human care.
          </p>
          <p className="text-xs mt-2 text-gray-500">
            This platform provides health information and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  const colorMap: any = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className={`inline-flex p-3 rounded-lg ${colorMap[color]} w-fit mb-2`}>
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
        {number}
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
