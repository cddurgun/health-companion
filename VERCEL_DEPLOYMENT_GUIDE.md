# Vercel Deployment Guide

This guide will help you deploy the Health Companion app to Vercel successfully.

## Prerequisites

- GitHub account with this repository
- Vercel account (free tier works)
- OpenAI API key
- Resend API key (for email functionality)

## Step 1: Set Up PostgreSQL Database

Vercel requires a PostgreSQL database. Choose one of these options:

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Click on the "Storage" tab
3. Create a new "Postgres" database
4. Copy the `DATABASE_URL` connection string

### Option B: Neon (Free Tier Available)

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the PostgreSQL connection string

### Option C: Supabase (Free Tier Available)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the "Connection string" (URI format)

## Step 2: Deploy to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. Add Environment Variables (click "Environment Variables"):

```env
DATABASE_URL=postgresql://[your-postgres-connection-string]
OPENAI_API_KEY=sk-proj-[your-openai-key]
NEXTAUTH_SECRET=[your-nextauth-secret]
RESEND_API_KEY=re_[your-resend-key]
```

**Important Notes:**
- `DATABASE_URL`: Use the PostgreSQL connection string from Step 1
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: **DO NOT SET THIS** - it's auto-detected on Vercel
- All environment variables should be set for **Production**, **Preview**, and **Development**

6. Click "Deploy"

## Step 3: Initialize Database

After successful deployment, you need to set up the database schema:

### Method 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run Prisma migrations
vercel env pull .env.production
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

### Method 2: Manual Migration

1. Clone your repository locally
2. Update `.env` with your production PostgreSQL connection string
3. Run migrations:
```bash
npx prisma migrate deploy
npx prisma db seed  # Optional: seed initial data
```

## Step 4: Verify Deployment

1. Visit your deployed app URL (e.g., `https://your-app.vercel.app`)
2. Test signup with a new account
3. Test login
4. Test dashboard features
5. Test appointment booking (verify email delivery)
6. Test lab results upload (should work with base64 storage)

## Common Issues & Solutions

### Issue: "Database connection failed"

**Solution:**
- Verify `DATABASE_URL` is correct in Vercel environment variables
- Ensure the PostgreSQL database is accessible (not behind firewall)
- Check if SSL is required (add `?sslmode=require` to connection string)

### Issue: "NextAuth configuration error"

**Solution:**
- Make sure `NEXTAUTH_SECRET` is set
- Do NOT set `NEXTAUTH_URL` in Vercel - it's auto-detected
- Redeploy after changing environment variables

### Issue: "Email not sending"

**Solution:**
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- Verify domain is verified in Resend (for custom domains)

### Issue: "OpenAI API errors"

**Solution:**
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has credits
- Ensure API key has proper permissions

### Issue: "Build fails with Prisma errors"

**Solution:**
- Make sure `prisma/schema.prisma` has `provider = "postgresql"`
- Verify `postinstall` script in `package.json` includes `prisma generate`
- Clear build cache in Vercel and redeploy

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/db` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes | `sk-proj-...` |
| `NEXTAUTH_SECRET` | Secret for NextAuth sessions | Yes | Generate with `openssl rand -base64 32` |
| `RESEND_API_KEY` | Resend API key for emails | Yes | `re_...` |
| `NEXTAUTH_URL` | Base URL (auto-detected) | No | Leave empty on Vercel |

## Post-Deployment Tasks

1. **Custom Domain**: Add your custom domain in Vercel dashboard
2. **Analytics**: Enable Vercel Analytics (optional)
3. **Monitoring**: Set up error tracking (Sentry, etc.)
4. **Backup**: Set up regular database backups
5. **SSL**: Vercel provides automatic SSL certificates

## Updating the Deployment

When you push changes to GitHub:
1. Vercel automatically detects the changes
2. Builds and deploys the new version
3. No manual intervention needed

To manually redeploy:
```bash
vercel --prod
```

## Local Development vs Production

**Local (Development):**
- Uses SQLite database (`file:./dev.db`)
- Debug logging enabled
- Turbopack enabled for faster builds

**Production (Vercel):**
- Uses PostgreSQL database
- Debug logging disabled
- Optimized production build
- File uploads use base64 (database storage)

## Support

For issues:
1. Check Vercel deployment logs
2. Check database connection
3. Verify all environment variables
4. Review [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md)

## Security Notes

- Never commit `.env` file to Git
- Rotate API keys regularly
- Use strong `NEXTAUTH_SECRET`
- Enable 2FA on Vercel account
- Review Vercel security settings

---

**Congratulations!** Your Health Companion app should now be running on Vercel.
