# Deploy Hope Jobs to Vercel - Complete Guide

## Prerequisites

✅ Vercel account (free): https://vercel.com/signup  
✅ GitHub account  
✅ MySQL database ready: `freedb_hope-jobs` at sql.freedb.tech  
✅ Gmail SMTP configured: abenitj@gmail.com  

---

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already)

```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
```

### 1.2 Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/hope-jobs.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Connect to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Select **"Import Git Repository"**
4. Choose your **Hope Jobs** repository
5. Click **"Import"**

### 2.2 Configure Project Settings

**Framework Preset**: Next.js (auto-detected)  
**Root Directory**: `./` (leave as is)  
**Build Command**: `npm run build`  
**Output Directory**: `.next` (auto)  
**Install Command**: `npm install`  

---

## Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

### Database Configuration

```
DATABASE_URL
mysql://freedb_abenitj:RQ%40tY5Q4nK3cfw%2A@sql.freedb.tech:3306/freedb_hope-jobs
```

### Authentication

```
NEXTAUTH_SECRET
hopejobs-production-secret-key-2024-change-this-to-random-string
```

**Generate a strong secret:**
```bash
openssl rand -base64 32
```

```
NEXTAUTH_URL
https://your-app-name.vercel.app
```
*Note: Update this after deployment with your actual Vercel URL*

### SMTP Email Configuration

```
SMTP_HOST
smtp.gmail.com
```

```
SMTP_PORT
587
```

```
SMTP_USER
abenitj@gmail.com
```

```
SMTP_PASS
arqsqoteqalhklll
```

```
SMTP_FROM_EMAIL
abenitj@gmail.com
```

```
SMTP_FROM_NAME
Hope Jobs
```

---

## Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (~3-5 minutes)
3. Your app will be live at: `https://your-app-name.vercel.app`

---

## Step 5: Post-Deployment Setup

### 5.1 Update NEXTAUTH_URL

1. Copy your Vercel URL (e.g., `https://hope-jobs-abc123.vercel.app`)
2. Go to **Project Settings → Environment Variables**
3. Edit `NEXTAUTH_URL` to your actual URL
4. Redeploy: **Deployments → ... → Redeploy**

### 5.2 Seed Database (First Time Only)

Option A: Use Vercel CLI
```bash
vercel env pull .env.production
npm run db:seed
```

Option B: Call API endpoint
```bash
curl -X POST https://your-app.vercel.app/api/admin/seed
```

### 5.3 Test Your Deployment

1. Visit: `https://your-app-name.vercel.app`
2. Click **Login**
3. Use credentials:
   ```
   Email: admin@hopejobs.com
   Password: Admin@123
   ```

---

## Important Notes

### ⚠️ Socket.io Limitation

**Vercel uses serverless functions** which don't support persistent connections like Socket.io.

**Impact**:
- ❌ Real-time chat won't auto-update (need to refresh)
- ✅ Chat still works (just not real-time)
- ✅ All other features work perfectly

**Solution Options**:
1. **Keep as is**: Chat works but requires page refresh
2. **Use Pusher**: Replace Socket.io with Pusher (free tier available)
3. **Use Vercel's solution**: Integrate with Vercel KV/Redis
4. **Deploy elsewhere**: Use Railway/Render for Socket.io support

### File Uploads

**On Vercel**, the `/public/uploads/` folder is temporary (serverless).

**Solutions**:
1. **Vercel Blob Storage** (recommended)
2. **Cloudinary** for images
3. **AWS S3**
4. **Supabase Storage**

For now, uploads work but may be cleared on redeployment.

---

## Vercel Configuration Files

### vercel.json (Already Created)

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### .vercelignore (Already Created)

Excludes unnecessary files from deployment:
- node_modules
- .env files
- Database files
- Documentation

---

## Environment Variables Summary

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | MySQL connection string | ✅ Yes |
| `NEXTAUTH_SECRET` | Random secret key | ✅ Yes |
| `NEXTAUTH_URL` | Your Vercel app URL | ✅ Yes |
| `SMTP_HOST` | smtp.gmail.com | ✅ Yes |
| `SMTP_PORT` | 587 | ✅ Yes |
| `SMTP_USER` | abenitj@gmail.com | ✅ Yes |
| `SMTP_PASS` | Gmail app password | ✅ Yes |
| `SMTP_FROM_EMAIL` | abenitj@gmail.com | ✅ Yes |
| `SMTP_FROM_NAME` | Hope Jobs | ✅ Yes |

---

## Deployment Commands

### Deploy via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Troubleshooting

### Build Fails

**Error**: "Prisma Client not generated"

**Solution**: The `postinstall` script automatically runs `prisma generate`

---

### Database Connection Fails

**Error**: "Can't reach database server"

**Solution**:
- Verify `DATABASE_URL` is correct
- Check database is accessible from internet
- Verify credentials are URL-encoded

---

### Authentication Not Working

**Error**: "Invalid NEXTAUTH_URL"

**Solution**:
- Make sure `NEXTAUTH_URL` matches your exact Vercel URL
- Include `https://` prefix
- No trailing slash

---

### Email Not Sending

**Error**: "SMTP connection failed"

**Solution**:
- Verify all SMTP_* variables are set
- Check Gmail app password is correct (no spaces)
- Ensure Gmail 2FA is enabled

---

## Production Checklist

Before going live:

- [ ] All environment variables configured in Vercel
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] `NEXTAUTH_URL` points to your Vercel domain
- [ ] MySQL database is accessible from internet
- [ ] Database is seeded with initial data
- [ ] Test login with demo accounts
- [ ] Test forgot password email sending
- [ ] Test file uploads
- [ ] Test all user roles (Admin, Employer, Seeker)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/logging

---

## Custom Domain (Optional)

### Add Your Own Domain

1. Go to Vercel **Project Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `hopejobs.com`)
4. Follow DNS configuration instructions
5. Update `NEXTAUTH_URL` to your custom domain

---

## Continuous Deployment

Once connected to GitHub:

✅ **Auto-deploy on push to main**
✅ **Preview deployments** for pull requests
✅ **Rollback** to previous versions anytime
✅ **Environment variables** per branch

---

## Vercel Free Tier Limits

✅ **Hobby Plan** (Free):
- 100 GB bandwidth/month
- Unlimited API requests
- 6,000 build minutes/month
- Serverless Function: 10s timeout
- Perfect for Hope Jobs!

---

## After Deployment

### Your Live URLs

```
Production: https://hope-jobs-[random].vercel.app
Custom (optional): https://hopejobs.com
```

### Test Everything

1. **Homepage**: https://your-app.vercel.app
2. **Login**: https://your-app.vercel.app/login
3. **Admin**: https://your-app.vercel.app/admin/dashboard
4. **Register**: https://your-app.vercel.app/register

---

## Quick Deploy Steps

### Fastest Way to Deploy:

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Go to** https://vercel.com/new

3. **Import** your repository

4. **Add environment variables** (copy from .env)

5. **Click Deploy**

6. **Done!** Your app is live in ~3 minutes

---

## Support

**Having issues?**
- Check Vercel build logs
- Verify all environment variables
- Test database connection
- Review Vercel docs: https://vercel.com/docs

---

**Your app is ready to deploy! Follow the steps above.** 🚀

**Estimated deployment time**: 5-10 minutes

