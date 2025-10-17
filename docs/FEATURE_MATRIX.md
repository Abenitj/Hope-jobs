# Hope Jobs - Feature Permission Matrix

This document shows what each role can and cannot do in the platform.

## Feature Access Matrix

| Feature | Admin | Employer | Seeker | Public |
|---------|:-----:|:--------:|:------:|:------:|
| **Authentication** |
| Register | ✅ | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Logout | ✅ | ✅ | ✅ | ❌ |
| Forgot Password | ✅ | ✅ | ✅ | ✅ |
| Reset Password | ✅ | ✅ | ✅ | ✅ |
| **User Management** |
| View All Users | ✅ | ❌ | ❌ | ❌ |
| Edit Any User | ✅ | ❌ | ❌ | ❌ |
| Suspend Users | ✅ | ❌ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ |
| Change User Roles | ✅ | ❌ | ❌ | ❌ |
| View Own Profile | ✅ | ✅ | ✅ | ❌ |
| Edit Own Profile | ✅ | ✅ | ✅ | ❌ |
| **Job Management** |
| View All Jobs | ✅ | ✅ | ✅ | ❌ |
| Create Job | ❌ | ✅ | ❌ | ❌ |
| Edit Own Jobs | ❌ | ✅ | ❌ | ❌ |
| Edit Any Job | ✅ | ❌ | ❌ | ❌ |
| Delete Own Jobs | ❌ | ✅ | ❌ | ❌ |
| Delete Any Job | ✅ | ❌ | ❌ | ❌ |
| Close Jobs | ✅ | ✅ | ❌ | ❌ |
| View Job Details | ✅ | ✅ | ✅ | ❌ |
| **Applications** |
| Apply to Jobs | ❌ | ❌ | ✅ | ❌ |
| View Own Applications | ❌ | ❌ | ✅ | ❌ |
| View All Applications | ✅ | ❌ | ❌ | ❌ |
| View Job Applications | ❌ | ✅ | ❌ | ❌ |
| Update Application Status | ✅ | ✅ | ❌ | ❌ |
| Withdraw Application | ❌ | ❌ | ✅ | ❌ |
| Download Applicant Resume | ✅ | ✅ | ❌ | ❌ |
| **Candidate Search** |
| Search All Candidates | ✅ | ✅ | ❌ | ❌ |
| View Candidate Profiles | ✅ | ✅ | ❌ | ❌ |
| Direct Recruit | ❌ | ✅ | ❌ | ❌ |
| **Messaging** |
| Send Messages | ✅ | ✅ | ✅ | ❌ |
| Receive Messages | ✅ | ✅ | ✅ | ❌ |
| Share Files in Chat | ✅ | ✅ | ✅ | ❌ |
| View Chat History | ✅ | ✅ | ✅ | ❌ |
| **Notifications** |
| Receive Notifications | ✅ | ✅ | ✅ | ❌ |
| Mark as Read | ✅ | ✅ | ✅ | ❌ |
| Delete Notifications | ✅ | ✅ | ✅ | ❌ |
| **Analytics** |
| View Platform Analytics | ✅ | ❌ | ❌ | ❌ |
| View Own Job Analytics | ❌ | ✅ | ❌ | ❌ |
| Export Reports | ✅ | ✅ | ❌ | ❌ |
| **File Uploads** |
| Upload Avatar | ✅ | ✅ | ✅ | ❌ |
| Upload Resume | ❌ | ❌ | ✅ | ❌ |
| Upload Company Logo | ❌ | ✅ | ❌ | ❌ |
| Upload Chat Files | ✅ | ✅ | ✅ | ❌ |

---

## Role-Based Page Access

### Admin Pages (`/admin/*`)
```
✅ /admin/dashboard       - Platform overview
✅ /admin/users           - User management
✅ /admin/jobs            - Job moderation
✅ /admin/analytics       - Platform analytics
✅ /admin/profile         - Admin profile settings
```

### Employer Pages (`/employer/*`)
```
✅ /employer/dashboard              - Recruitment overview
✅ /employer/jobs                   - Job listings
✅ /employer/jobs/new               - Create new job
✅ /employer/jobs/[id]              - Job details
✅ /employer/jobs/[id]/edit         - Edit job
✅ /employer/applications           - Application management
✅ /employer/applications/[id]      - Application details
✅ /employer/candidates             - Candidate search
✅ /employer/candidates/[id]        - Candidate profile
✅ /employer/messages               - Messaging
✅ /employer/profile                - Company profile
```

### Seeker Pages (`/seeker/*`)
```
✅ /seeker/dashboard        - Job search overview
✅ /seeker/jobs             - Browse jobs
✅ /seeker/jobs/[id]        - Job details & apply
✅ /seeker/applications     - My applications
✅ /seeker/messages         - Messaging
✅ /seeker/profile          - Professional profile
```

