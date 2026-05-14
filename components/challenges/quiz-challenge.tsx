"use client"

import { useState, useEffect, useCallback } from "react"
import { CheckCircle2, XCircle, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuizContent, ChallengeResult } from "@/lib/types"

interface Props {
  challengeId: string
  content: QuizContent
  points: number
  timeLimit?: number
  onComplete: (result: ChallengeResult) => void
}

export function QuizChallenge({ challengeId, content, points, timeLimit, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const [startTime] = useState(Date.now())
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0)

  const question = content.questions[currentQ]
  const total = content.questions.length

  useEffect(() => {
    if (!timeLimit || finished) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleFinish(correct)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimit, finished])

  const handleFinish = useCallback((finalCorrect: number) => {
    setFinished(true)
    const score = Math.round((finalCorrect / total) * 100)
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    onComplete({
      challengeId,
      score,
      maxScore: 100,
      timeSpent,
      passed: score >= 60,
      pointsEarned: Math.round((score / 100) * points),
    })
  }, [challengeId, points, startTime, total, onComplete])

  function handleSelect(index: number) {
    if (revealed) return
    setSelected(index)
  }

  function handleConfirm() {
    if (selected === null) return
    setRevealed(true)
    if (selected === question.correctIndex) {
      setCorrect((c) => c + 1)
    }
  }

  function handleNext() {
    if (currentQ + 1 < total) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      const finalCorrect = selected === question.correctIndex ? correct : correct
      handleFinish(finalCorrect)
    }
  }

  if (finished) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentQ + 1} of {total}
        </span>
        {timeLimit ? (
          <span className={cn(
            "flex items-center gap-1 text-sm font-mono",
            timeLeft < 30 ? "text-destructive" : "text-muted-foreground"
          )}>
            <Clock className="h-4 w-4" />
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
        ) : null}
      </div>

      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((currentQ + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground leading-relaxed">{question.question}</h3>

        <div className="mt-6 flex flex-col gap-3">
          {question.options.map((option, i) => {
            const isCorrect = i === question.correctIndex
            const isSelected = i === selected
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all",
                  !revealed && isSelected && "border-primary bg-primary/5",
                  !revealed && !isSelected && "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
                  revealed && isCorrect && "border-cyber-green bg-cyber-green/5",
                  revealed && isSelected && !isCorrect && "border-destructive bg-destructive/5",
                  revealed && !isCorrect && !isSelected && "border-border bg-card opacity-50"
                )}
              >
                <span className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  revealed && isCorrect && "border-cyber-green text-cyber-green bg-cyber-green/10",
                  revealed && isSelected && !isCorrect && "border-destructive text-destructive bg-destructive/10",
                  !revealed && isSelected && "border-primary text-primary bg-primary/10",
                  !revealed && !isSelected && "border-border text-muted-foreground",
                )}>
                  {revealed && isCorrect ? <CheckCircle2 className="h-4 w-4" /> :
                   revealed && isSelected && !isCorrect ? <XCircle className="h-4 w-4" /> :
                   String.fromCharCode(65 + i)}
                </span>
                <span className="text-foreground">{option}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <div className={cn(
            "mt-4 rounded-lg border p-4",
            selected === question.correctIndex
              ? "border-cyber-green/30 bg-cyber-green/5"
              : "border-destructive/30 bg-destructive/5"
          )}>
            <p className="text-sm text-muted-foreground">
              <span className={cn(
                "font-semibold",
                selected === question.correctIndex ? "text-cyber-green" : "text-destructive"
              )}>
                {selected === question.correctIndex ? "Correct!" : "Incorrect."}
              </span>{" "}
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        {!revealed ? (
          <Button
            onClick={handleConfirm}
            disabled={selected === null}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirm Answer
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {currentQ + 1 < total ? (
              <>Next Question <ChevronRight className="ml-1 h-4 w-4" /></>
            ) : (
              "See Results"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
