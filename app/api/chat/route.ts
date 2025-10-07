import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { detectEmergency, streamChatCompletion } from '@/lib/openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, conversationId } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check for emergency keywords
    if (detectEmergency(message)) {
      return NextResponse.json({
        emergency: true,
        message: '🚨 EMERGENCY DETECTED: If you are experiencing a medical emergency, please call 911 or go to the nearest emergency room immediately. This is a potentially life-threatening situation that requires immediate professional medical attention.',
      })
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId, userId: user.id },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
      })
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          title: message.slice(0, 50),
          messages: {
            create: {
              role: 'user',
              content: message,
            },
          },
        },
        include: { messages: true },
      })
    } else {
      // Add user message to existing conversation
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: message,
        },
      })
    }

    // Build user profile for context
    const userProfile = {
      name: user.name || undefined,
      age: user.age || undefined,
      sex: user.sex || undefined,
      conditions: user.conditions ? JSON.parse(user.conditions) : undefined,
      allergies: user.allergies ? JSON.parse(user.allergies) : undefined,
      healthGoals: user.healthGoals ? JSON.parse(user.healthGoals) : undefined,
    }

    // Prepare messages for OpenAI
    const messages = conversation.messages.map((msg) => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content,
    }))

    // Stream response from OpenAI
    const stream = await streamChatCompletion(messages, userProfile)

    // Convert OpenAI stream to proper format and save response
    let fullResponse = ''
    const transformedStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          fullResponse += content
          controller.enqueue(content)
        }

        // Save assistant response to database
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: 'assistant',
            content: fullResponse,
          },
        })

        controller.close()
      },
    })

    return new Response(transformedStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Conversation-Id': conversation.id,
      },
    })

  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your message' },
      { status: 500 }
    )
  }
}
