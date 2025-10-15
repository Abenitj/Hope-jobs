# Hope Jobs - Job Finding Platform

A modern, professional job marketplace platform built with Next.js 15, connecting job seekers with employers through a beautiful golden-themed interface.

## 📚 Documentation

**Complete documentation available in `/docs` folder:**
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Complete admin capabilities and procedures
- **[USER_ROLES.md](docs/USER_ROLES.md)** - All user roles explained in detail
- **[FEATURES.md](docs/FEATURES.md)** - Complete feature list and status
- **[API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** - All API endpoints
- **[QUICK_START.md](QUICK_START.md)** - Quick setup guide
- **[Documentation Index](docs/INDEX.md)** - Central documentation hub

## Features

### For Admins
- User management (view, suspend, delete users)
- Job moderation
- System analytics and statistics
- Dashboard with real-time insights

### For Employers
- Post and manage job listings
- Search for candidates by availability and skills
- Review and manage applications
- Real-time chat with candidates (coming soon)

### For Job Seekers
- Create comprehensive profiles
- Search and apply for jobs
- Track application status
- Chat with employers (coming soon)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (development) / PostgreSQL (production)
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5
- **UI:** Shadcn UI + Tailwind CSS
- **Real-time:** Socket.io (for chat and notifications)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
cd /home/abenezer/projects/Boez/Hope-jobs
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
```

4. Seed the database with sample data:
```bash
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Users

After seeding, you can log in with these accounts:

**Admin:**
- Email: admin@hopejobs.com
- Password: Admin@123

**Employer:**
- Email: employer@company.com
- Password: Employer@123

**Job Seeker:**
- Email: seeker@example.com
- Password: Seeker@123

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── employer/          # Employer dashboard
│   ├── seeker/            # Job seeker dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/                # Shadcn UI components
│   └── layout/            # Layout components
├── lib/                   # Utility functions
└── types/                 # TypeScript types

prisma/
└── schema.prisma          # Database schema
```

## Database Schema

The platform uses the following main models:

- **User:** Authentication and role management
- **JobSeekerProfile:** Job seeker information
- **EmployerProfile:** Employer/company information
- **Job:** Job postings
- **Application:** Job applications
- **Chat & Message:** Real-time messaging
- **Notification:** User notifications

## API Routes

### Admin
- `PATCH /api/admin/users` - Update user status
- `DELETE /api/admin/jobs/:id` - Delete job posting

### Employer
- `POST /api/employer/jobs` - Create job posting
- `PATCH /api/employer/jobs/:id` - Update job posting
- `DELETE /api/employer/jobs/:id` - Delete job posting
- `PATCH /api/employer/applications/:id` - Update application status

### Job Seeker
- `POST /api/seeker/profile` - Create/update profile
- `POST /api/seeker/applications` - Submit job application

## Features Roadmap

- [x] Admin dashboard with user management
- [x] Employer job posting and management
- [x] Job seeker profile and applications
- [x] Candidate search for employers
- [ ] Real-time chat system
- [ ] Push notifications
- [ ] Email notifications
- [ ] Advanced job search filters
- [ ] Resume upload and parsing
- [ ] Company verification system

## Contributing

This is a private project. For questions or issues, please contact the project owner.

## License

Proprietary - All rights reserved


