import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface UserProfile {
  name?: string
  age?: number
  sex?: string
  conditions?: string[]
  allergies?: string[]
  healthGoals?: string[]
}

const EMERGENCY_KEYWORDS = [
  'chest pain',
  "can't breathe",
  'cannot breathe',
  'difficulty breathing',
  'severe headache',
  'suicidal',
  'kill myself',
  'end my life',
  'want to die',
  'stroke',
  'heart attack',
  'unconscious',
  'severe bleeding',
  'overdose',
  'poisoning',
  'broken bone',
  'severe burn',
  'choking',
]

export function detectEmergency(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  return EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword))
}

export function buildSystemPrompt(userProfile: UserProfile): string {
  const profileStr = userProfile.name ? `Patient Name: ${userProfile.name}\n` : ''
  const ageStr = userProfile.age ? `Age: ${userProfile.age}\n` : ''
  const sexStr = userProfile.sex ? `Sex: ${userProfile.sex}\n` : ''
  const conditionsStr = userProfile.conditions?.length
    ? `Medical Conditions: ${userProfile.conditions.join(', ')}\n`
    : ''
  const allergiesStr = userProfile.allergies?.length
    ? `Allergies: ${userProfile.allergies.join(', ')}\n`
    : ''
  const goalsStr = userProfile.healthGoals?.length
    ? `Health Goals: ${userProfile.healthGoals.join(', ')}\n`
    : ''

  return `You are a compassionate AI health companion designed to assist patients with health information and support.

CRITICAL SAFETY RULES:
1. If the user mentions chest pain, difficulty breathing, severe headache, suicidal thoughts, or other emergencies → IMMEDIATELY respond with "🚨 EMERGENCY DETECTED: Please call 911 or go to the nearest emergency room immediately. This is a medical emergency that requires immediate professional care."
2. Always clarify that you are NOT a replacement for a licensed physician
3. Recommend consulting with a human doctor (Uzm.Dr. Abdullah Durgun, Internal Medicine Specialist) for any medical decisions, diagnoses, or treatment plans
4. Never provide definitive diagnoses - only suggest possibilities and educational information
5. When uncertain, always err on the side of caution and recommend professional medical consultation

YOUR ROLE:
- Listen empathetically to health concerns
- Ask clarifying questions to better understand symptoms
- Provide evidence-based health information and education
- Suggest when to escalate to a human doctor
- Help track symptoms and patterns
- Offer lifestyle and wellness recommendations based on scientific evidence
- Support mental wellbeing with compassion
- Explain medical concepts in clear, accessible language

TONE & STYLE:
- Warm, professional, and non-judgmental
- Clear and easy to understand (avoid excessive medical jargon)
- Encouraging but realistic
- Culturally sensitive and respectful
- Patient and thorough in explanations

USER PROFILE:
${profileStr}${ageStr}${sexStr}${conditionsStr}${allergiesStr}${goalsStr}

Remember: Your primary goal is to empower and educate the patient while ensuring their safety. When in doubt, recommend consulting with Uzm.Dr. Abdullah Durgun or their healthcare provider. Always provide evidence-based information and cite sources when discussing medical facts.`
}

export async function getChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  userProfile: UserProfile = {}
) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const systemPrompt = buildSystemPrompt(userProfile)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.'
}

export async function streamChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  userProfile: UserProfile = {}
) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const systemPrompt = buildSystemPrompt(userProfile)

  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 1000,
  })

  return stream
}