### Public Pages
```
✅ /                        - Landing page
✅ /register                - Sign up
✅ /login                   - Sign in
✅ /forgot-password         - Request password reset
✅ /reset-password          - Reset password (with token)
```

---

## Permission Hierarchy

```
ADMIN (Highest)
  ├─ Full platform access
  ├─ Can manage all users
  ├─ Can moderate all content
  └─ View all analytics

EMPLOYER
  ├─ Manage own jobs
  ├─ Review applications for own jobs
  ├─ Search and contact candidates
  └─ View own recruitment metrics

SEEKER
  ├─ Browse and search jobs
  ├─ Apply to jobs
  ├─ Manage own profile
  └─ Track own applications

PUBLIC (Lowest)
  ├─ View landing page
  ├─ Register account
  └─ Request password reset
```

---

## Data Access Rules

### Admin Can Access:
- ✅ All user data (any role)
- ✅ All job postings (any employer)
- ✅ All applications (any job/candidate)
- ✅ All messages (moderation)
- ✅ All notifications
- ✅ System-wide analytics

### Employer Can Access:
- ✅ Own company profile
- ✅ Own job postings only
- ✅ Applications for own jobs only
- ✅ Candidate public profiles
- ✅ Own messages
- ✅ Own notifications
- ✅ Own job analytics

### Seeker Can Access:
- ✅ Own profile only
- ✅ Own applications only
- ✅ Public job listings
- ✅ Own messages
- ✅ Own notifications
- ✅ Own application history

---

## Role-Specific Workflows

### Admin Daily Tasks:
1. Check dashboard for platform overview
2. Review new user registrations
3. Moderate flagged content
4. Respond to user reports
5. Monitor platform health
6. Review analytics trends

### Employer Daily Tasks:
1. Check dashboard for new applications
2. Review pending applications
3. Update application statuses
4. Message shortlisted candidates
5. Post new jobs if needed
6. Update company profile

### Seeker Daily Tasks:
1. Browse new job postings
2. Apply to relevant positions
3. Check application statuses
4. Respond to employer messages
5. Update profile/resume
6. Set availability status

---

## Feature Comparison

### Job Posting

| Feature | Admin | Employer | Seeker |
|---------|-------|----------|--------|
| Create job | ❌ | ✅ | ❌ |
| Edit own job | ❌ | ✅ | ❌ |
| Edit any job | ✅ | ❌ | ❌ |
| Delete own job | ❌ | ✅ | ❌ |
| Delete any job | ✅ | ❌ | ❌ |
| View job details | ✅ | ✅ | ✅ |
| Save job as draft | ❌ | ✅ | ❌ |
| Close job | ✅ | ✅ | ❌ |

### Application Management

| Feature | Admin | Employer | Seeker |
|---------|-------|----------|--------|
| Submit application | ❌ | ❌ | ✅ |
| View own applications | ❌ | ❌ | ✅ |
| View job applications | ✅ | ✅ (own jobs) | ❌ |
| Update status | ✅ | ✅ (own jobs) | ❌ |
| Withdraw application | ❌ | ❌ | ✅ |
| Download resume | ✅ | ✅ | ✅ (own) |

### Profile Management

| Feature | Admin | Employer | Seeker |
|---------|-------|----------|--------|
| Edit own profile | ✅ | ✅ | ✅ |
| Edit any profile | ✅ | ❌ | ❌ |
| Upload avatar | ✅ | ✅ | ✅ |
| Upload resume | ❌ | ❌ | ✅ |
| Upload company logo | ❌ | ✅ | ❌ |
| View public profiles | ✅ | ✅ | ❌ |

---

## Security & Privacy

### Role-Based Security:

**Admin**:
- Cannot access employer/seeker-specific actions
- Cannot delete own account
- All actions logged

**Employer**:
- Can only manage own jobs
- Can only view applications for own jobs
- Cannot see other employers' data
- Cannot modify seeker profiles

**Seeker**:
- Can only manage own profile
- Can only view own applications
- Cannot see other seekers' data
- Cannot modify job postings

### Data Isolation:
- Users can only access data they own
- Cross-role data access is restricted
- Admin has oversight capabilities
- Audit trails maintained

---

## Common Questions

**Q: Can an employer also be a job seeker?**  
A: No, each account has one role. Create separate accounts if needed.

**Q: Can admin post jobs?**  
A: No, admins moderate but don't post jobs. Create an employer account for posting.

**Q: How do employers find candidates?**  
A: Use the Candidates page to search the database, or wait for applications.

**Q: Can seekers message employers directly?**  
A: Yes, after applying to a job or if employer initiates contact.

**Q: How long do password reset tokens last?**  
A: 1 hour from the time they're sent.

**Q: Can employers see all candidates?**  
A: Yes, employers can browse all job seeker profiles.

**Q: Can seekers see other seekers?**  
A: No, seekers can only see their own profile.

---

**Document Version**: 1.0  
**Last Updated**: October 16, 2025  
**Platform**: Hope Jobs





