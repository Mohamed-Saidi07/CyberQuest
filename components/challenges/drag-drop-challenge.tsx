"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DragDropContent, ChallengeResult } from "@/lib/types"

interface Props {
  challengeId: string
  content: DragDropContent
  points: number
  onComplete: (result: ChallengeResult) => void
}

export function DragDropChallenge({ challengeId, content, points, onComplete }: Props) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [startTime] = useState(Date.now())

  function toggleAssignment(itemId: string, category: string) {
    if (checked) return
    setAssignments((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === category ? '' : category,
    }))
  }

  function handleCheck() {
    setChecked(true)
    const correctCount = content.items.filter(
      (item) => assignments[item.id] === item.category
    ).length
    const score = Math.round((correctCount / content.items.length) * 100)
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    onComplete({
      challengeId,
      score,
      maxScore: 100,
      timeSpent,
      passed: score >= 60,
      pointsEarned: Math.round((score / 100) * points),
    })
  }

  function handleReset() {
    setAssignments({})
    setChecked(false)
  }

  const allAssigned = content.items.every((item) => assignments[item.id])

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">{content.instruction}</p>

      {/* Category headers */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${content.categories.length}, 1fr)` }}>
        {content.categories.map((cat) => (
          <div key={cat} className="rounded-lg border border-border bg-secondary/50 p-3 text-center">
            <h3 className="text-sm font-semibold text-foreground">{cat}</h3>
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {content.items.map((item) => {
          const assigned = assignments[item.id]
          const isCorrect = checked && assigned === item.category
          const isWrong = checked && assigned && assigned !== item.category

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 transition-all",
                !checked && "border-border bg-card",
                isCorrect && "border-cyber-green/50 bg-cyber-green/5",
                isWrong && "border-destructive/50 bg-destructive/5"
              )}
            >
              <div className="flex items-center gap-2 flex-1">
                {checked && isCorrect && <CheckCircle2 className="h-4 w-4 text-cyber-green shrink-0" />}
                {checked && isWrong && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                <span className="text-sm text-foreground">{item.label}</span>
                {checked && isWrong && (
                  <span className="text-xs text-muted-foreground ml-auto mr-2">
                    (Correct: {item.category})
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {content.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleAssignment(item.id, cat)}
                    disabled={checked}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-medium border transition-all",
                      assigned === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-border text-foreground"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        {!checked && (
          <Button
            onClick={handleCheck}
            disabled={!allAssigned}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Check Answers
          </Button>
        )}
      </div>
    </div>
  )
}
