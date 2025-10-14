'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, ArrowLeft, Mail, MessageSquare, Phone, Calendar, AlertCircle, FileText } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">HealthCompanion</h1>
          </Link>
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We&apos;re here to help! Get assistance with your HealthCompanion account, technical issues, or medical questions.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Email Support */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex p-3 rounded-lg bg-blue-100 text-blue-600 w-fit mb-2">
                <Mail className="h-6 w-6" />
              </div>
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Get help via email within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>General Support:</strong>
                </p>
                <a href="mailto:support@healthcompanion.app" className="text-blue-600 hover:underline block">
                  support@healthcompanion.app
                </a>
                <p className="text-sm text-gray-700 mt-4">
                  <strong>Privacy Inquiries:</strong>
                </p>
                <a href="mailto:privacy@healthcompanion.app" className="text-blue-600 hover:underline block">
                  privacy@healthcompanion.app
                </a>
                <p className="text-sm text-gray-700 mt-4">
                  <strong>Technical Issues:</strong>
                </p>
                <a href="mailto:tech@healthcompanion.app" className="text-blue-600 hover:underline block">
                  tech@healthcompanion.app
                </a>
              </div>
            </CardContent>
          </Card>

          {/* In-App Chat */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex p-3 rounded-lg bg-green-100 text-green-600 w-fit mb-2">
                <MessageSquare className="h-6 w-6" />
              </div>
              <CardTitle>AI Chat Assistant</CardTitle>
              <CardDescription>Get instant answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Our AI health assistant is available 24/7 to answer your health questions and help you navigate the platform.
              </p>
              <Link href="/dashboard/chat">
                <Button className="w-full">
                  Start Chat
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Medical Professional */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex p-3 rounded-lg bg-purple-100 text-purple-600 w-fit mb-2">
                <Calendar className="h-6 w-6" />
              </div>
              <CardTitle>Book an Appointment</CardTitle>
              <CardDescription>Consult with our medical professional</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-2">
                <strong>Uzm.Dr. Abdullah Durgun</strong>
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Internal Medicine Specialist
              </p>
              <p className="text-gray-700 mb-4">
                Schedule a consultation for personalized medical advice and treatment plans.
              </p>
              <Link href="/dashboard/appointments">
                <Button variant="outline" className="w-full">
                  Schedule Appointment
                  <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Emergency Support */}
          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardHeader>
              <div className="inline-flex p-3 rounded-lg bg-red-100 text-red-600 w-fit mb-2">
                <AlertCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-red-600">Emergency Support</CardTitle>
              <CardDescription>For urgent medical situations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you are experiencing a medical emergency, please call emergency services immediately or visit your nearest emergency room.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 font-semibold mb-2">
                  Emergency Numbers:
                </p>
                <p className="text-red-700">
                  <strong>Turkey:</strong> 112 (Ambulance)
                </p>
                <p className="text-red-700">
                  <strong>USA:</strong> 911
                </p>
                <p className="text-red-700">
                  <strong>EU:</strong> 112
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I reset my password?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  On the login page, click &quot;Forgot Password&quot; and follow the instructions sent to your email. If you don&apos;t receive an email within a few minutes, check your spam folder or contact support at support@healthcompanion.app.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my health information secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes! We take your privacy seriously and comply with HIPAA regulations. All your health information is encrypted both in transit and at rest. We use industry-standard security measures to protect your data. For more details, please review our{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can the AI assistant diagnose medical conditions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  No. Our AI assistant provides general health information and guidance but cannot diagnose medical conditions or replace professional medical advice. For diagnoses and treatment plans, please book an appointment with Dr. Abdullah Durgun or consult your healthcare provider.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I delete my account?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  You can delete your account by going to Settings &gt; Account &gt; Delete Account. Please note that this action is permanent and will remove all your health data from our systems. If you need assistance, contact us at support@healthcompanion.app.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Currently, the basic HealthCompanion platform is free to use. Consultation fees with Dr. Abdullah Durgun are handled separately and will be communicated during the appointment booking process.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer mobile apps?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  HealthCompanion is currently a web-based application accessible at muayene.vercel.app. Our responsive design works seamlessly on mobile browsers. Native iOS and Android apps are in development and will be available soon.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex p-3 rounded-lg bg-blue-100 text-blue-600 w-fit mb-2 mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle>Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 text-sm">
                  Learn how we protect and handle your personal health information
                </p>
                <Link href="/privacy">
                  <Button variant="outline" className="w-full">
                    Read Privacy Policy
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex p-3 rounded-lg bg-green-100 text-green-600 w-fit mb-2 mx-auto">
                  <Heart className="h-6 w-6" />
                </div>
                <CardTitle>Health Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 text-sm">
                  Access personalized health tips and wellness recommendations
                </p>
                <Link href="/dashboard/health-tips">
                  <Button variant="outline" className="w-full">
                    View Health Tips
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex p-3 rounded-lg bg-purple-100 text-purple-600 w-fit mb-2 mx-auto">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 text-sm">
                  New to HealthCompanion? Learn how to make the most of our platform
                </p>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form CTA */}
        <div className="bg-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our support team is here to assist you. Send us an email and we&apos;ll get back to you within 24 hours.
          </p>
          <a href="mailto:support@healthcompanion.app">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              <Mail className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </a>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button size="lg" variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">HealthCompanion</span>
          </div>
          <p className="text-sm">
            © 2025 HealthCompanion. Empowering your health journey with AI and human care.
          </p>
        </div>
      </footer>
    </div>
  )
}
