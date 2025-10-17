export async function saveUploadedFile(
  file: File,
  directory: 'avatars' | 'resumes' | 'logos'
): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // For avatars, convert to base64 data URI (works on Render/serverless)
  if (directory === 'avatars') {
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`
    return dataUri
  }

  // For resumes and logos, also use base64 for now
  // In production, consider using cloud storage (Cloudinary, S3, etc.)
  const base64 = buffer.toString('base64')
  const dataUri = `data:${file.type};base64,${base64}`
  return dataUri
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' }
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' }
  }

  return { valid: true }
}

export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF and Word documents are allowed' }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Resume size must be less than 10MB' }
  }

  return { valid: true }
}

