/**
 * Job Recommendation System
 * 
 * This module provides intelligent job matching based on:
 * - Skills matching
 * - Job type preferences
 * - Location proximity
 * - Experience level
 */

interface JobSeekerProfile {
  skills?: string | null
  preferredJobTypes?: string | null
  location?: string | null
  experience?: string | null
}

interface JobBase {
  id: string
  title: string
  description: string
  skills?: string | null
  type: string
  location: string
  requirements?: string | null
  postedAt: Date | null
}

// Generic type that allows any job with additional properties
type Job = JobBase & Record<string, any>

interface ScoredJob extends Job {
  matchScore: number
  matchReasons: string[]
}

/**
 * Common skill aliases and variations
 * Maps variations to canonical form
 */
const SKILL_ALIASES: Record<string, string[]> = {
  javascript: ['js', 'javascript', 'java script', 'javascprit'],
  typescript: ['ts', 'typescript', 'type script'],
  react: ['react', 'reactjs', 'react.js', 'react js'],
  nodejs: ['node', 'nodejs', 'node.js', 'node js'],
  python: ['python', 'python3', 'py'],
  java: ['java'],
  'c++': ['cpp', 'c++', 'cplusplus'],
  'c#': ['csharp', 'c#', 'c sharp'],
  mongodb: ['mongo', 'mongodb', 'mongo db'],
  postgresql: ['postgres', 'postgresql', 'pg'],
  mysql: ['mysql', 'my sql'],
  docker: ['docker', 'containerization'],
  kubernetes: ['k8s', 'kubernetes', 'kube'],
  aws: ['aws', 'amazon web services'],
  azure: ['azure', 'microsoft azure'],
  git: ['git', 'github', 'gitlab'],
}

/**
 * Parse JSON string safely
 */
function parseJsonField(field: string | null | undefined): string[] {
  if (!field) return []
  try {
    const parsed = JSON.parse(field)
    return Array.isArray(parsed) ? parsed.map(s => s.toLowerCase().trim()) : []
  } catch {
    return []
  }
}

/**
 * Calculate Levenshtein distance (edit distance) between two strings
 * Used for fuzzy matching to handle typos
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + 1  // substitution
        )
      }
    }
  }

  return matrix[len1][len2]
}

/**
 * Calculate similarity score between two strings (0-1)
 * 1 = exact match, 0 = completely different
 */
function stringSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length)
  if (maxLen === 0) return 1
  const distance = levenshteinDistance(str1, str2)
  return 1 - distance / maxLen
}

/**
 * Check if two skills match (handles typos and aliases)
 */
function skillsMatch(userSkill: string, jobSkill: string): boolean {
  const user = userSkill.toLowerCase().trim()
  const job = jobSkill.toLowerCase().trim()

  // 1. Exact match
  if (user === job) return true

  // 2. Substring match
  if (user.includes(job) || job.includes(user)) return true

  // 3. Check aliases
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    const userInAliases = aliases.some(alias => user.includes(alias) || alias.includes(user))
    const jobInAliases = aliases.some(alias => job.includes(alias) || alias.includes(job))
    if (userInAliases && jobInAliases) return true
  }

  // 4. Fuzzy match for typos (80% similarity threshold)
  const similarity = stringSimilarity(user, job)
  if (similarity >= 0.8) return true

  return false
}

/**
 * Calculate skill match percentage
 */
function calculateSkillMatch(userSkills: string[], jobSkills: string[]): number {
  if (userSkills.length === 0 || jobSkills.length === 0) return 0
  
  // Count how many job skills the user has (with fuzzy matching)
  const matches = jobSkills.filter(jobSkill => 
    userSkills.some(userSkill => skillsMatch(userSkill, jobSkill))
  )
  
  return matches.length / jobSkills.length
}

/**
 * Check if location matches
 */
function isLocationMatch(userLocation: string, jobLocation: string): boolean {
  if (!userLocation || !jobLocation) return false
  const userLoc = userLocation.toLowerCase().trim()
  const jobLoc = jobLocation.toLowerCase().trim()
  return jobLoc.includes(userLoc) || userLoc.includes(jobLoc)
}

/**
 * Calculate experience level score
 */
