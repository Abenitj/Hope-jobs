// Type definitions to replace Prisma enums (SQLite doesn't support enums)

export type UserRole = 'ADMIN' | 'EMPLOYER' | 'SEEKER'

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED'

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP'

export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT'

export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED'

export type AvailabilityStatus = 'IMMEDIATELY' | 'WITHIN_2_WEEKS' | 'WITHIN_1_MONTH' | 'NOT_AVAILABLE'

export type NotificationType = 'APPLICATION' | 'MESSAGE' | 'JOB_UPDATE' | 'SYSTEM'


