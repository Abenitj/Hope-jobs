# 🔧 Fix Logout Redirect to Localhost on Render

## ❌ **The Problem:**
When you logout on https://hope-jobs-1.onrender.com, it redirects to localhost instead of staying on the hosted domain.

## ✅ **The Solution:**

### **Step 1: Update NEXTAUTH_URL on Render**

1. Go to your Render dashboard
2. Select your `hope-jobs` web service
3. Go to **"Environment"** tab
4. Find `NEXTAUTH_URL` and update it to:
   ```
   https://hope-jobs-1.onrender.com
   ```
   **IMPORTANT:** Remove any trailing slash!

5. Click **"Save Changes"**
6. Render will automatically redeploy

---

### **Step 2: Wait for Redeploy**

After updating the environment variable, Render will automatically redeploy your app. This takes about 2-5 minutes.

---

### **Step 3: Test**

1. Visit https://hope-jobs-1.onrender.com
2. Login with any test account
3. Click logout
4. You should stay on https://hope-jobs-1.onrender.com/login ✅

---

## 🎯 **What Was Wrong:**

The code uses `process.env.NEXTAUTH_URL` for all redirects. If `NEXTAUTH_URL` on Render is set to `http://localhost:3000` or empty, NextAuth will redirect to localhost.

By setting it to `https://hope-jobs-1.onrender.com`, all redirects will use the correct production URL.

---

## 📋 **Current Environment Variables on Render:**

Make sure these are ALL set correctly:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `mysql://freedb_abenitj:RQ%40tY5Q4nK3cfw%2A@sql.freedb.tech:3306/freedb_hope-jobs` |
| `NEXTAUTH_URL` | `https://hope-jobs-1.onrender.com` |
| `NEXTAUTH_SECRET` | `hopejobs-production-secret-2024` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `abenitj@gmail.com` |
| `SMTP_PASS` | `arqsqoteqalhklll` |
| `SMTP_FROM_EMAIL` | `abenitj@gmail.com` |
| `SMTP_FROM_NAME` | `Hope Jobs` |

---

## ✅ **That's It!**

Once you update `NEXTAUTH_URL` on Render and redeploy, the logout redirect will work correctly!

