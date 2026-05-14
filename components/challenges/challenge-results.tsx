"use client"

import Link from "next/link"
import { Trophy, Star, Clock, Award, ChevronRight, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ChallengeResult, Badge } from "@/lib/types"

interface Props {
  result: ChallengeResult
  newBadges: Badge[]
  categorySlug: string
}

export function ChallengeResults({ result, newBadges, categorySlug }: Props) {
  const grade =
    result.score >= 90 ? { label: "Excellent", color: "text-cyber-green" } :
    result.score >= 70 ? { label: "Good", color: "text-primary" } :
    result.score >= 60 ? { label: "Passed", color: "text-cyber-yellow" } :
    { label: "Try Again", color: "text-destructive" }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Score circle */}
      <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-primary/20">
        <div className={cn(
          "absolute inset-0 rounded-full",
          result.passed ? "glow-blue" : ""
        )} />
        <div className="text-center">
          <span className={cn("text-4xl font-bold", grade.color)}>{result.score}%</span>
          <p className={cn("text-sm font-medium", grade.color)}>{grade.label}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <Trophy className="mx-auto h-5 w-5 text-cyber-yellow" />
          <p className="mt-1 text-lg font-bold text-foreground">{result.pointsEarned}</p>
          <p className="text-xs text-muted-foreground">Points Earned</p>
        </div>
        <div>
          <Star className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-1 text-lg font-bold text-foreground">{result.score}/{result.maxScore}</p>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
        <div>
          <Clock className="mx-auto h-5 w-5 text-cyber-purple" />
          <p className="mt-1 text-lg font-bold text-foreground">{result.timeSpent}s</p>
          <p className="text-xs text-muted-foreground">Time Spent</p>
        </div>
      </div>

      {/* New badges */}
      {newBadges.length > 0 && (
        <div className="w-full rounded-xl border border-primary/20 bg-primary/5 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Award className="h-4 w-4" />
            New Badges Unlocked!
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {newBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 rounded-lg bg-card border border-border p-3">
                <Award className="h-5 w-5 text-cyber-yellow" />
                <div>
                  <p className="text-sm font-medium text-foreground">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          variant="outline"
          className="border-border text-foreground"
        >
          <Link href={`/challenges/${categorySlug}`}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-border text-foreground"
        >
          <Link href={`/challenges/${categorySlug}`}>
            More Challenges
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
