# User Roles Documentation

## Overview

Hope Jobs platform has **three distinct user roles**, each with specific capabilities and access levels.

---

## 🔴 1. ADMIN (System Administrator)

### **Purpose**
Manage the entire platform, moderate content, and monitor system health.

### **Access Areas**
- `/admin/dashboard` - Platform overview
- `/admin/users` - User management
- `/admin/jobs` - Job moderation
- `/admin/analytics` - Reports and insights

### **Capabilities**

#### **User Management:**
- View all registered users
- Search and filter users by role/status
- Suspend user accounts
- Activate suspended accounts
- Delete users (except other admins)
- View detailed user profiles

#### **Job Moderation:**
- View all job postings
- Search and filter jobs
- Delete inappropriate jobs
- View job details and applications
- Monitor job quality

#### **Analytics:**
- Access all platform statistics
- View growth trends
- Monitor user distribution
- Track top employers
- Review application metrics

#### **Dashboard:**
- Real-time KPI monitoring
- Growth charts
- Recent activity feed
- Quick statistics

### **Restrictions**
- ❌ Cannot modify other admin accounts
- ❌ Cannot post jobs
- ❌ Cannot apply for jobs
- ❌ Cannot access user passwords

### **Use Cases**
- Platform quality control
- Spam/scam prevention
- User support escalation
- Performance monitoring
- Policy enforcement

---

## 🟢 2. EMPLOYER (Job Poster)

### **Purpose**
Post job openings, find candidates, and manage applications.

### **Access Areas**
- `/employer/dashboard` - Overview
- `/employer/jobs` - Manage job postings
- `/employer/candidates` - Search job seekers
- `/employer/applications` - Review applications
- `/employer/messages` - Chat with candidates (coming soon)

### **Capabilities**

#### **Job Posting:**
- Create new job postings
- Edit existing jobs
- Delete own jobs
- Save jobs as drafts
- Publish jobs to make them public
- Set job details:
  - Title, description, requirements
  - Job type (Full-time, Part-time, etc.)
  - Location and salary
  - Skills needed
  - Responsibilities

#### **Candidate Search:**
- Search job seekers by:
  - Skills
  - Availability
  - Location
  - Experience
- View candidate profiles
- See candidate applications history
- Initiate chat with candidates

#### **Application Management:**
- View all applications for their jobs
- Filter by status (pending, reviewed, etc.)
- Review applicant details
- Read cover letters
- View resumes
- Accept applications
- Reject applications
- Track application history

#### **Dashboard:**
- View total jobs posted
- Track active job listings
- Monitor application counts
- See pending reviews
- Recent applications feed

### **Restrictions**
- ❌ Cannot edit other employers' jobs
- ❌ Cannot access admin panel
- ❌ Cannot apply for jobs themselves
- ❌ Cannot see other employers' applications

### **Use Cases**
- Recruiting talent
- Managing hiring pipeline
- Screening candidates
- Communication with applicants
- Tracking open positions

---

## 🟡 3. SEEKER (Job Seeker)

### **Purpose**
Find jobs, apply for positions, and manage career profile.

### **Access Areas**
- `/seeker/dashboard` - Overview
- `/seeker/profile` - Profile management
- `/seeker/jobs` - Search jobs (coming soon)
- `/seeker/applications` - Track applications (coming soon)
- `/seeker/messages` - Chat with employers (coming soon)

### **Capabilities**

#### **Profile Management:**
- Create professional profile
- Add personal information:
  - Phone number
  - Location
  - Professional bio
- List skills (comma-separated)
- Set availability status:
  - Immediately
  - Within 2 weeks
  - Within 1 month
  - Not available
- Specify expected salary
- Upload resume (coming soon)

#### **Job Search:** (Coming Soon)
- Browse all open job listings
- Search by keywords
- Filter by:
  - Job type
  - Location
  - Salary range
  - Company
- Save favorite jobs
- View job details

#### **Application Management:** (Coming Soon)
- Apply for jobs with:
  - Cover letter
  - Resume attachment
- Track application status
- View application history
- Get notifications on updates

#### **Dashboard:**
- View application statistics
- See profile completion status
- Get job recommendations
- Track application success rate

### **Restrictions**
- ❌ Cannot post jobs
- ❌ Cannot access employer/admin panels
- ❌ Cannot see other seekers' profiles
- ❌ Cannot modify job postings

### **Use Cases**
- Job hunting
- Career building
- Application tracking
- Employer communication
- Profile showcase

---

## 🔐 Role-Based Access Control

### **Security Model**

```
Admin → Full platform access
  ├── All users visible
  ├── All jobs visible
  └── All applications visible

Employer → Own content + search candidates
  ├── Own jobs only
  ├── Applications to own jobs
  └── Can search job seekers

Seeker → Own profile + public jobs
  ├── Own profile only
  ├── Own applications only
  └── Can search all open jobs
```

### **Middleware Protection**
- Automatic redirect based on role
- Unauthorized access blocked
- Session validation required
- CSRF token protection

---

## 🔄 Role Switching

### **Cannot Switch Roles:**
Once registered, a user's role is **permanent**:
- Admin stays admin
- Employer stays employer
- Seeker stays seeker

**Reason:** Security and data integrity

**Solution:** Create separate accounts for different purposes

---

## 📊 Role Statistics

### **Typical Distribution:**
- **Admins:** 1-5% (limited for security)
- **Employers:** 20-30% (companies)
- **Seekers:** 65-75% (job hunters)

### **Ideal Ratio:**
- More job seekers than jobs (healthy competition)
- Active employers posting regularly
- Minimal admin intervention needed

---

## 🎯 Role Selection Guide

### **Choose ADMIN if:**
- You're managing the platform
- You need to moderate content
- You want full system oversight
- You handle user support

### **Choose EMPLOYER if:**
- You're hiring for your company
- You want to post job openings
- You need to find candidates
- You manage recruitment

### **Choose SEEKER if:**
- You're looking for a job
- You want to apply for positions
- You're building your career
- You want to connect with employers

---

## 📱 Cross-Platform Access

All roles work on:
- 💻 Desktop
- 📱 Mobile
- 📟 Tablet
- 🌐 Any modern browser

**Features:**
- Responsive design
- Touch-friendly interfaces
- Mobile menus
- Optimized layouts

---

## 🚀 Future Enhancements

### **Coming Soon for All Roles:**
- Real-time chat system
- Push notifications
- Email notifications
- Advanced search filters
- File uploads (resumes, logos)
- Saved searches
- Recommendation engine

---

## 📖 Related Documentation

- `ADMIN_GUIDE.md` - Detailed admin procedures
- `README.md` - Project overview
- `IMPLEMENTATION_STATUS.md` - Feature completion
- `QUICK_START.md` - Getting started guide

---

**Last Updated:** October 2024
**Version:** 1.0
**Platform:** Hope Jobs

