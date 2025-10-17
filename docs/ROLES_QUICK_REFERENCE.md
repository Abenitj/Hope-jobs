# Hope Jobs - Roles Quick Reference

## 📋 Quick Overview

| Role | Dashboard | Primary Functions | Key Pages |
|------|-----------|------------------|-----------|
| **ADMIN** | `/admin/dashboard` | Platform management, user oversight, analytics | Users, Jobs, Analytics |
| **EMPLOYER** | `/employer/dashboard` | Post jobs, review applications, recruit | Jobs, Applications, Candidates |
| **SEEKER** | `/seeker/dashboard` | Find jobs, apply, manage profile | Jobs, Applications, Profile |

---

## 👨‍💼 ADMIN - Platform Administrator

### What Admins Can Do:
✅ View and manage **all users** (Suspend, Delete, Change roles)  
✅ Moderate **all job postings** (Edit, Delete, Close)  
✅ Access **platform analytics** (Charts, Reports, Statistics)  
✅ Monitor **system activity** (Recent registrations, applications, posts)  
✅ View **all applications** across the platform  
✅ Manage their **admin profile**  

### Key Pages:
- 🏠 **Dashboard**: `/admin/dashboard` - Platform overview and statistics
- 👥 **Users**: `/admin/users` - Manage all platform users
- 💼 **Jobs**: `/admin/jobs` - Oversee all job postings
- 📊 **Analytics**: `/admin/analytics` - View detailed platform metrics
- 👤 **Profile**: `/admin/profile` - Manage admin account

### Admin Cannot:
❌ Apply to jobs (admin role only)  
❌ Delete their own admin account  
❌ Post jobs as employer (must switch role)  

---

## 🏢 EMPLOYER - Company/Recruiter

### What Employers Can Do:
✅ **Post unlimited jobs** with full details  
✅ **Review applications** for their jobs  
✅ **Update application statuses** (Pending → Shortlisted → Interviewed → Offered)  
✅ **Search candidates** in the database  
✅ **Message job seekers** in real-time  
✅ **Manage company profile** (Logo, description, details)  
✅ **Track recruitment metrics** (Applications, views, conversion)  

### Key Pages:
- 🏠 **Dashboard**: `/employer/dashboard` - Recruitment overview
- 💼 **My Jobs**: `/employer/jobs` - Manage job postings
  - ➕ **New Job**: `/employer/jobs/new` - Create new posting
  - ✏️ **Edit Job**: `/employer/jobs/[id]/edit` - Modify existing job
- 📝 **Applications**: `/employer/applications` - Review applicants
  - 👁️ **Application Details**: `/employer/applications/[id]` - Full candidate view
- 🔍 **Candidates**: `/employer/candidates` - Search talent database
  - 👤 **Candidate Profile**: `/employer/candidates/[id]` - Detailed candidate view
- 💬 **Messages**: `/employer/messages` - Chat with candidates
- 🏢 **Profile**: `/employer/profile` - Company information

### Job Posting Workflow:
```
Create Job → Add Details → Publish → Review Applications → 
Update Status → Message Candidates → Make Offer → Close Job
```

### Application Status Flow:
```
PENDING → REVIEWING → SHORTLISTED → INTERVIEWED → 
OFFERED or REJECTED
```

---

## 🎓 SEEKER - Job Applicant

### What Job Seekers Can Do:
✅ **Browse all jobs** with advanced filters  
✅ **Apply to jobs** with resume and cover letter  
✅ **Track applications** and their statuses  
✅ **Build professional profile** (Skills, experience, education)  
✅ **Upload resume** (PDF, DOC, DOCX)  
✅ **Message employers** in real-time  
✅ **Receive notifications** for application updates  
✅ **Get job recommendations** based on profile  

### Key Pages:
- 🏠 **Dashboard**: `/seeker/dashboard` - Job search overview
- 🔍 **Browse Jobs**: `/seeker/jobs` - Find opportunities
  - 👁️ **Job Details**: `/seeker/jobs/[id]` - View and apply
- 📋 **My Applications**: `/seeker/applications` - Track submissions
- 💬 **Messages**: `/seeker/messages` - Chat with employers
- 👤 **Profile**: `/seeker/profile` - Manage professional profile

### Job Application Workflow:
```
Browse Jobs → Find Match → Read Details → 
Apply (Resume + Cover Letter) → Track Status → 
Receive Interview Invite → Get Offer
```

### Profile Building Checklist:
- [ ] Upload profile picture
- [ ] Add professional summary
- [ ] Upload resume
- [ ] List skills
- [ ] Add work experience
- [ ] Add education
- [ ] Set job preferences
- [ ] Set availability status

---

