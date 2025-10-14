'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: October 14, 2025</p>

        <div className="prose prose-blue max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to HealthCompanion. We are committed to protecting your privacy and ensuring the security of your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application and services available at muayene.vercel.app.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using HealthCompanion, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect the following types of personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Account Information:</strong> Name, email address, password (encrypted), and profile details</li>
              <li><strong>Health Information:</strong> Symptoms, medications, vital signs, medical history, health goals, mood tracking, exercise data, nutrition information, and sleep patterns</li>
              <li><strong>Communication Data:</strong> Messages and interactions with our AI health assistant</li>
              <li><strong>Appointment Information:</strong> Scheduled appointments and related medical notes</li>
              <li><strong>Emergency Contact Information:</strong> Contact details for emergency situations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Usage Data:</strong> Information about how you interact with our services</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
              <li><strong>Log Data:</strong> Access times, pages viewed, and actions taken within the application</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Providing personalized health recommendations and insights</li>
              <li>Powering our AI health assistant to answer your health questions</li>
              <li>Tracking and analyzing your health metrics over time</li>
              <li>Scheduling and managing doctor appointments</li>
              <li>Sending medication reminders and health alerts</li>
              <li>Detecting potential medical emergencies and providing appropriate guidance</li>
              <li>Improving our services and developing new features</li>
              <li>Communicating with you about your account and services</li>
              <li>Ensuring platform security and preventing fraud</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services and SDKs</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 OpenAI API</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our AI health assistant is powered by OpenAI&apos;s GPT technology. When you chat with our AI assistant, your messages are securely transmitted to OpenAI&apos;s servers for processing. OpenAI processes this data in accordance with their privacy policy and data usage policies. We do not share your personal health information beyond what is necessary to provide the AI assistance service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Resend Email Service</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use Resend to send transactional emails such as appointment confirmations, medication reminders, and account notifications. Your email address and relevant notification content are shared with Resend for this purpose.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Vercel Hosting</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our application is hosted on Vercel (muayene.vercel.app). This means your data is stored on Vercel&apos;s infrastructure, which maintains industry-standard security practices and certifications.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4 Database Services</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use secure PostgreSQL database services to store your health information. All data is encrypted in transit and at rest.
            </p>
          </section>

          {/* Web Connectivity */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Web Connectivity and Data Transmission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HealthCompanion is a web-based application accessible at muayene.vercel.app. This means:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Internet Connection Required:</strong> You need an active internet connection to use our services</li>
              <li><strong>Secure Communication:</strong> All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS protocols (HTTPS)</li>
              <li><strong>Real-time Synchronization:</strong> Your health data is synchronized across devices when you log in from different locations</li>
              <li><strong>Cloud Storage:</strong> Your information is securely stored in the cloud, allowing you to access it from any device with internet connectivity</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement robust security measures to protect your personal health information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>End-to-end encryption for data transmission</li>
              <li>Encrypted storage of sensitive information</li>
              <li>Secure authentication using industry-standard protocols</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Compliance with HIPAA security standards</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* HIPAA Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. HIPAA Compliance</h2>
            <p className="text-gray-700 leading-relaxed">
              HealthCompanion is designed to comply with the Health Insurance Portability and Accountability Act (HIPAA) regulations. We maintain appropriate administrative, physical, and technical safeguards to protect your Protected Health Information (PHI). We will not use or disclose your health information without your authorization, except as permitted or required by law.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. How We Share Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal health information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              <li><strong>Healthcare Providers:</strong> With Dr. Abdullah Durgun and other healthcare professionals you choose to connect with</li>
              <li><strong>Service Providers:</strong> With trusted third-party service providers (OpenAI, Resend, hosting services) who help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental request</li>
              <li><strong>Emergency Situations:</strong> To protect your vital interests or those of another person</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request access to your personal health information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Export:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
              <li><strong>Restrict Processing:</strong> Request limitations on how we use your data</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal health information for as long as your account is active or as needed to provide you services. We may also retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements. If you request deletion of your account, we will delete or anonymize your information, except where we are required to retain it by law.
            </p>
          </section>

          {/* Children&apos;s Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to delete such information.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. International Users</h2>
            <p className="text-gray-700 leading-relaxed">
              If you are accessing HealthCompanion from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located. By using our services, you consent to the transfer of your information to the United States.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically for any changes. Changes are effective when posted on this page.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-2">
                <strong>Email:</strong> privacy@healthcompanion.app
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Support Page:</strong> <Link href="/support" className="text-blue-600 hover:underline">muayene.vercel.app/support</Link>
              </p>
              <p className="text-gray-800">
                <strong>Medical Professional:</strong> Uzm.Dr. Abdullah Durgun, Internal Medicine Specialist
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              HealthCompanion provides health information and tools to support your wellness journey. Our AI assistant provides general health information and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on HealthCompanion.
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button size="lg">
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
