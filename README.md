# 🏥 Health Companion

A comprehensive health management platform with AI-powered insights, telehealth appointments, and personal health tracking.

## ✨ Features

- 🤖 **AI Health Chat** - Talk to your AI health companion powered by OpenAI GPT-4
- 📊 **Health Score Dashboard** - Track your overall health across 8 dimensions
- 📅 **Telehealth Appointments** - Book virtual appointments with automatic Zoom link generation
- 💊 **Medication Tracking** - Manage your medications and prescriptions
- 🩺 **Vital Signs Monitoring** - Track blood pressure, heart rate, temperature, and more
- 🧪 **Lab Results Repository** - Upload and AI-extract lab reports with GPT-4 Vision
- 🆘 **Emergency Medical ID** - QR code-enabled emergency medical card
- 🧠 **AI Health Twin** - Pattern recognition and predictive health insights
- 📈 **Health Analytics** - Sleep, exercise, nutrition, mood, and pain tracking
- ✉️ **Email Notifications** - Automatic appointment confirmations with Zoom links

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.4 with TypeScript
- **Database:** Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Authentication:** NextAuth.js v4
- **AI:** OpenAI GPT-4 & GPT-4 Vision
- **Email:** Resend API
- **Styling:** Tailwind CSS v3 + Shadcn/ui
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Resend API key (for emails)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd health-companion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
- `RESEND_API_KEY` - Get from https://resend.com/api-keys
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📦 Database Schema

The application includes 15+ Prisma models:
- User, Account, Session
- Appointment, Medication, Symptom
- VitalSign, LabResult
- FoodLog, PainLog, MoodEntry
- ExerciseLog, SleepLog
- HealthScore, EmergencyContact, Achievement

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Update `DATABASE_URL` to PostgreSQL connection string
5. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://your-domain.vercel.app"
RESEND_API_KEY="re_..."
```

## 📧 Email Configuration

The app sends appointment confirmations to:
- Patient's email
- Doctor's email (cdenizcandurgun@gmail.com)

Each email includes:
- Appointment details
- Zoom meeting ID, password, and join link
- Pre-appointment checklist

## 🔐 Authentication

- Credential-based authentication with NextAuth.js
- Secure password hashing with bcryptjs
- Session management with JWT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍⚕️ Medical Disclaimer

This application is for informational purposes only and does not constitute medical advice. Always consult with qualified healthcare professionals for medical decisions.

---

Built with ❤️ using Next.js and AI
