# Vercel Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Build Errors

#### Issue: Missing Resend API Key
**Error:** `Error: Missing API key. Pass it to the constructor`
**Solution:** ✅ FIXED - Using lazy initialization in `lib/email.ts`

#### Issue: Missing qrcode package
**Error:** `Module not found: Can't resolve 'qrcode'`
**Solution:** ✅ FIXED - Added to `package.json` dependencies

#### Issue: TypeScript errors
**Error:** Property 'name' does not exist on type 'ParsedResult'
**Solution:** ✅ FIXED - Changed to `testName` in labs page

### 2. Environment Variables

**Required for Vercel:**
```
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
OPENAI_API_KEY=sk-proj-...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
RESEND_API_KEY=re_...
```

**Important Notes:**
- `DATABASE_URL` must be PostgreSQL (not SQLite) for Vercel
- `NEXTAUTH_URL` must match your production domain
- All keys must be set in Vercel Project Settings → Environment Variables

### 3. Database Migration

**For First Deployment:**
1. Set up PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.)
2. Update `DATABASE_URL` in Vercel env vars
3. Vercel will automatically run migrations on first build

**Manual Migration (if needed):**
```bash
npx prisma migrate deploy
```

### 4. Build Command Issues

**Default Build Command:** `npm run build`
**Vercel auto-detects:** Next.js 15 with Turbopack

If build fails, try:
- Check Node.js version (should be 18.x or higher)
- Verify all dependencies are in `package.json`
- Check for `.next` cache issues (Vercel clears this automatically)

### 5. Common Fixes

#### Clear Vercel Build Cache
In Vercel Dashboard:
1. Go to Project Settings
2. Click "Clear Build Cache"
3. Redeploy

#### Rebuild with Fresh Install
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### 6. Checking Logs

**Vercel Deployment Logs:**
1. Go to Vercel Dashboard
2. Click on your deployment
3. View "Building" and "Runtime" logs
4. Look for specific error messages

**Runtime Errors:**
- Check Function Logs in Vercel Dashboard
- Enable detailed logging in production

### 7. Current Status

✅ Production build successful locally
✅ All TypeScript errors resolved
✅ All dependencies installed
✅ Email system with lazy loading
✅ QRCode package added
✅ Doctor name updated throughout

### 8. Deployment Checklist

Before deploying:
- [ ] Local build successful (`npm run build`)
- [ ] All environment variables ready
- [ ] PostgreSQL database created
- [ ] Database URL ready
- [ ] Git changes committed and pushed
- [ ] Vercel project connected to GitHub repo

### 9. Post-Deployment

After successful deployment:
- [ ] Test user registration
- [ ] Test login
- [ ] Test AI chat
- [ ] Test appointment booking
- [ ] Verify email notifications
- [ ] Check all dashboard pages

### 10. Support

If you encounter an error:
1. Copy the exact error message
2. Check which file/line it references
3. Share the error for specific troubleshooting

**GitHub Repository:** https://github.com/cddurgun/health-companion
**Latest Commit:** d98cac8

---

**Last Updated:** 2025-10-08
**Build Status:** ✅ PASSING
