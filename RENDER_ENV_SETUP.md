# 🔧 Fix Render Environment Variables

## ⚠️ **The Issue:**
Your Render app is redirecting to localhost because `NEXTAUTH_URL` is not set correctly on Render.

---

## ✅ **FIX IT NOW - Step by Step:**

### **Step 1: Go to Render Dashboard**
1. Open: https://dashboard.render.com
2. Click on your **`hope-jobs`** (or **`hope-jobs-1`**) web service

### **Step 2: Click on "Environment" Tab**
In the left sidebar, click **"Environment"**

### **Step 3: Find or Add NEXTAUTH_URL**

Look for `NEXTAUTH_URL` in the list.

#### **If it exists:**
1. Click the **pencil icon** (edit)
2. Change the value to: `https://hope-jobs-1.onrender.com`
3. Click **"Save Changes"**

#### **If it doesn't exist:**
1. Click **"Add Environment Variable"**
2. **Key:** `NEXTAUTH_URL`
3. **Value:** `https://hope-jobs-1.onrender.com`
4. Click **"Save Changes"**

### **Step 4: Verify All Environment Variables**

Make sure ALL these are set correctly:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `mysql://freedb_abenitj:RQ%40tY5Q4nK3cfw%2A@sql.freedb.tech:3306/freedb_hope-jobs` |
| `NEXTAUTH_URL` | `https://hope-jobs-1.onrender.com` |
| `NEXTAUTH_SECRET` | `hopejobs-production-secret-2024` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `abenitj@gmail.com` |
| `SMTP_PASS` | `arqsqoteqalhklll` |
| `SMTP_FROM_EMAIL` | `abenitj@gmail.com` |
| `SMTP_FROM_NAME` | `Hope Jobs` |

**IMPORTANT:** In `DATABASE_URL`, make sure you use:
- `%40` instead of `@`
- `%2A` instead of `*`

### **Step 5: Save and Redeploy**

After saving the environment variables, Render will automatically redeploy.

**Wait 2-3 minutes** for the deployment to complete.

---

## 🧪 **Test After Deploy:**

1. Visit: https://hope-jobs-1.onrender.com
2. Login with: `admin@hopejobs.com` / `Admin@123`
3. Click **"Sign Out"**
4. ✅ You should stay on: `https://hope-jobs-1.onrender.com/login` (NOT localhost!)

---

## 📸 **Visual Guide:**

```
Render Dashboard
└── Your Web Service (hope-jobs or hope-jobs-1)
    └── Environment Tab (left sidebar)
        └── Environment Variables Section
            ├── Click "Add Environment Variable" (if new)
            └── Or click pencil icon to edit existing
```

---

## ❓ **Still Seeing Localhost?**

1. **Clear your browser cache** (Ctrl+Shift+Delete)
2. **Wait for deployment** to complete (check "Events" tab on Render)
3. **Verify** `NEXTAUTH_URL` is saved correctly on Render
4. Try in **incognito/private window**

---

## ✅ **Quick Checklist:**

- [ ] Logged into Render dashboard
- [ ] Opened my web service
- [ ] Clicked "Environment" tab
- [ ] Set `NEXTAUTH_URL` to `https://hope-jobs-1.onrender.com`
- [ ] Verified all other environment variables
- [ ] Saved changes
- [ ] Waited for auto-deploy (2-3 minutes)
- [ ] Tested logout (no more localhost redirect!)

---

**🎯 After you do this, the logout redirect will be fixed!**