function calculateExperienceScore(userExperience: string[], jobRequirements: string[]): number {
  if (userExperience.length === 0 || jobRequirements.length === 0) return 0.5 // neutral
  
  // Extract years of experience from user profile
  const userYears = extractYearsOfExperience(userExperience)
  
  // Check if job requirements mention experience
  const reqText = jobRequirements.join(' ').toLowerCase()
  
  if (reqText.includes('entry') || reqText.includes('junior')) {
    return userYears <= 2 ? 1 : 0.7
  } else if (reqText.includes('senior') || reqText.includes('lead')) {
    return userYears >= 5 ? 1 : 0.5
  } else if (reqText.includes('mid') || reqText.includes('intermediate')) {
    return userYears >= 2 && userYears <= 5 ? 1 : 0.7
  }
  
  return 0.5 // neutral if can't determine
}

/**
 * Extract years of experience from experience array
 */
function extractYearsOfExperience(experience: string[]): number {
  let totalYears = 0
  
  for (const exp of experience) {
    // Look for patterns like "2 years", "3+ years", etc.
    const match = exp.match(/(\d+)\+?\s*years?/i)
    if (match) {
      totalYears += parseInt(match[1])
    }
  }
  
  return totalYears
}

/**
 * Main recommendation algorithm
 * Scores jobs based on multiple factors
 */
export function scoreJobs<T extends JobBase>(
  profile: JobSeekerProfile,
  jobs: T[]
): (T & { matchScore: number; matchReasons: string[] })[] {
  const userSkills = parseJsonField(profile.skills)
  const userPreferredTypes = parseJsonField(profile.preferredJobTypes)
  const userLocation = profile.location?.toLowerCase().trim() || ''
  const userExperience = parseJsonField(profile.experience)
  
  const scoredJobs = jobs.map(job => {
    let score = 0
    const reasons: string[] = []
    
    // 1. Skills matching (40% weight)
    const jobSkills = parseJsonField(job.skills)
    const skillMatch = calculateSkillMatch(userSkills, jobSkills)
    if (skillMatch > 0) {
      const skillScore = skillMatch * 40
      score += skillScore
      if (skillMatch >= 0.5) {
        reasons.push(`${Math.round(skillMatch * 100)}% skills match`)
      }
    }
    
    // 2. Job type preference (30% weight)
    if (userPreferredTypes.length > 0) {
      const jobType = job.type.toLowerCase()
      const typeMatch = userPreferredTypes.some(type => 
        type === jobType || jobType.includes(type) || type.includes(jobType)
      )
      if (typeMatch) {
        score += 30
        reasons.push('Matches preferred job type')
      }
    } else {
      // No preference specified, give neutral score
      score += 15
    }
    
    // 3. Location matching (15% weight)
    if (userLocation && job.location) {
      if (isLocationMatch(userLocation, job.location)) {
        score += 15
        reasons.push('Location match')
      }
    } else {
      // No location specified, give neutral score
      score += 7.5
    }
    
    // 4. Experience level matching (10% weight)
    const jobRequirements = parseJsonField(job.requirements)
    const expScore = calculateExperienceScore(userExperience, jobRequirements)
    score += expScore * 10
    if (expScore === 1) {
      reasons.push('Experience level matches')
    }
    
    // 5. Recency bonus (5% weight)
    if (job.postedAt) {
      const daysSincePosted = (Date.now() - job.postedAt.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSincePosted <= 7) {
        score += 5
        reasons.push('Recently posted')
      } else if (daysSincePosted <= 30) {
        score += 2.5
      }
    }
    
    // If no specific matches found, add generic reason
    if (reasons.length === 0) {
      reasons.push('Available opportunity')
    }
    
    return {
      ...job,
      matchScore: Math.round(score),
      matchReasons: reasons
    }
  })
  
  // Sort by score (highest first)
  return scoredJobs.sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Get top recommended jobs for a user
 */
export function getTopRecommendations<T extends JobBase>(
  profile: JobSeekerProfile,
  jobs: T[],
  limit: number = 6
): (T & { matchScore: number; matchReasons: string[] })[] {
  const scored = scoreJobs(profile, jobs)
  return scored.slice(0, limit)
}

/**
 * Get recommendation explanation for a specific job
 */
export function explainRecommendation<T extends JobBase>(
  profile: JobSeekerProfile,
  job: T
): string {
  const scored = scoreJobs(profile, [job])[0]
  
  if (!scored) return 'This job matches your profile'
  
  const reasons = scored.matchReasons
  if (reasons.length === 0) return 'This job is available'
  if (reasons.length === 1) return reasons[0]
  if (reasons.length === 2) return reasons.join(' and ')
  
  const last = reasons[reasons.length - 1]
  const rest = reasons.slice(0, -1).join(', ')
  return `${rest}, and ${last}`
}

