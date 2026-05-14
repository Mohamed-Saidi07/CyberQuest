export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Challenge {
  id: string
  categoryId: string
  title: string
  description: string
  difficulty: Difficulty
  points: number
  type: 'quiz' | 'interactive' | 'simulation' | 'drag-drop' | 'code' | 'matching'
  timeLimit?: number // seconds
  content: QuizContent | InteractiveContent | SimulationContent | DragDropContent | MatchingContent
}

export interface QuizContent {
  kind: 'quiz'
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface InteractiveContent {
  kind: 'interactive'
  scenario: string
  steps: InteractiveStep[]
}

export interface InteractiveStep {
  id: string
  prompt: string
  options: { label: string; correct: boolean; feedback: string }[]
}

export interface SimulationContent {
  kind: 'simulation'
  scenario: string
  elements: SimulationElement[]
  correctOrder: string[]
}

export interface SimulationElement {
  id: string
  label: string
  description: string
}

export interface DragDropContent {
  kind: 'drag-drop'
  instruction: string
  items: { id: string; label: string; category: string }[]
  categories: string[]
}

export interface MatchingContent {
  kind: 'matching'
  instruction: string
  pairs: { id: string; term: string; definition: string }[]
}

export interface ChallengeCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  glowClass: string
  challenges: Challenge[]
}

export interface UserProgress {
  odisityPoints: number
  completedChallenges: string[]
  challengeScores: Record<string, number>
  streak: number
  badges: Badge[]
  rank: string
  avatar: string
  displayName: string
  joinedAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

export interface LeaderboardEntry {
  rank: number
  displayName: string
  avatar: string
  odisityPoints: number
  completedChallenges: number
  badges: number
}

export type ChallengeResult = {
  challengeId: string
  score: number
  maxScore: number
  timeSpent: number
  passed: boolean
  pointsEarned: number
}
