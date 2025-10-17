# Hope Jobs Platform - Comprehensive User Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [Admin Role](#admin-role)
4. [Employer Role](#employer-role)
5. [Job Seeker Role](#job-seeker-role)
6. [Authentication Features](#authentication-features)
7. [Common Features](#common-features)
8. [Technical Configuration](#technical-configuration)

---

## System Overview

**Hope Jobs** is a comprehensive job portal platform that connects job seekers with employers. The system supports three distinct user roles, each with specific functionalities and permissions.

### Platform Features
- Multi-role user management (Admin, Employer, Seeker)
- Real-time messaging system
- Job posting and application management
- Advanced search and filtering
- Email notifications
- Password reset functionality
- File upload support (resumes, avatars, documents)
- Analytics and reporting
- Dark/Light theme support

---

## User Roles

The platform supports three user roles with different access levels and capabilities:

| Role | Purpose | Access Level |
|------|---------|--------------|
| **ADMIN** | Platform administrator | Full system access |
| **EMPLOYER** | Company/Recruiter | Post jobs, review applications |
| **SEEKER** | Job applicant | Browse jobs, submit applications |

---

## Admin Role

### Overview
Administrators have complete control over the platform, including user management, content moderation, and system configuration.

### Access Points
- **Login**: `/login` with admin credentials
- **Dashboard**: `/admin/dashboard`

### Core Functionalities

#### 1. **Dashboard** (`/admin/dashboard`)
**Purpose**: Central hub for platform oversight and monitoring

**Features**:
- **System Statistics**
  - Total users by role (Admins, Employers, Seekers)
  - Total jobs posted
  - Total applications submitted
  - User status breakdown (Active, Suspended, Deleted)

- **User Growth Chart**
  - Visual representation of user registrations over time
  - Interactive chart showing growth trends

- **Application Status Chart**
  - Distribution of application statuses
  - Pending, Reviewed, Accepted, Rejected counts

- **Job Type Distribution**
  - Breakdown by job types (Full-time, Part-time, Contract, etc.)
  - Visual pie chart representation

- **Recent Activity Feed**
  - Latest user registrations
  - Recent job postings
  - New applications
  - Real-time activity updates

- **Welcome Banner**
  - Personalized greeting
  - Admin profile picture
  - Quick access to key metrics

**What You Can Do**:
- ✅ Monitor platform health at a glance
- ✅ Track user growth trends
- ✅ View recent platform activity
- ✅ Identify system bottlenecks
- ✅ Export data for reporting

---

#### 2. **User Management** (`/admin/users`)

**Purpose**: Manage all platform users across all roles

**Features**:

- **User Listing**
  - Paginated table of all users
  - Display: Name, Email, Role, Status, Registration Date
  - Avatar thumbnails
  - Role badges (color-coded)
  - Status indicators

- **Search & Filter**
  - Search by name or email
  - Filter by role (All, Admin, Employer, Seeker)
  - Filter by status (Active, Suspended, Deleted)

- **User Actions**
  - **View Profile**: See detailed user information
  - **Edit User**: Modify user details
  - **Change Role**: Promote/demote users
  - **Suspend Account**: Temporarily disable access
  - **Delete Account**: Permanently remove user
  - **Reactivate**: Restore suspended accounts

- **Bulk Operations**
  - Export user list
  - Mass status updates

**What You Can Do**:
- ✅ View all registered users
- ✅ Search and filter users
- ✅ Suspend problematic accounts
- ✅ Change user roles
- ✅ Delete spam accounts
- ✅ Monitor user activity
- ✅ Manage account statuses

**Security Considerations**:
- Cannot delete your own admin account (safety measure)
- Suspended users cannot log in
- Deleted users cannot be recovered

---

#### 3. **Job Management** (`/admin/jobs`)

**Purpose**: Oversee all job postings across the platform

**Features**:

- **Job Listings**
  - All jobs from all employers
  - Job title, company, location, type
  - Status badges (Open, Closed, Draft)
  - Application count per job
  - Posted date

- **Search & Filter**
  - Search by job title or company
  - Filter by job type
  - Filter by status
  - Filter by location
  - Sort by date, applications, etc.

- **Job Actions**
  - **View Details**: See full job description
  - **Edit Job**: Modify job postings
  - **Close Job**: Stop accepting applications
  - **Delete Job**: Remove job posting
  - **View Applications**: See all applicants

- **Statistics**
  - Total jobs posted
  - Open vs Closed jobs
  - Average applications per job
  - Jobs by type distribution

**What You Can Do**:
- ✅ Monitor all job postings
- ✅ Remove inappropriate content
- ✅ Close expired jobs
- ✅ View job statistics
- ✅ Moderate job descriptions
- ✅ Ensure compliance with policies

---

#### 4. **Analytics** (`/admin/analytics`)

**Purpose**: Advanced reporting and data visualization

**Features**:

- **Platform Metrics**
  - Total users growth over time
  - Application trends
  - Job posting trends
  - Conversion rates (views to applications)

- **Performance Indicators**
  - Average time to hire
  - Application response rates
  - Most active employers
  - Most applied jobs

- **Visual Reports**
  - Line charts for trends
  - Bar charts for comparisons
  - Pie charts for distributions
  - Interactive data tables

- **Export Capabilities**
  - Download reports as CSV/PDF
  - Custom date range selection
  - Scheduled reports

**What You Can Do**:
- ✅ Analyze platform performance
- ✅ Identify growth opportunities
- ✅ Track key metrics
- ✅ Generate reports for stakeholders
- ✅ Make data-driven decisions

---

#### 5. **Profile Management** (`/admin/profile`)

**Purpose**: Manage admin personal information

**Features**:
- Update name and email
- Change password
- Upload profile picture
- Set notification preferences
- Manage security settings

---

### Admin Privileges Summary

**Platform-wide Actions**:
- ✅ Access all user data
- ✅ Modify any job posting
- ✅ View all applications
- ✅ Suspend or delete accounts
- ✅ Access analytics and reports
- ✅ Configure system settings
- ✅ Manage email templates

**Restricted Actions**:
- ❌ Cannot delete own admin account
- ❌ Cannot apply to jobs (admin role only)

---

## Employer Role

### Overview
Employers (recruiters/companies) can post jobs, manage applications, and communicate with candidates.

### Access Points
- **Login**: `/login` with employer credentials
- **Dashboard**: `/employer/dashboard`

### Core Functionalities

#### 1. **Dashboard** (`/employer/dashboard`)

**Purpose**: Employer's command center for recruitment activities

**Features**:

- **Quick Stats Cards**
  - Total jobs posted
  - Active job openings
  - Total applications received
  - Pending applications to review

- **Recent Jobs**
  - Latest job postings
  - Application counts
  - Quick actions (View, Edit, Close)

- **Recent Applications**
  - New applications requiring review
  - Candidate information preview
  - Quick status update options

- **Profile Completion**
  - Company profile setup reminder
  - Profile completeness indicator

**What You Can Do**:
- ✅ Monitor recruitment activity
- ✅ Quick access to pending applications
- ✅ View job performance metrics
- ✅ Track application trends

---

#### 2. **Job Management** (`/employer/jobs`)

**Purpose**: Create, edit, and manage job postings

**Features**:

- **Job Listing**
  - All your posted jobs
  - Status indicators (Open, Closed, Draft)
  - Application count per job
  - Posted date and expiry

- **Create New Job** (`/employer/jobs/new`)
  - **Basic Information**:
    - Job title
    - Job description (rich text)
    - Company/employer name (auto-filled)
  
  - **Job Details**:
    - Job type (Full-time, Part-time, Contract, Freelance, Internship)
    - Location
    - Salary range
    - Employment level
  
  - **Requirements**:
    - Required skills (multi-select)
    - Experience level
    - Education requirements
    - Certifications needed
  
  - **Responsibilities**:
    - Key duties and responsibilities
    - Day-to-day tasks
    - Performance expectations
  
  - **Additional Settings**:
    - Application deadline
    - Status (Open, Closed, Draft)
    - Immediate posting or schedule for later

- **Edit Job** (`/employer/jobs/[jobId]/edit`)
  - Modify any job field
  - Update status
  - Extend application deadline
  - Preview changes before saving

- **Job Actions**:
  - **Publish**: Make draft jobs live
  - **Close**: Stop accepting applications
  - **Delete**: Remove job posting
  - **Duplicate**: Create similar job
  - **Preview**: See how candidates view it

- **Job Statistics**
  - Total views
  - Application count
  - Conversion rate (views to applications)
  - Average time to apply

**What You Can Do**:
- ✅ Post unlimited job openings
- ✅ Save drafts and publish later
- ✅ Edit job details anytime
- ✅ Close jobs when positions are filled
- ✅ Track job performance
- ✅ Manage application deadlines

---

#### 3. **Application Management** (`/employer/applications`)

**Purpose**: Review and manage job applications

**Features**:

- **Application Dashboard**
  - All applications for your jobs
  - Filterable by status, job, date
  - Searchable by candidate name

- **Application Statuses**:
  - **PENDING**: Newly submitted, needs review
  - **REVIEWING**: Currently under consideration
  - **SHORTLISTED**: Selected for next round
  - **INTERVIEWED**: Candidate interviewed
  - **OFFERED**: Job offer extended
  - **REJECTED**: Not selected
  - **WITHDRAWN**: Candidate withdrew

- **Application Details** (`/employer/applications/[applicationId]`)
  - **Candidate Information**:
    - Full name and contact
    - Profile picture
    - Email and phone
    - Location
  
  - **Application Materials**:
    - Cover letter
    - Resume/CV (downloadable)
    - Portfolio links
  
  - **Candidate Profile**:
    - Skills and expertise
    - Work experience
    - Education history
    - Availability status
  
  - **Status Management**:
    - Update application status
    - Automatic candidate notifications
    - Status history tracking
  
  - **Quick Actions**:
    - Send message to candidate
    - Schedule interview
    - Download resume
    - View full profile

- **Filtering & Search**:
  - Filter by application status
  - Filter by job title
  - Search by candidate name
  - Sort by date, status, etc.

- **Bulk Actions**:
  - Reject multiple applications
  - Move to next stage
  - Export applicant data

**What You Can Do**:
- ✅ Review all job applications
- ✅ Update application statuses
- ✅ Download candidate resumes
- ✅ Contact candidates directly
- ✅ Track recruitment pipeline
- ✅ Manage hiring workflow
- ✅ Send automated status updates

---

#### 4. **Candidate Search** (`/employer/candidates`)

**Purpose**: Proactively find and recruit qualified candidates

**Features**:

- **Candidate Database**
  - All registered job seekers
  - Profile previews
  - Availability status
  - Skills and experience

- **Advanced Search**:
  - Search by skills
  - Filter by location
  - Filter by availability
  - Filter by experience level
  - Filter by education

- **Candidate Profiles** (`/employer/candidates/[candidateId]`)
  - Complete professional profile
  - Resume download
  - Contact information
  - Skills assessment
  - Work history
  - Education background

- **Candidate Actions**:
  - Send direct message
  - Invite to apply for specific job
  - Add to talent pool
  - Download resume

- **Statistics**:
  - Total available candidates
  - Candidates with resumes
  - Immediately available
  - Candidates by skill

**What You Can Do**:
- ✅ Browse all job seekers
- ✅ Search by specific skills
- ✅ Find passive candidates
- ✅ Directly recruit talent
- ✅ Build talent pipelines
- ✅ Headhunt for specific roles

---

#### 5. **Messaging** (`/employer/messages`)

**Purpose**: Real-time communication with candidates

**Features**:

- **Chat Interface**
  - Real-time messaging
  - Message history
  - Unread indicators
  - Online status

- **Message Types**:
  - Text messages
  - File attachments
  - Document sharing
  - Image sharing

- **Conversation Management**:
  - Multiple active chats
  - Search conversations
  - Archive old chats
  - Delete conversations

- **Notifications**:
  - New message alerts
  - Desktop notifications
  - Email notifications (if enabled)

**What You Can Do**:
- ✅ Chat with candidates in real-time
- ✅ Share documents and files
- ✅ Schedule interviews via chat
- ✅ Maintain conversation history
- ✅ Quick communication

---

#### 6. **Company Profile** (`/employer/profile`)

**Purpose**: Manage company information and branding

**Features**:

- **Company Information**:
  - Company name
  - Industry
  - Company size
  - Location
  - Website URL
  - Company description

- **Branding**:
  - Upload company logo
  - Brand colors
  - Company tagline

- **Contact Information**:
  - Primary email
  - Phone number
  - Office address
  - Social media links

- **Public Visibility**:
  - Company profile visible to job seekers
  - Appears on all job postings
  - Helps attract quality candidates

**What You Can Do**:
- ✅ Build company brand
- ✅ Attract better candidates
- ✅ Update company information
- ✅ Showcase company culture
- ✅ Add company logo

---

### Employer Workflow Example

```
1. Register as Employer
   ↓
2. Complete Company Profile
   ↓
3. Post Job Opening
   ↓
4. Review Applications
   ↓
5. Shortlist Candidates
   ↓
6. Message Candidates
   ↓
7. Schedule Interviews
   ↓
8. Make Job Offer
   ↓
9. Close Job Posting
```

---

## Job Seeker Role

### Overview
Job seekers can browse opportunities, submit applications, and manage their professional profile.

### Access Points
- **Login**: `/login` with seeker credentials
- **Dashboard**: `/seeker/dashboard`

### Core Functionalities

#### 1. **Dashboard** (`/seeker/dashboard`)

**Purpose**: Personal job search command center

**Features**:

- **Quick Statistics**:
  - Total applications submitted
  - Pending applications
  - Interview invitations
  - Job offers received

- **Application Status Overview**:
  - Visual breakdown of application statuses
  - Progress tracking
  - Recent updates

- **Recommended Jobs**:
  - AI-matched jobs based on profile
  - Skills-based recommendations
  - Location-based suggestions

- **Profile Completion**:
  - Profile completeness indicator
  - Missing fields reminder
  - Quick profile update link

- **Recent Activity**:
  - Latest application updates
  - New messages
  - Status changes

**What You Can Do**:
- ✅ Track job search progress
- ✅ View application statuses
- ✅ See recommended jobs
- ✅ Monitor profile strength

---

#### 2. **Job Browse** (`/seeker/jobs`)

**Purpose**: Discover and explore job opportunities

**Features**:

- **Job Listings**
  - All available job openings
  - Company information
  - Job details preview
  - Application status indicator

- **Advanced Search & Filters**:
  - **Search by**:
    - Job title
    - Company name
    - Keywords in description
  
  - **Filter by**:
    - Job type (Full-time, Part-time, Contract, etc.)
    - Location
    - Salary range
    - Posted date
    - Industry
  
  - **Sort by**:
    - Most recent
    - Most relevant
    - Highest salary
    - Most applications

- **Job Cards Display**:
  - Company logo
  - Job title
  - Location
  - Salary range
  - Job type badge
  - Posted time
  - Application count
  - "Applied" badge if already applied

- **Quick Actions**:
  - Save job for later
  - Share job link
  - Report inappropriate content

**What You Can Do**:
- ✅ Browse all available jobs
- ✅ Search by keywords
- ✅ Filter by preferences
- ✅ Save interesting jobs
- ✅ Track application status

---

#### 3. **Job Details** (`/seeker/jobs/[jobId]`)

**Purpose**: View complete job information and apply

**Features**:

- **Job Information**:
  - Complete job description
  - Detailed requirements
  - Key responsibilities
  - Required skills
  - Qualifications needed
  - Experience level
  - Salary details
  - Benefits offered

- **Company Information**:
  - Company name and logo
  - Company description
  - Industry
  - Company size
  - Location
  - Website link

- **Job Statistics**:
  - Total applicants
  - Posted date
  - Application deadline
  - Job status

- **Application Section**:
  - **If Not Applied**:
    - Cover letter input
    - Resume upload/select
    - One-click apply button
  
  - **If Already Applied**:
    - Application status badge
    - Applied date
    - Current status
    - Status updates

- **Similar Jobs**:
  - Related job recommendations
  - Same industry jobs
  - Same location jobs

**What You Can Do**:
- ✅ Read complete job details
- ✅ Learn about the company
- ✅ Submit applications
- ✅ Upload cover letter
- ✅ Attach resume
- ✅ Track application status
- ✅ Find similar opportunities

---

#### 4. **My Applications** (`/seeker/applications`)

**Purpose**: Track all submitted job applications

**Features**:

- **Application List**:
  - All your submitted applications
  - Job title and company
  - Application date
  - Current status
  - Last updated time

- **Status Tracking**:
  - **Pending**: Under review
  - **Reviewed**: Employer viewed application
  - **Accepted**: Moved to next stage
  - **Rejected**: Not selected

- **Application Details**:
  - View submitted cover letter
  - Download submitted resume
  - See application timeline
  - Track status changes

- **Filtering**:
  - Filter by status
  - Filter by date
  - Search by job title or company

- **Actions**:
  - Withdraw application
  - Update materials (if allowed)
  - Message employer
  - View job details

**What You Can Do**:
- ✅ Track all applications in one place
- ✅ Monitor status changes
- ✅ Receive update notifications
- ✅ Manage application pipeline
- ✅ Withdraw if needed

---

#### 5. **Profile Management** (`/seeker/profile`)

**Purpose**: Build and maintain professional profile

**Features**:

- **Personal Information**:
  - Full name
  - Email address
  - Phone number
  - Location/City
  - Profile picture

- **Professional Profile**:
  - Professional summary/bio
  - Current job title
  - Years of experience
  - Career objectives

- **Skills**:
  - Add multiple skills
  - Skill level indicators
  - Skill categories
  - Endorsements

- **Work Experience**:
  - Company name
  - Job title
  - Duration (from - to)
  - Responsibilities
  - Achievements
  - Multiple entries supported

- **Education**:
  - Institution name
  - Degree/Certification
  - Field of study
  - Graduation year
  - GPA (optional)

- **Resume Management**:
  - Upload resume (PDF, DOC, DOCX)
  - Multiple resume versions
  - Download current resume
  - Replace resume

- **Job Preferences**:
  - Preferred job types
  - Expected salary range
  - Preferred locations
  - Availability status (Immediate, 2 weeks, 1 month, etc.)
  - Remote work preference

- **Privacy Settings**:
  - Profile visibility
  - Allow direct contact
  - Show/hide contact info

**What You Can Do**:
- ✅ Build comprehensive profile
- ✅ Upload and manage resume
- ✅ Showcase skills and experience
- ✅ Set job preferences
- ✅ Update availability
- ✅ Improve searchability by employers

---

#### 6. **Messaging** (`/seeker/messages`)

**Purpose**: Communicate with employers

**Features**:
- Real-time chat with employers
- Message notifications
- File sharing
- Conversation history
- Interview scheduling

**What You Can Do**:
- ✅ Respond to employer inquiries
- ✅ Share additional documents
- ✅ Schedule interviews
- ✅ Maintain professional communication

---

### Job Seeker Workflow Example

```
1. Register as Job Seeker
   ↓
2. Complete Profile & Upload Resume
   ↓
3. Browse Available Jobs
   ↓
4. Apply to Relevant Positions
   ↓
5. Track Application Status
   ↓
6. Receive Messages from Employers
   ↓
7. Schedule Interviews
   ↓
8. Receive Job Offers
```

---

## Authentication Features

### 1. **User Registration** (`/register`)

**Features**:
- **Personal Information**:
  - Full name
  - Email address
  - Password (minimum 6 characters)
  - Password confirmation

- **Role Selection**:
  - Employer (Company/Recruiter)
  - Job Seeker

- **Additional Fields**:
  - For Employers: Company name
  - For Seekers: Phone number (optional)

- **Security**:
  - Password strength validation
  - Email uniqueness check
  - Secure password hashing (bcrypt)
  - Email verification (optional)

**What Happens**:
1. User fills registration form
2. System validates data
3. Password is hashed securely
4. User account created
5. Redirect to role-specific dashboard

---

### 2. **User Login** (`/login`)

**Features**:
- Email and password authentication
- Remember me option
- Redirect to role-specific dashboard
- Error handling for invalid credentials
- Account status verification

**Login Redirects**:
- **Admin** → `/admin/dashboard`
- **Employer** → `/employer/dashboard`
- **Seeker** → `/seeker/dashboard`

**Security Features**:
- ✅ Suspended accounts cannot login
- ✅ Deleted accounts cannot login
- ✅ Secure session management
- ✅ JWT token-based authentication

**Demo Accounts** (for testing):
```
Admin: admin@hopejobs.com / Admin@123
Employer: employer@company.com / Employer@123
Seeker: seeker@example.com / Seeker@123
```

---

### 3. **Forgot Password** (`/forgot-password`)

**Purpose**: Allow users to reset forgotten passwords

**How It Works**:

1. **Request Reset**:
   - User enters email address
   - System validates email exists
   - Generates secure reset token
   - Sends email with reset link
   - Token expires in 1 hour

2. **Email Sent**:
   - Beautiful HTML template
   - Clear reset button
   - Link with token
   - Security instructions
   - Expiration notice

3. **Reset Password** (`/reset-password?token=xxx`):
   - User clicks link from email
   - Token is validated
   - User enters new password
   - Password confirmation required
   - Password strength validation

4. **Completion**:
   - Password updated in database
   - Token marked as used
   - Old tokens invalidated
   - User redirected to login
   - Confirmation message displayed

**Security Features**:
- ✅ Tokens expire in 1 hour
- ✅ One-time use tokens
- ✅ Secure token hashing
- ✅ Old tokens auto-invalidated
- ✅ Email verification required
- ✅ Password strength requirements

**What Users Can Do**:
- ✅ Reset password via email
- ✅ Secure token-based process
- ✅ Clear instructions provided
- ✅ Quick and easy recovery

---

### 4. **Logout**

**Features**:
- Available on all pages (sidebar/header)
- Clears session data
- Redirects to login page
- Secure token invalidation

---

## Common Features

### 1. **Real-Time Messaging System**

**Technology**: Socket.io for real-time communication

**Features**:
- **Instant messaging** between users
- **File sharing** (documents, images)
- **Online status** indicators
- **Typing indicators**
- **Message read receipts**
- **Chat history** persistence

**Supported Between**:
- Employer ↔ Job Seeker
- Admin ↔ Any user
- Group conversations (if needed)

**Message Types**:
- Text messages
- File attachments (PDF, DOC, images)
- Links and URLs
- Formatted text

**What You Can Do**:
- ✅ Chat in real-time
- ✅ Share files instantly
- ✅ See when messages are read
- ✅ Access conversation history
- ✅ Receive instant notifications

---

### 2. **Notification System**

**Types of Notifications**:

- **For Job Seekers**:
  - Application status updates
  - New job matches
  - Interview invitations
  - Messages from employers
  - Job recommendations

- **For Employers**:
  - New applications received
  - Messages from candidates
  - Application status changes
  - Profile views

- **For Admins**:
  - New user registrations
  - Reported content
  - System alerts
  - Platform statistics

**Notification Features**:
- **Real-time alerts** (bell icon)
- **Unread count** badge
- **Mark as read** functionality
- **Mark all as read** option
- **Delete notifications**
- **Notification history**
- **Email notifications** (configurable)

**Notification Panel**:
- Dropdown in header
- Shows recent notifications
- Click to navigate to relevant page
- Timestamp display
- Priority indicators

**What You Can Do**:
- ✅ Stay updated in real-time
- ✅ Never miss important updates
- ✅ Manage notification preferences
- ✅ Clear old notifications
- ✅ Quick access to relevant content

---

### 3. **File Upload System**

**Supported File Types**:

- **Avatars/Profile Pictures**:
  - Formats: JPEG, PNG, GIF, WEBP
  - Max size: 5MB
  - Auto-resize and optimize
  - Stored in: `/public/uploads/avatars/`

- **Resumes/CVs**:
  - Formats: PDF, DOC, DOCX
  - Max size: 10MB
  - Stored in: `/public/uploads/resumes/`

- **Chat Attachments**:
  - Formats: PDF, DOC, DOCX, images
  - Max size: 10MB
  - Stored in: `/public/uploads/chat/`

- **Company Logos**:
  - Formats: JPEG, PNG, SVG
  - Max size: 2MB
  - Stored in: `/public/uploads/logos/`

**Upload Features**:
- ✅ Drag and drop support
- ✅ File type validation
- ✅ Size limit enforcement
- ✅ Progress indicators
- ✅ Preview before upload
- ✅ Replace existing files
- ✅ Delete uploaded files

**Security**:
- File type verification
- Virus scanning (recommended)
- Unique filename generation
- Secure storage location

---

### 4. **Search & Filter System**

**Global Search Capabilities**:

- **Jobs**:
  - Title, description, company
  - Skills and requirements
  - Location
  - Salary range

- **Candidates** (Employer view):
  - Name, skills, experience
  - Location, availability
  - Education, certifications

- **Applications**:
  - Candidate name
  - Job title
  - Status, date range

**Advanced Filters**:
- Multiple criteria combination
- Save filter presets
- Quick filter buttons
- Reset all filters
- URL parameter persistence

**What You Can Do**:
- ✅ Find exactly what you need
- ✅ Combine multiple filters
- ✅ Save time with quick search
- ✅ Get relevant results

---

### 5. **Theme System**

**Features**:
- **Light Mode**: Bright, clean interface
- **Dark Mode**: Easy on the eyes
- **Auto Theme**: System preference detection
- **Theme Toggle**: Available in header
- **Persistent**: Saves preference

**Benefits**:
- ✅ Comfortable viewing
- ✅ Reduce eye strain
- ✅ Personal preference
- ✅ Professional appearance

---

### 6. **Responsive Design**

**Supported Devices**:
- Desktop (1920px+)
- Laptop (1280px - 1920px)
- Tablet (768px - 1280px)
- Mobile (320px - 768px)

**Features**:
- Mobile-first design
- Touch-friendly interfaces
- Collapsible sidebars
- Responsive tables
- Adaptive layouts

**What You Can Do**:
- ✅ Access from any device
- ✅ Use on mobile phones
- ✅ Work on tablets
- ✅ Full functionality everywhere

---

## Technical Configuration

### Email System (SMTP)

**Configuration Method**: Environment Variables

**Required Variables** (in `.env` file):
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="abenitj@gmail.com"
SMTP_PASS="arqsqoteqalhklll"
SMTP_FROM_EMAIL="abenitj@gmail.com"
SMTP_FROM_NAME="Hope Jobs"
```

**Email Features**:
- Password reset emails
- Application notifications
- Status update emails
- Welcome emails
- System announcements

**Email Templates**:
- Professional HTML design
- Mobile-responsive
- Brand colors (Orange/Amber)
- Clear call-to-action buttons
- Plain text fallback

**Supported Providers**:
- ✅ Gmail
- ✅ Outlook/Office 365
- ✅ SendGrid
- ✅ Mailgun
- ✅ Amazon SES
- ✅ Custom SMTP servers

---

### Database Schema

**Models**:

1. **User**
   - Core user information
   - Authentication credentials
   - Role and status
   - Relations to profiles

2. **JobSeekerProfile**
   - Extended seeker information
   - Skills and experience
   - Education history
   - Resume and preferences

3. **EmployerProfile**
   - Company information
   - Branding details
   - Contact information

4. **Job**
   - Job postings
   - Requirements and responsibilities
   - Status and dates
   - Relations to applications

5. **Application**
   - Job applications
   - Cover letters
   - Status tracking
   - Timestamps

6. **Chat** & **Message**
   - Conversation threads
   - Real-time messaging
   - File attachments
   - Read status

7. **Notification**
   - System notifications
   - User alerts
   - Read status
   - Notification types

8. **PasswordReset**
   - Reset tokens
   - Expiration tracking
   - Usage status
   - Security logging

---

### User Statuses

**ACTIVE**:
- Can log in
- Full access to features
- Default status

**SUSPENDED**:
- Cannot log in
- Temporary restriction
- Admin action required to restore

**DELETED**:
- Cannot log in
- Account marked for deletion
- Data retention policy applies

---

### Job Statuses

**OPEN**:
- Accepting applications
- Visible to job seekers
- Active on platform

**CLOSED**:
- Not accepting applications
- Visible but cannot apply
- Position filled or expired

**DRAFT**:
- Not published
- Not visible to job seekers
- Work in progress

---

### Application Statuses

**PENDING**:
- Newly submitted
- Awaiting employer review

**REVIEWED**:
- Employer has viewed
- Under consideration

**ACCEPTED**:
- Moved to next stage
- Positive response

**REJECTED**:
- Not selected
- Final decision

---

## Security Features

### Authentication
- ✅ JWT token-based sessions
- ✅ Secure password hashing (bcrypt)
- ✅ Session timeout
- ✅ Role-based access control
- ✅ Protected API routes

### Data Protection
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Secure file uploads
- ✅ Input validation

### Privacy
- ✅ Email not revealed in API responses
- ✅ Password reset tokens hashed
- ✅ Secure token expiration
- ✅ User data isolation
- ✅ Role-based data access

---

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - Authentication
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users` - Update users
- `GET /api/admin/jobs` - List all jobs
- `DELETE /api/admin/jobs/[jobId]` - Delete job
- `GET /api/admin/profile` - Get admin profile
- `PATCH /api/admin/profile` - Update admin profile

### Employer Endpoints
- `GET /api/employer/jobs` - List employer's jobs
- `POST /api/employer/jobs` - Create new job
- `PATCH /api/employer/jobs/[jobId]` - Update job
- `DELETE /api/employer/jobs/[jobId]` - Delete job
- `GET /api/employer/applications` - List applications
- `PATCH /api/employer/applications/[id]` - Update application status
- `GET /api/employer/profile` - Get employer profile
- `PATCH /api/employer/profile` - Update employer profile

### Seeker Endpoints
- `POST /api/seeker/apply` - Submit job application
- `GET /api/seeker/profile` - Get seeker profile
- `PATCH /api/seeker/profile` - Update seeker profile

### Common Endpoints
- `GET /api/notifications` - List notifications
- `PATCH /api/notifications/[id]` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all read
- `DELETE /api/notifications/[id]` - Delete notification
- `POST /api/chat/create` - Create chat
- `GET /api/chat/[chatId]/messages` - Get messages
- `POST /api/chat/[chatId]/messages` - Send message
- `POST /api/upload/avatar` - Upload avatar
- `POST /api/upload/resume` - Upload resume
- `POST /api/upload/chat-file` - Upload chat file

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Theme**: next-themes

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: NextAuth.js v5
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **File Upload**: Native Node.js
- **Validation**: Zod

### Development
- **Language**: TypeScript
- **Build Tool**: Next.js + Webpack
- **Dev Server**: tsx (TypeScript execution)
- **Database Tools**: Prisma Studio
- **Package Manager**: npm

---

## Network Access Configuration

### Local Access
```
http://localhost:3000
```

### Network Access
```
http://192.168.0.122:3000
```

**Configuration** (`server.ts`):
```typescript
const hostname = "0.0.0.0" // Listen on all network interfaces
const port = 3000
```

**Firewall** (if needed):
```bash
sudo ufw allow 3000/tcp
```

**Access from Other Devices**:
1. Ensure devices are on same network
2. Use server IP: `192.168.0.122:3000`
3. Access all features remotely

---

## Best Practices

### For Admins
- ✅ Regularly monitor user activity
- ✅ Review and moderate content
- ✅ Backup database regularly
- ✅ Monitor system performance
- ✅ Update user statuses promptly
- ✅ Respond to reports quickly

### For Employers
- ✅ Complete company profile
- ✅ Write clear job descriptions
- ✅ Respond to applications promptly
- ✅ Update application statuses
- ✅ Close filled positions
- ✅ Maintain professional communication

### For Job Seekers
- ✅ Complete your profile
- ✅ Upload updated resume
- ✅ Write personalized cover letters
- ✅ Apply to relevant jobs only
- ✅ Keep availability updated
- ✅ Respond to employer messages
- ✅ Update skills regularly

---

## Troubleshooting

### Common Issues

**Cannot Login**:
- Check email spelling
- Verify password
- Check account status (not suspended)
- Clear browser cache

**Password Reset Not Working**:
- Check spam folder for email
- Wait a few minutes for email
- Verify SMTP configuration
- Check token hasn't expired (1 hour)

**File Upload Fails**:
- Check file size limits
- Verify file format
- Ensure stable connection
- Try different browser

**Messages Not Sending**:
- Check internet connection
- Refresh the page
- Verify Socket.io connection
- Check browser console for errors

**Search Returns No Results**:
- Clear all filters
- Try broader search terms
- Check spelling
- Verify jobs/candidates exist

---

## Support & Contact

For technical issues or questions:
- Contact: abenitj@gmail.com
- Platform: Hope Jobs
- Documentation: `/docs/`

---

**Last Updated**: October 16, 2025  
**Version**: 1.0.0  
**Platform**: Hope Jobs Job Portal


