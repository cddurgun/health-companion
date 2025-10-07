import { User, Conversation, Message, HealthTip, Symptom, Medication, Appointment } from '@prisma/client'

export type { User, Conversation, Message, HealthTip, Symptom, Medication, Appointment }

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
}

export interface UserWithRelations extends User {
  conversations?: Conversation[]
  symptoms?: Symptom[]
  medications?: Medication[]
  appointments?: Appointment[]
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  emergency?: boolean
  createdAt?: Date
}
