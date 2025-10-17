# 🔧 FIX: Render Auth Error

## ❌ **Current Error:**
```
Server error: There is a problem with the server configuration.
URL: https://hope-jobs.onrender.com/api/auth/error
```

## 🔍 **What's Wrong:**

This error means NextAuth.js configuration issue. Usually caused by:
1. ❌ `NEXTAUTH_URL` not set correctly
2. ❌ `NEXTAUTH_SECRET` missing
3. ❌ `DATABASE_URL` not accessible from Render

---

## ✅ **THE FIX:**

### **1. Update Your Code (Already Done):**

Added to `src/lib/auth.ts`:
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ...
  trustHost: true,  // ← NEW! Fixes URL issues on Render
  pages: {
    signIn: "/login",
    error: "/login",  // ← NEW! Redirect errors to login
  },
})
```

### **2. Verify Environment Variables on Render:**

Go to your Render dashboard → Your web service → "Environment" tab

**Make sure ALL of these are set:**

```bash
# 1. Database (MUST be URL-encoded!)
DATABASE_URL=mysql://freedb_abenitj:RQ%40tY5Q4nK3cfw%2A@sql.freedb.tech:3306/freedb_hope-jobs

# 2. Direct URL (no encoding)
DIRECT_URL=mysql://freedb_abenitj:RQ@tY5Q4nK3cfw*@sql.freedb.tech:3306/freedb_hope-jobs

# 3. NextAuth Secret (REQUIRED!)
NEXTAUTH_SECRET=hopejobs-production-secret-2024

# 4. NextAuth URL (USE YOUR ACTUAL RENDER URL!)
NEXTAUTH_URL=https://hope-jobs.onrender.com

# 5. SMTP (for forgot password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=abenitj@gmail.com
SMTP_PASS=arqsqoteqalhklll
SMTP_FROM_EMAIL=abenitj@gmail.com
SMTP_FROM_NAME=Hope Jobs
```

### **3. Critical Fixes:**

#### **Fix 1: URL Encoding in DATABASE_URL**
Make sure you use:
- `%40` instead of `@` 
- `%2A` instead of `*`

Example:
```
✅ CORRECT:
DATABASE_URL=mysql://freedb_abenitj:RQ%40tY5Q4nK3cfw%2A@sql.freedb.tech:3306/freedb_hope-jobs

❌ WRONG:
DATABASE_URL=mysql://freedb_abenitj:RQ@tY5Q4nK3cfw*@sql.freedb.tech:3306/freedb_hope-jobs
```

#### **Fix 2: NEXTAUTH_URL Must Match**
```
✅ CORRECT:
NEXTAUTH_URL=https://hope-jobs.onrender.com

❌ WRONG:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL=https://your-app.onrender.com
```

#### **Fix 3: NEXTAUTH_SECRET Must Exist**
Any random string works, but it MUST be set:
```
NEXTAUTH_SECRET=hopejobs-production-secret-2024
```

---

## 🚀 **STEPS TO FIX ON RENDER:**

### **Step 1: Check Environment Variables**
1. Go to Render dashboard
2. Click on your "hope-jobs" web service
3. Click "Environment" in left sidebar
4. Verify ALL variables above are set

### **Step 2: If Missing, Add Them**
Click "Add Environment Variable" and add each one

### **Step 3: Redeploy**
After adding/updating variables:
1. Go to "Manual Deploy" tab
2. Click "Clear build cache & deploy"
3. Wait 5-10 minutes

### **Step 4: Test**
After deployment completes:
```
https://hope-jobs.onrender.com
```

Should show your beautiful landing page! ✅

---

## 🎯 **COMMON ISSUES & SOLUTIONS:**

### **Issue 1: "Server configuration error"**
**Cause**: NEXTAUTH_URL or NEXTAUTH_SECRET missing  
**Fix**: Add both to Render environment variables

### **Issue 2: "Can't reach database"**
**Cause**: DATABASE_URL not encoded or wrong  
**Fix**: Use `%40` for `@` and `%2A` for `*`

### **Issue 3: "Prisma validation error"**
**Cause**: DATABASE_URL not set during build  
**Fix**: Add DATABASE_URL before deployment, not after

### **Issue 4: Build succeeds but app crashes**
**Cause**: Missing environment variables at runtime  
**Fix**: Add all variables, then redeploy

---

## ✅ **CHECKLIST:**

On Render, verify each variable:
- [ ] DATABASE_URL (with %40 and %2A)
- [ ] DIRECT_URL (plain text)
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL (your actual Render URL)
- [ ] SMTP_HOST
- [ ] SMTP_PORT
- [ ] SMTP_USER
- [ ] SMTP_PASS
- [ ] SMTP_FROM_EMAIL
- [ ] SMTP_FROM_NAME

---

## 🔄 **AFTER ADDING VARIABLES:**

```bash
# Locally, commit the code fix:
git add .
git commit -m "Added trustHost for Render deployment"
git push origin main
```

Then on Render:
1. It will auto-deploy when you push
2. Or manually: "Clear build cache & deploy"

---

## 🎉 **AFTER FIX:**

Your app should work perfectly:
- ✅ Landing page loads
- ✅ Login works
- ✅ Redirects to dashboard
- ✅ All features operational

---

**Fix these environment variables on Render and redeploy!** 🚀

