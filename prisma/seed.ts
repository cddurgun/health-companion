import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create health tips
  const healthTips = [
    {
      category: 'nutrition',
      title: 'Stay Hydrated Throughout the Day',
      content: 'Drink at least 8 glasses (64 oz) of water daily. Proper hydration supports digestion, circulation, temperature regulation, and cognitive function. Start your morning with a glass of water.',
      evidence: 'American Heart Association, CDC Guidelines',
      icon: '💧',
    },
    {
      category: 'exercise',
      title: 'Move for 30 Minutes Daily',
      content: 'Aim for at least 30 minutes of moderate physical activity most days. This can include brisk walking, swimming, cycling, or dancing. Regular exercise reduces risk of chronic diseases and improves mood.',
      evidence: 'WHO Physical Activity Guidelines',
      icon: '🏃',
    },
    {
      category: 'mental-health',
      title: 'Practice Mindful Breathing',
      content: 'Take 5 minutes daily for deep breathing exercises. Inhale for 4 counts, hold for 4, exhale for 4. This activates your parasympathetic nervous system, reducing stress and anxiety.',
      evidence: 'American Psychological Association',
      icon: '🧘',
    },
    {
      category: 'sleep',
      title: 'Maintain a Consistent Sleep Schedule',
      content: 'Go to bed and wake up at the same time daily, even on weekends. Adults need 7-9 hours of sleep. Consistency helps regulate your circadian rhythm for better quality sleep.',
      evidence: 'National Sleep Foundation',
      icon: '😴',
    },
    {
      category: 'preventive',
      title: 'Wash Your Hands Regularly',
      content: 'Wash hands with soap for at least 20 seconds, especially before eating, after using the bathroom, and after being in public. This simple habit prevents most infectious diseases.',
      evidence: 'CDC Hand Hygiene Guidelines',
      icon: '🧼',
    },
    {
      category: 'nutrition',
      title: 'Eat More Colorful Vegetables',
      content: 'Aim for 5 servings of fruits and vegetables daily, focusing on variety. Different colors provide different nutrients - greens, reds, oranges, purples all offer unique health benefits.',
      evidence: 'USDA Dietary Guidelines',
      icon: '🥗',
    },
    {
      category: 'mental-health',
      title: 'Connect with Loved Ones',
      content: 'Social connections are vital for mental health. Reach out to a friend or family member today. Even a brief conversation can boost mood and reduce feelings of loneliness.',
      evidence: 'Harvard Study of Adult Development',
      icon: '❤️',
    },
    {
      category: 'exercise',
      title: 'Take Movement Breaks',
      content: 'If you sit for long periods, stand up and move for 5 minutes every hour. Simple stretches, walking around, or desk exercises can reduce health risks of prolonged sitting.',
      evidence: 'Mayo Clinic Ergonomics Research',
      icon: '🚶',
    },
    {
      category: 'sleep',
      title: 'Create a Screen-Free Bedtime Routine',
      content: 'Turn off screens (phone, TV, computer) 1 hour before bed. Blue light suppresses melatonin production. Replace with reading, stretching, or meditation for better sleep quality.',
      evidence: 'Sleep Medicine Reviews Journal',
      icon: '📱',
    },
    {
      category: 'preventive',
      title: 'Schedule Regular Health Checkups',
      content: 'See your doctor annually for preventive care, even when feeling healthy. Early detection of health issues leads to better outcomes. Keep track of your screenings and vaccinations.',
      evidence: 'American Academy of Family Physicians',
      icon: '👨‍⚕️',
    },
    {
      category: 'nutrition',
      title: 'Reduce Added Sugars',
      content: 'Limit added sugars to less than 10% of daily calories (about 50g). Check food labels - sugar hides in sauces, bread, and "healthy" snacks. Choose whole fruits over juices.',
      evidence: 'American Heart Association',
      icon: '🍬',
    },
    {
      category: 'mental-health',
      title: 'Practice Gratitude Daily',
      content: 'Write down 3 things you\'re grateful for each day. This simple practice rewires your brain toward positivity, reduces stress, and improves overall life satisfaction.',
      evidence: 'Positive Psychology Research',
      icon: '📝',
    },
  ]

  for (const tip of healthTips) {
    await prisma.healthTip.create({
      data: tip,
    })
  }

  console.log('✅ Database seeded with health tips!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
