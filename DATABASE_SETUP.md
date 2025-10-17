# 💾 Database Setup - Online MySQL

## ✅ **NOW USING ONLINE MYSQL**

Your app is configured to use an online MySQL database hosted at `sql.freedb.tech`.

---

## 🌐 **Current Configuration:**

### **Database Provider:**
```
MySQL (Online)
Host: sql.freedb.tech:3306
Database: freedb_hope-jobs
```

### **Environment Variables (.env):**
```env
DATABASE_URL="mysql://freedb_abenitj:RQ@tY5Q4nK3cfw*@sql.freedb.tech:3306/freedb_hope-jobs?connection_limit=5&pool_timeout=20&connect_timeout=10"
```

### **Prisma Schema:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

---

## 🎯 **Benefits of Online MySQL:**

✅ **Same database for local & production**
   - No need to sync data between environments
   - Test with real production data structure

✅ **Access from anywhere**
   - Develop on any machine
   - Team members can share the same database

✅ **Easy deployment**
   - Just set DATABASE_URL in production
   - No database migration needed

---

## 🔑 **Login Credentials:**

```
Admin:    admin@hopejobs.com / Admin@123
Employer: employer@company.com / Employer@123
Seeker:   seeker@example.com / Seeker@123
```

---

## 🚀 **For Render Deployment:**

### **Option 1: Use Same MySQL (Current)**

In Render environment variables, set:
```bash
# URL-encoded version for Render
DATABASE_URL=mysql://freedb_abenitj:RQ%40tY5Q4nK3cfw%2A@sql.freedb.tech:3306/freedb_hope-jobs?connection_limit=5&pool_timeout=20&connect_timeout=10
```

**Note:** In Render, use `%40` for `@` and `%2A` for `*` in the password.

### **Option 2: Use Render PostgreSQL (Better for Production)**

Render offers **free PostgreSQL** database:

1. Create PostgreSQL on Render
2. Copy connection URL
3. Update environment variables
4. Change schema provider to `postgresql`
5. Deploy

---

## 📊 **Current Status:**

```
✅ Database: MySQL (Online)
✅ Host: sql.freedb.tech:3306
✅ Users: 4 (seeded)
✅ Server: Running on http://localhost:3000
✅ Network: http://192.168.0.122:3000
```

---

## 🔧 **Useful Commands:**

### **View database:**
```bash
npm run db:studio
```

### **Reset database:**
```bash
npx prisma db push --accept-data-loss
npm run db:seed
```

### **Check connection:**
```bash
npx prisma db pull
```

---

## ⚡ **Connection Parameters:**

The database URL includes optimized connection parameters:
- `connection_limit=5` - Max 5 concurrent connections
- `pool_timeout=20` - 20 seconds pool timeout
- `connect_timeout=10` - 10 seconds connect timeout

These settings help avoid connection timeouts with free MySQL hosting.

---

## 🎉 **You're All Set!**

Your app is now running with the online MySQL database. You can:

1. ✅ Test locally on http://localhost:3000
2. ✅ Deploy to Render/Vercel with same database
3. ✅ Open to network devices on http://192.168.0.122:3000

**Login and test all features!** 🚀
