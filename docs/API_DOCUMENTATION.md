# API Documentation

## Overview

Hope Jobs provides RESTful API endpoints for all platform operations.

---

## 🔐 Authentication

### **POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "SEEKER" | "EMPLOYER"
}
```

**Response:**
```json
{
  "id": "clx123...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "SEEKER"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid data or email already exists
- `500` - Server error

---

### **POST** `/api/auth/[...nextauth]`

NextAuth.js authentication endpoints.

**Endpoints:**
- `/api/auth/signin` - Sign in
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get session
- `/api/auth/providers` - Available providers
- `/api/auth/csrf` - CSRF token

---

## 👥 Admin APIs

### **PATCH** `/api/admin/users`

Update user status (suspend, activate, delete).

**Authentication:** Admin only

**Request Body:**
```json
{
  "userId": "clx123...",
  "action": "suspend" | "activate" | "delete"
}
```

**Response:**
```json
{
  "id": "clx123...",
  "status": "SUSPENDED" | "ACTIVE" | "DELETED"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (not admin)
- `403` - Forbidden (trying to modify admin)
- `404` - User not found
- `500` - Server error

---

### **DELETE** `/api/admin/jobs/:jobId`

Delete a job posting.

**Authentication:** Admin only

**Parameters:**
- `jobId` - Job ID to delete

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - Job not found
- `500` - Server error

---

## 💼 Employer APIs

### **POST** `/api/employer/jobs`

Create a new job posting.

**Authentication:** Employer only

**Request Body:**
```json
{
  "title": "Senior Software Engineer",
  "description": "Job description...",
  "location": "New York, NY",
  "type": "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE" | "INTERNSHIP",
  "salary": "$80,000 - $120,000",
  "requirements": "5+ years experience...",
  "responsibilities": "Design and develop...",
  "skills": "JavaScript, React, Node.js",
  "status": "DRAFT" | "OPEN",
  "postedAt": "2024-10-15T12:00:00Z" (if status is OPEN)
}
```

**Response:**
```json
{
  "id": "clx123...",
  "title": "Senior Software Engineer",
  "status": "OPEN",
  "createdAt": "2024-10-15T12:00:00Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Server error

---

### **PATCH** `/api/employer/jobs/:jobId`

Update an existing job posting.

**Authentication:** Employer only (owner)

**Parameters:**
- `jobId` - Job ID to update

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "status": "CLOSED",
  ...
}
```

**Response:** Updated job object

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not owner)
- `404` - Job not found
- `500` - Server error

---

### **DELETE** `/api/employer/jobs/:jobId`

Delete own job posting.

**Authentication:** Employer only (owner)

**Parameters:**
- `jobId` - Job ID to delete

**Response:**
```json
{
  "success": true
}
```

---

### **PATCH** `/api/employer/applications/:applicationId`

Update application status.

**Authentication:** Employer only (job owner)

**Parameters:**
- `applicationId` - Application ID

**Request Body:**
```json
{
  "status": "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED"
}
```

**Response:** Updated application object

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not job owner)
- `404` - Application not found
- `500` - Server error

---

## 👤 Job Seeker APIs

### **POST** `/api/seeker/profile`

Create or update seeker profile.

**Authentication:** Job Seeker only

**Request Body:**
```json
{
  "phone": "+1 555-123-4567",
  "location": "New York, NY",
  "bio": "Experienced developer...",
  "skills": "[\"JavaScript\", \"React\", \"Node.js\"]",
  "expectedSalary": "$80,000 - $120,000",
  "availability": "IMMEDIATELY" | "WITHIN_2_WEEKS" | "WITHIN_1_MONTH" | "NOT_AVAILABLE"
}
```

**Response:** Profile object

**Status Codes:**
- `200` - Success
- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Server error

---

### **PATCH** `/api/seeker/profile`

Update existing profile (same as POST - uses upsert).

---

## 🔄 Common Patterns

### **Authentication Headers**

All protected endpoints require authentication via NextAuth session.

```javascript
// Automatically handled by NextAuth
// Session cookie sent with each request
```

---

### **Error Response Format**

```json
{
  "error": "Error message description"
}
```

---

### **Success Response Format**

Varies by endpoint, but typically:
```json
{
  "id": "...",
  "...": "data fields"
}
```

---

## 🔒 Security

### **CSRF Protection**
All mutation requests (POST, PATCH, DELETE) require CSRF token.

### **Role-Based Access**
Each endpoint validates user role:
- Admin endpoints check `role === "ADMIN"`
- Employer endpoints check `role === "EMPLOYER"`
- Seeker endpoints check `role === "SEEKER"`

### **Ownership Validation**
Users can only modify their own content:
- Employers can only edit/delete their own jobs
- Employers can only update applications for their jobs
- Seekers can only update their own profile

---

## 📊 Data Validation

### **Using Zod** (Ready for implementation)

Example validation schema:
```typescript
const jobSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  location: z.string().min(2),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"]),
  salary: z.string().optional(),
})
```

---

## 🚀 Future API Endpoints

### **Coming Soon:**

**Chat System:**
- `POST /api/chat` - Start new chat
- `GET /api/chat/:chatId` - Get messages
- `POST /api/chat/:chatId/message` - Send message

**Notifications:**
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

**Job Seeker:**
- `POST /api/seeker/applications` - Apply for job
- `GET /api/seeker/applications` - Get my applications
- `DELETE /api/seeker/applications/:id` - Withdraw application

**File Upload:**
- `POST /api/upload/resume` - Upload resume
- `POST /api/upload/logo` - Upload company logo
- `POST /api/upload/avatar` - Upload profile picture

---

## 📝 API Usage Examples

### **Example: Register New User**

```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'securepass123',
    role: 'SEEKER'
  })
})

const data = await response.json()
```

---

### **Example: Create Job Posting**

```javascript
const response = await fetch('/api/employer/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Frontend Developer',
    description: 'We are looking for...',
    location: 'Remote',
    type: 'FULL_TIME',
    status: 'OPEN',
    postedAt: new Date().toISOString()
  })
})

const job = await response.json()
```

---

### **Example: Suspend User (Admin)**

```javascript
const response = await fetch('/api/admin/users', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'clx123...',
    action: 'suspend'
  })
})

const updatedUser = await response.json()
```

---

## 🛠️ Development Tools

### **Testing APIs**

Using browser DevTools:
```javascript
// In browser console
fetch('/api/admin/users?userId=xyz&action=suspend', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' }
})
```

Using Postman/Insomnia:
- Import endpoints
- Set authentication cookies
- Test all endpoints

---

## 📚 Related Documentation

- `USER_ROLES.md` - Role capabilities
- `ADMIN_GUIDE.md` - Admin procedures
- `README.md` - Project setup

---

**API Version:** 1.0
**Base URL:** http://localhost:3000
**Authentication:** NextAuth.js v5
**Database:** Prisma + SQLite/PostgreSQL

