"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, ChevronRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { InteractiveContent, ChallengeResult } from "@/lib/types"

interface Props {
  challengeId: string
  content: InteractiveContent
  points: number
  onComplete: (result: ChallengeResult) => void
}

export function InteractiveChallenge({ challengeId, content, points, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const [startTime] = useState(Date.now())

  const step = content.steps[currentStep]
  const total = content.steps.length

  function handleSelect(index: number) {
    if (revealed) return
    setSelected(index)
    setRevealed(true)
    if (step.options[index].correct) {
      setCorrect((c) => c + 1)
    }
  }

  function handleNext() {
    if (currentStep + 1 < total) {
      setCurrentStep(currentStep + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setFinished(true)
      const score = Math.round((correct / total) * 100)
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
  }

  if (finished) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Scenario */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground leading-relaxed">{content.scenario}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Scenario {currentStep + 1} of {total}
        </span>
        <span className="text-sm text-muted-foreground">
          {correct} correct so far
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((currentStep + 1) / total) * 100}%` }}
        />
      </div>

      {/* Prompt */}
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-base font-medium text-foreground leading-relaxed">{step.prompt}</p>

        <div className="mt-6 flex flex-col gap-3">
          {step.options.map((option, i) => {
            const isSelected = i === selected
            const isCorrectOption = option.correct
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 text-left text-sm transition-all",
                  !revealed && "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
                  revealed && isCorrectOption && "border-cyber-green bg-cyber-green/5",
                  revealed && isSelected && !isCorrectOption && "border-destructive bg-destructive/5",
                  revealed && !isCorrectOption && !isSelected && "border-border bg-card opacity-50"
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {revealed && isCorrectOption ? <CheckCircle2 className="h-5 w-5 text-cyber-green" /> :
                   revealed && isSelected && !isCorrectOption ? <XCircle className="h-5 w-5 text-destructive" /> :
                   <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">
                     {String.fromCharCode(65 + i)}
                   </span>
                  }
                </span>
                <div>
                  <span className="text-foreground">{option.label}</span>
                  {revealed && (
                    <p className={cn(
                      "mt-2 text-xs leading-relaxed",
                      isCorrectOption ? "text-cyber-green" : "text-muted-foreground"
                    )}>
                      {option.feedback}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Next button */}
      {revealed && (
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {currentStep + 1 < total ? (
              <>Next Scenario <ChevronRight className="ml-1 h-4 w-4" /></>
            ) : (
              "See Results"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
