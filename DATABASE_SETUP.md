# 💾 Database Setup - SQLite vs MySQL

## ✅ **NOW USING SQLITE (LOCAL)**

Your app is now configured to use SQLite for local development.

**Benefits:**
- ⚡ Super fast (no network latency)
- 🔧 No connection issues
- 💾 Data stored in `prisma/dev.db`
- 🎯 Perfect for development
- 🚀 Instant queries

---

## 🔄 **Current Configuration:**

### **Local Development (.env):**
```env
DATABASE_URL="file:./prisma/dev.db"
```

### **Prisma Schema:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### **Database File:**
```
prisma/dev.db  (SQLite database file)
```

---

## 🚀 **For Render Deployment:**

When deploying to Render, you'll need to use MySQL or PostgreSQL (Render doesn't support SQLite in production).

### **Option 1: Use MySQL on Render**

In Render environment variables, set:
```bash
DATABASE_URL=mysql://freedb_abenitj:RQ%40tY5Q4nK3cfw%2A@sql.freedb.tech:3306/freedb_hope-jobs
```

And update `prisma/schema.prisma` before deploying:
```prisma
datasource db {
  provider = "mysql"  // Change from sqlite
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### **Option 2: Use PostgreSQL on Render (Better!)**

Render offers **free PostgreSQL** database!

**Steps:**
1. On Render, create a "PostgreSQL" database
2. Copy the "Internal Database URL"
3. Add to environment variables:
```bash
DATABASE_URL=your-postgres-url-from-render
```

4. Update schema:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 🎯 **Recommended Approach:**

### **Development (Local):**
```
✅ SQLite - Fast, no issues
DATABASE_URL="file:./prisma/dev.db"
```

### **Production (Render):**
```
✅ PostgreSQL - Free on Render, reliable
DATABASE_URL="postgresql://..."
```

---

## 📋 **How to Switch:**

### **For Local Development (Current):**
```bash
# Already done! ✅
npm run dev
# Opens on http://localhost:3000
```

### **For Render Deployment:**
```bash
# Option A: Create Render PostgreSQL (Recommended)
1. Render → New → PostgreSQL
2. Copy Internal Database URL
3. Add to environment variables
4. Update schema provider to "postgresql"
5. Deploy

# Option B: Use existing MySQL
1. Keep MySQL URL in Render env vars
2. Update schema provider to "mysql"
3. Deploy
```

---

## ⚡ **Current Status:**

**Locally:**
- ✅ Database: SQLite (dev.db)
- ✅ Users: 4 seeded
- ✅ Server: Should be running fast
- ✅ No connection timeouts!

**For Deployment:**
- 📝 Need to choose: PostgreSQL (recommended) or MySQL
- 📝 Update environment variables on Render
- 📝 Deploy

---

## 🎊 **Advantages of This Setup:**

### **Local (SQLite):**
- ⚡ Lightning fast
- 🔧 No network issues
- 💾 Easy to reset/test
- 🚀 Perfect for development

### **Production (PostgreSQL on Render):**
- ✅ Free tier available
- ✅ Hosted on Render (same datacenter = fast)
- ✅ Reliable connections
- ✅ Auto-backups
- ✅ Scalable

---

## 🔧 **To Deploy on Render:**

### **1. Create PostgreSQL Database:**
1. Render Dashboard → New → PostgreSQL
2. Name: `hope-jobs-db`
3. Region: Same as web service
4. Click "Create Database"

### **2. Get Connection String:**
Copy the "Internal Database URL" from Render PostgreSQL dashboard

### **3. Update Environment Variables:**
```bash
DATABASE_URL=postgresql://hope_jobs_user:xxx@dpg-xxx.oregon-postgres.render.com/hope_jobs_db
```

### **4. Update schema.prisma:**
```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

### **5. Commit & Deploy:**
```bash
git add .
git commit -m "Ready for production with PostgreSQL"
git push origin main
```

Render will auto-deploy!

---

## ✅ **Current State:**

```
✅ Local: SQLite (fast, no issues)
✅ Database: 4 users seeded
✅ Ready to use locally
📝 For Render: Create PostgreSQL (recommended)
```

---

**Your app is working locally with SQLite now!** 🎉

