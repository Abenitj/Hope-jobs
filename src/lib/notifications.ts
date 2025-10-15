import { db } from "@/lib/db"
import { NotificationType } from "@/types/prisma"

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  data?: any
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  data,
}: CreateNotificationParams) {
  try {
    const notification = await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link || null,
        data: data ? JSON.stringify(data) : null,
      },
    })
    return notification
  } catch (error) {
    console.error("[CREATE_NOTIFICATION]", error)
    return null
  }
}

// Notification templates
export const NotificationTemplates = {
  // For Employers
  newApplication: (employerId: string, jobTitle: string, applicantName: string) =>
    createNotification({
      userId: employerId,
      type: "APPLICATION",
      title: "New Application Received",
      message: `${applicantName} applied for ${jobTitle}`,
      link: "/employer/applications",
    }),

  applicationStatusChanged: (seekerId: string, jobTitle: string, status: string) =>
    createNotification({
      userId: seekerId,
      type: "APPLICATION",
      title: "Application Status Updated",
      message: `Your application for ${jobTitle} has been ${status.toLowerCase()}`,
      link: "/seeker/applications",
    }),

  // For Job Seekers
  newJobMatch: (seekerId: string, jobTitle: string, companyName: string) =>
    createNotification({
      userId: seekerId,
      type: "JOB_UPDATE",
      title: "New Job Match",
      message: `${companyName} posted ${jobTitle} - matches your profile!`,
      link: "/seeker/jobs",
    }),

  newMessage: (recipientId: string, senderName: string) =>
    createNotification({
      userId: recipientId,
      type: "MESSAGE",
      title: "New Message",
      message: `You have a new message from ${senderName}`,
      link: "/messages",
    }),

  // For Admins
  newUserRegistration: (adminId: string, userName: string, userRole: string) =>
    createNotification({
      userId: adminId,
      type: "SYSTEM",
      title: "New User Registered",
      message: `${userName} joined as ${userRole}`,
      link: "/admin/users",
    }),

  reportedContent: (adminId: string, contentType: string, reportReason: string) =>
    createNotification({
      userId: adminId,
      type: "SYSTEM",
      title: "Content Reported",
      message: `${contentType} was reported: ${reportReason}`,
      link: "/admin/jobs",
    }),
}

