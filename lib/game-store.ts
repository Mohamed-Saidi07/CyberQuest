import type { UserProgress, ChallengeResult, Badge, LeaderboardEntry } from './types'

const STORAGE_KEY = 'cyberquest_progress'

export const RANKS = [
  { name: 'Script Kiddie', minPoints: 0 },
  { name: 'Digital Cadet', minPoints: 100 },
  { name: 'Cyber Scout', minPoints: 300 },
  { name: 'Firewall Guardian', minPoints: 600 },
  { name: 'Encryption Specialist', minPoints: 1000 },
  { name: 'Threat Hunter', minPoints: 1500 },
  { name: 'Cyber Sentinel', minPoints: 2200 },
  { name: 'Digital Defender', minPoints: 3000 },
  { name: 'Master Hacker', minPoints: 4000 },
  { name: 'Cyber Legend', minPoints: 5500 },
]

export const BADGE_DEFINITIONS: Omit<Badge, 'earnedAt'>[] = [
  { id: 'first-challenge', name: 'First Steps', description: 'Complete your first challenge', icon: 'Footprints' },
  { id: 'perfect-score', name: 'Perfectionist', description: 'Get a perfect score on any challenge', icon: 'Star' },
  { id: 'streak-3', name: 'On Fire', description: 'Complete 3 challenges in a row', icon: 'Flame' },
  { id: 'streak-7', name: 'Unstoppable', description: 'Complete 7 challenges in a row', icon: 'Zap' },
  { id: 'category-master', name: 'Category Master', description: 'Complete all challenges in a category', icon: 'Crown' },
  { id: '10-challenges', name: 'Double Digits', description: 'Complete 10 challenges', icon: 'Hash' },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete a challenge in under 30 seconds', icon: 'Timer' },
  { id: 'all-beginner', name: 'Graduate', description: 'Complete all beginner challenges', icon: 'GraduationCap' },
  { id: 'points-1000', name: 'Kilopoint', description: 'Earn 1000 OdisityPoints', icon: 'Trophy' },
  { id: 'half-complete', name: 'Halfway Hero', description: 'Complete half of all challenges', icon: 'Medal' },
]

function getDefaultProgress(): UserProgress {
  return {
    odisityPoints: 0,
    completedChallenges: [],
    challengeScores: {},
    streak: 0,
    badges: [],
    rank: 'Script Kiddie',
    avatar: 'shield',
    displayName: 'CyberAgent',
    joinedAt: new Date().toISOString(),
  }
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultProgress()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return getDefaultProgress()
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function calculateRank(points: number): string {
  let rank = RANKS[0].name
  for (const r of RANKS) {
    if (points >= r.minPoints) rank = r.name
  }
  return rank
}

function checkBadges(progress: UserProgress, result?: ChallengeResult, totalChallenges?: number): Badge[] {
  const newBadges: Badge[] = []
  const hasBadge = (id: string) => progress.badges.some(b => b.id === id)

  if (progress.completedChallenges.length >= 1 && !hasBadge('first-challenge')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'first-challenge')!, earnedAt: new Date().toISOString() })
  }
  if (result && result.score === result.maxScore && !hasBadge('perfect-score')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'perfect-score')!, earnedAt: new Date().toISOString() })
  }
  if (progress.streak >= 3 && !hasBadge('streak-3')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'streak-3')!, earnedAt: new Date().toISOString() })
  }
  if (progress.streak >= 7 && !hasBadge('streak-7')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'streak-7')!, earnedAt: new Date().toISOString() })
  }
  if (progress.completedChallenges.length >= 10 && !hasBadge('10-challenges')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === '10-challenges')!, earnedAt: new Date().toISOString() })
  }
  if (result && result.timeSpent < 30 && !hasBadge('speed-demon')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'speed-demon')!, earnedAt: new Date().toISOString() })
  }
  if (progress.odisityPoints >= 1000 && !hasBadge('points-1000')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'points-1000')!, earnedAt: new Date().toISOString() })
  }
  if (totalChallenges && progress.completedChallenges.length >= Math.floor(totalChallenges / 2) && !hasBadge('half-complete')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'half-complete')!, earnedAt: new Date().toISOString() })
  }

  return newBadges
}

export function submitChallengeResult(result: ChallengeResult, totalChallenges = 24): { progress: UserProgress; newBadges: Badge[] } {
  const progress = getProgress()

  const alreadyCompleted = progress.completedChallenges.includes(result.challengeId)

  if (!alreadyCompleted) {
    progress.completedChallenges.push(result.challengeId)
    progress.odisityPoints += result.pointsEarned
    progress.streak += 1
  }

  // Always update best score
  const prevScore = progress.challengeScores[result.challengeId] || 0
  if (result.score > prevScore) {
    progress.challengeScores[result.challengeId] = result.score
    if (alreadyCompleted) {
      // Award difference in points
      const pointDiff = result.pointsEarned - Math.floor(prevScore / result.maxScore * result.pointsEarned)
      if (pointDiff > 0) progress.odisityPoints += pointDiff
    }
  }

  progress.rank = calculateRank(progress.odisityPoints)
  const newBadges = checkBadges(progress, result, totalChallenges)
  progress.badges = [...progress.badges, ...newBadges]

  saveProgress(progress)
  return { progress, newBadges }
}

export function updateProfile(displayName: string, avatar: string): UserProgress {
  const progress = getProgress()
  progress.displayName = displayName
  progress.avatar = avatar
  saveProgress(progress)
  return progress
}

export function getLeaderboard(): LeaderboardEntry[] {
  // Mock leaderboard with some NPC entries + the real user
  const progress = getProgress()
  const npcs: LeaderboardEntry[] = [
    { rank: 0, displayName: 'CipherMaster', avatar: 'bot', odisityPoints: 4200, completedChallenges: 22, badges: 8 },
    { rank: 0, displayName: 'NetNinja', avatar: 'cpu', odisityPoints: 3800, completedChallenges: 20, badges: 7 },
    { rank: 0, displayName: 'BinaryBoss', avatar: 'lock', odisityPoints: 3100, completedChallenges: 18, badges: 6 },
    { rank: 0, displayName: 'PixelPhantom', avatar: 'ghost', odisityPoints: 2500, completedChallenges: 15, badges: 5 },
    { rank: 0, displayName: 'DataWraith', avatar: 'eye', odisityPoints: 1800, completedChallenges: 12, badges: 4 },
    { rank: 0, displayName: 'Zeroday_', avatar: 'skull', odisityPoints: 1200, completedChallenges: 9, badges: 3 },
    { rank: 0, displayName: 'FirewallFox', avatar: 'flame', odisityPoints: 800, completedChallenges: 6, badges: 2 },
    { rank: 0, displayName: 'NullPointer', avatar: 'bug', odisityPoints: 400, completedChallenges: 4, badges: 1 },
    { rank: 0, displayName: 'BitShifter', avatar: 'code', odisityPoints: 200, completedChallenges: 2, badges: 1 },
  ]

  const userEntry: LeaderboardEntry = {
    rank: 0,
    displayName: progress.displayName,
    avatar: progress.avatar,
    odisityPoints: progress.odisityPoints,
    completedChallenges: progress.completedChallenges.length,
    badges: progress.badges.length,
  }

  const all = [...npcs, userEntry].sort((a, b) => b.odisityPoints - a.odisityPoints)
  return all.map((entry, i) => ({ ...entry, rank: i + 1 }))
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function getAllBadgeDefinitions() {
  return BADGE_DEFINITIONS
}

export function getRanks() {
  return RANKS
}
