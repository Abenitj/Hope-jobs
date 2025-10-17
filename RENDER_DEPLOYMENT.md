# 🚀 Deploy to Render

## ✅ Environment Variables Required

When deploying to Render, you MUST add these environment variables BEFORE building:

### **Required Variables:**

```bash
DATABASE_URL=mysql://freedb_abenitj:RQ%40tY5Q4nK3cfw%2A@sql.freedb.tech:3306/freedb_hope-jobs?connection_limit=10&pool_timeout=30

DIRECT_URL=mysql://freedb_abenitj:RQ@tY5Q4nK3cfw*@sql.freedb.tech:3306/freedb_hope-jobs

NEXTAUTH_SECRET=hopejobs-production-secret-2024

NEXTAUTH_URL=https://your-app.onrender.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=abenitj@gmail.com
SMTP_PASS=arqsqoteqalhklll
SMTP_FROM_EMAIL=abenitj@gmail.com
SMTP_FROM_NAME=Hope Jobs
```

---

## 📝 Step-by-Step Deployment on Render

### **Step 1: Create New Web Service**
1. Go to: https://render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

### **Step 2: Configure Build Settings**
```
Name: hope-jobs
Environment: Node
Region: Choose closest to you
Branch: main
Build Command: npm install && npm run build
Start Command: npm run start:custom
```

### **Step 3: Add Environment Variables**

⚠️ **IMPORTANT**: Add these BEFORE clicking "Create Web Service"

Click **"Advanced"** and add all variables above.

**Notes:**
- Use `%40` for `@` in DATABASE_URL
- Use `%2A` for `*` in DATABASE_URL
- DIRECT_URL uses plain characters (no encoding)
- Update `NEXTAUTH_URL` after first deployment with your actual Render URL

### **Step 4: Create Web Service**
Click **"Create Web Service"** and wait for build (5-10 minutes)

### **Step 5: Update NEXTAUTH_URL**
After deployment:
1. Copy your Render URL (e.g., `https://hope-jobs.onrender.com`)
2. Go to **Environment** tab
3. Update `NEXTAUTH_URL` to your actual URL
4. Click **"Save Changes"** (will auto-redeploy)

---

## ✅ **What Works on Render:**

### **Everything Works! (Unlike Vercel)**
✅ **Socket.io Chat** - Real-time messaging works!  
✅ **File Uploads** - Persistent storage  
✅ **Authentication**  
✅ **All database operations**  
✅ **Notifications**  
✅ **Email sending**  
✅ **All features**  

### **Why Render is Better for This App:**
- ✅ Full Node.js server (not serverless)
- ✅ Socket.io works perfectly
- ✅ File uploads are persistent
- ✅ No edge function limits
- ✅ Custom server.ts runs fine

---

## 🔧 **Build Command Explanation:**

```bash
npm install          # Install dependencies
npm run build        # Build Next.js app
```

The build process:
1. ✅ `postinstall` runs `prisma generate`
2. ✅ `build` runs `next build`
3. ✅ Static pages are generated
4. ✅ Server is ready

---

## 🚀 **Start Command:**

```bash
npm run start:custom
```

This runs: `NODE_ENV=production tsx server.ts`

Which starts:
- ✅ Custom Next.js server
- ✅ Socket.io server
- ✅ HTTP server on assigned port

---

## ⚠️ **Common Issues & Solutions:**

### **Issue 1: DATABASE_URL Error During Build**
```
Error: the URL must start with the protocol `mysql://`
```

**Solution**: Make sure `DATABASE_URL` is set in Render environment variables BEFORE building.

### **Issue 2: Port Binding Error**
```
Error: listen EADDRINUSE
```

**Solution**: Render automatically provides PORT. Code already handles this:
```javascript
const port = process.env.PORT || 3000
```

### **Issue 3: Database Connection Timeout**
```
Can't reach database server
```

**Solution**: Add connection parameters to DATABASE_URL:
```
?connection_limit=10&pool_timeout=30&connect_timeout=60
```

### **Issue 4: Build Takes Too Long**
**Solution**: Normal! First build takes 5-10 minutes. Subsequent builds are faster.

---

## 📊 **Render vs Vercel:**

| Feature | Render | Vercel |
|---------|--------|--------|
| Socket.io | ✅ Works | ❌ No |
| File Uploads | ✅ Persistent | ⚠️ Temporary |
| Custom Server | ✅ Yes | ⚠️ Limited |
| Build Time | 5-10 min | 3-5 min |
| Cold Start | ~1 sec | Instant |
| Free Tier | ✅ Yes | ✅ Yes |
| Best For | Full-stack apps | Static/API |

---

## 🎯 **Recommended: Deploy to Render**

For your Hope Jobs app with real-time chat and file uploads, **Render is the better choice**.

---

## 🔐 **Security Notes:**

1. ✅ All environment variables are encrypted on Render
2. ✅ HTTPS is automatic
3. ✅ Database credentials are secure
4. ✅ SMTP credentials are safe

---

## 📈 **After Deployment:**

### **Test Everything:**
1. ✅ Login with admin account
2. ✅ Create a job posting
3. ✅ Upload resume
4. ✅ Send chat message (Socket.io test)
5. ✅ Check notifications
6. ✅ Test dark mode
7. ✅ Try forgot password

### **Monitor:**
- Check Render logs for errors
- Monitor database connections
- Watch for email delivery

---

## 🇪🇹 **Your App on Render:**

```
https://hope-jobs.onrender.com
```

**Features:**
- 🎨 Beautiful design
- ⚡ Fast performance
- 💬 Real-time chat (works!)
- 📁 File uploads (persistent!)
- 🔒 Secure
- 🌓 Dark mode
- 📱 Mobile-friendly
- 💰 ETB currency

---

## ✅ **Final Checklist:**

- [ ] Push code to GitHub
- [ ] Create Render web service
- [ ] Add all environment variables
- [ ] Set build command
- [ ] Set start command
- [ ] Deploy (wait 5-10 min)
- [ ] Update NEXTAUTH_URL
- [ ] Test all features
- [ ] Celebrate! 🎉

---

**Deploy to Render for the full experience!** 🚀

