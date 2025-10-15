import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hopejobs.com' },
    update: {},
    create: {
      email: 'admin@hopejobs.com',
      password: adminPassword,
      name: 'System Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })
  console.log('✅ Created admin user')

  // Create Employer Users
  const employerPassword = await bcrypt.hash('Employer@123', 10)
  const employer1 = await prisma.user.upsert({
    where: { email: 'employer@company.com' },
    update: {},
    create: {
      email: 'employer@company.com',
      password: employerPassword,
      name: 'John Employer',
      role: 'EMPLOYER',
      status: 'ACTIVE',
      employerProfile: {
        create: {
          companyName: 'Tech Innovations Inc',
          companySize: '50-200',
          industry: 'Technology',
          location: 'San Francisco, CA',
          website: 'https://techinnovations.example.com',
          description: 'Leading technology company specializing in AI and ML solutions.',
        },
      },
    },
  })
  console.log('✅ Created employer user')

  // Create Job Seeker Users
  const seekerPassword = await bcrypt.hash('Seeker@123', 10)
  const seeker1 = await prisma.user.upsert({
    where: { email: 'seeker@example.com' },
    update: {},
    create: {
      email: 'seeker@example.com',
      password: seekerPassword,
      name: 'Jane Seeker',
      role: 'SEEKER',
      status: 'ACTIVE',
      seekerProfile: {
        create: {
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          bio: 'Experienced software developer with 5+ years in full-stack development. Passionate about building scalable web applications.',
          skills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Next.js']),
          expectedSalary: '$80,000 - $120,000',
          availability: 'WITHIN_2_WEEKS',
        },
      },
    },
  })

  const seeker2 = await prisma.user.upsert({
    where: { email: 'michael.dev@example.com' },
    update: {},
    create: {
      email: 'michael.dev@example.com',
      password: seekerPassword,
      name: 'Michael Developer',
      role: 'SEEKER',
      status: 'ACTIVE',
      seekerProfile: {
        create: {
          phone: '+1 (555) 987-6543',
          location: 'Austin, TX',
          bio: 'Frontend specialist with expertise in modern JavaScript frameworks and UI/UX design.',
          skills: JSON.stringify(['React', 'Vue.js', 'CSS', 'Tailwind', 'Figma', 'HTML5']),
          expectedSalary: '$70,000 - $100,000',
          availability: 'IMMEDIATELY',
        },
      },
    },
  })
  console.log('✅ Created job seeker users')

  // Create Sample Jobs
  const job1 = await prisma.job.create({
    data: {
      employerId: employer1.id,
      title: 'Senior Full Stack Developer',
      description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will work on cutting-edge projects using modern technologies.',
      requirements: 'Bachelor\'s degree in Computer Science\n5+ years of experience\nStrong knowledge of React and Node.js',
      responsibilities: 'Design and develop new features\nMaintain existing codebase\nCollaborate with team members',
      skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'PostgreSQL']),
      salary: '$100,000 - $140,000',
      location: 'San Francisco, CA (Remote Available)',
      type: 'FULL_TIME',
      status: 'OPEN',
      postedAt: new Date(),
    },
  })

  const job2 = await prisma.job.create({
    data: {
      employerId: employer1.id,
      title: 'Frontend Developer',
      description: 'Join our frontend team to create beautiful and responsive user interfaces.',
      requirements: '3+ years of experience\nExpertise in React\nKnowledge of modern CSS',
      responsibilities: 'Build reusable components\nOptimize applications\nWork with designers',
      skills: JSON.stringify(['React', 'JavaScript', 'CSS', 'HTML']),
      salary: '$80,000 - $110,000',
      location: 'Remote',
      type: 'FULL_TIME',
      status: 'OPEN',
      postedAt: new Date(),
    },
  })

  const job3 = await prisma.job.create({
    data: {
      employerId: employer1.id,
      title: 'UI/UX Designer Intern',
      description: 'Great opportunity for students or recent graduates to learn UI/UX design in a real-world environment.',
      requirements: 'Portfolio of design work\nKnowledge of Figma or Sketch\nCreative thinking',
      responsibilities: 'Create mockups and prototypes\nConduct user research\nCollaborate with developers',
      skills: JSON.stringify(['Figma', 'UI Design', 'UX Research', 'Prototyping']),
      salary: '$20,000 - $30,000',
      location: 'San Francisco, CA',
      type: 'INTERNSHIP',
      status: 'OPEN',
      postedAt: new Date(),
    },
  })
  console.log('✅ Created sample jobs')

  // Create Sample Applications
  await prisma.application.create({
    data: {
      jobId: job1.id,
      seekerId: seeker1.id,
      coverLetter: 'I am very interested in this position as it aligns perfectly with my skills and experience. I have been working with React and Node.js for the past 5 years...',
      status: 'PENDING',
    },
  })

  await prisma.application.create({
    data: {
      jobId: job2.id,
      seekerId: seeker2.id,
      coverLetter: 'As a frontend specialist, I believe I would be a great fit for this role. My experience with React and modern CSS frameworks...',
      status: 'REVIEWED',
    },
  })
  console.log('✅ Created sample applications')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📧 Login Credentials:')
  console.log('Admin: admin@hopejobs.com / Admin@123')
  console.log('Employer: employer@company.com / Employer@123')
  console.log('Seeker: seeker@example.com / Seeker@123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