## 🔐 Authentication & Security

### Available Auth Features:

| Feature | Endpoint | Purpose |
|---------|----------|---------|
| **Register** | `/register` | Create new account (Employer or Seeker) |
| **Login** | `/login` | Access platform with credentials |
| **Logout** | Sidebar button | End session securely |
| **Forgot Password** | `/forgot-password` | Request password reset email |
| **Reset Password** | `/reset-password` | Set new password via email link |

### Password Requirements:
- Minimum 6 characters
- Case-sensitive
- Hashed with bcrypt (secure)

### Password Reset Process:
1. Click "Forgot password?" on login
2. Enter email address
3. Check email inbox
4. Click reset link (valid for 1 hour)
5. Enter new password
6. Login with new password

---

## 💬 Messaging System

### Who Can Message Who:
- Employer ↔ Job Seeker
- Admin ↔ Anyone
- Job Seeker ↔ Employer (regarding applications)

### Message Features:
- ✅ Real-time delivery (Socket.io)
- ✅ Text messages
- ✅ File attachments
- ✅ Read receipts
- ✅ Message history
- ✅ Online status indicators

### Message Types:
- **TEXT**: Regular text messages
- **FILE**: Document attachments (PDF, DOC, images)

---

## 🔔 Notifications

### Notification Types:

**APPLICATION**:
- New application received (Employer)
- Application status updated (Seeker)

**MESSAGE**:
- New message received
- Chat notifications

**JOB_UPDATE**:
- New job posted
- Job status changed
- Job matches profile (Seeker)

**SYSTEM**:
- Account updates
- Platform announcements
- Security alerts (Admin)

### Notification Actions:
- Mark as read
- Delete notification
- Navigate to related content
- Mark all as read

---

## 📁 File Management

### Upload Limits:

| File Type | Formats | Max Size | Location |
|-----------|---------|----------|----------|
| **Avatar** | JPEG, PNG, GIF, WEBP | 5 MB | `/public/uploads/avatars/` |
| **Resume** | PDF, DOC, DOCX | 10 MB | `/public/uploads/resumes/` |
| **Chat Files** | PDF, DOC, DOCX, Images | 10 MB | `/public/uploads/chat/` |
| **Company Logo** | JPEG, PNG, SVG | 2 MB | `/public/uploads/logos/` |

### File Operations:
- ✅ Upload
- ✅ Preview
- ✅ Download
- ✅ Replace
- ✅ Delete

---

## 🎨 UI Features

### Theme Options:
- ☀️ **Light Mode**: Clean, bright interface
- 🌙 **Dark Mode**: Easy on the eyes
- 🔄 **Auto**: Follow system preference

### Responsive Breakpoints:
- 📱 **Mobile**: < 768px
- 📱 **Tablet**: 768px - 1280px
- 💻 **Desktop**: > 1280px

### Color Scheme:
- **Primary**: Amber/Orange gradient (#f59e0b → #ea580c)
- **Success**: Green
- **Error**: Red
- **Warning**: Yellow
- **Info**: Blue

---

## 🚀 Getting Started

### As Admin:
1. Login with admin credentials
2. Navigate to Users to see all users
3. Check Analytics for platform insights
4. Monitor Jobs for content quality
5. View Dashboard for quick overview

### As Employer:
1. Register/Login as Employer
2. Complete Company Profile
3. Post First Job
4. Wait for Applications
5. Review and Update Statuses
6. Message Candidates
7. Make Offers

### As Job Seeker:
1. Register/Login as Seeker
2. Complete Your Profile
3. Upload Resume
4. Browse Available Jobs
5. Apply to Matching Positions
6. Track Application Status
7. Respond to Employer Messages

---

## 📊 Statistics & Analytics

### Platform Metrics (Admin View):
- Total users by role
- User growth over time
- Total jobs posted
- Application conversion rates
- Most active employers
- Most applied jobs
- Average response time

### Employer Metrics:
- Jobs posted
- Total applications received
- Application by status
- Views per job
- Average time to hire

### Seeker Metrics:
- Applications submitted
- Applications by status
- Profile views
- Response rate

---

## 🔧 Configuration

### Environment Variables:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# SMTP Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="abenitj@gmail.com"
SMTP_PASS="arqsqoteqalhklll"
SMTP_FROM_EMAIL="abenitj@gmail.com"
SMTP_FROM_NAME="Hope Jobs"

# Server
PORT="3000"
NODE_ENV="development"
```

---

## 📞 Support

- **Email**: abenitj@gmail.com
- **Documentation**: `/docs/`
- **Version**: 1.0.0

---

**Quick Tip**: Use the search functionality (Ctrl+K or Cmd+K) on most pages to quickly find what you need!





