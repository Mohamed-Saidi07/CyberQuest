"use client"

import { useState, useCallback } from "react"
import { GripVertical, CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SimulationContent, ChallengeResult } from "@/lib/types"

interface Props {
  challengeId: string
  content: SimulationContent
  points: number
  onComplete: (result: ChallengeResult) => void
}

export function SimulationChallenge({ challengeId, content, points, onComplete }: Props) {
  const [order, setOrder] = useState(() =>
    [...content.elements].sort(() => Math.random() - 0.5)
  )
  const [checked, setChecked] = useState(false)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [startTime] = useState(Date.now())

  const handleDragStart = useCallback((index: number) => {
    setDraggedIdx(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index) return
    setOrder((prev) => {
      const newOrder = [...prev]
      const [dragged] = newOrder.splice(draggedIdx, 1)
      newOrder.splice(index, 0, dragged)
      return newOrder
    })
    setDraggedIdx(index)
  }, [draggedIdx])

  const handleDragEnd = useCallback(() => {
    setDraggedIdx(null)
  }, [])

  function moveItem(fromIdx: number, toIdx: number) {
    if (toIdx < 0 || toIdx >= order.length) return
    setOrder((prev) => {
      const newOrder = [...prev]
      const [item] = newOrder.splice(fromIdx, 1)
      newOrder.splice(toIdx, 0, item)
      return newOrder
    })
  }

  function handleCheck() {
    setChecked(true)
    const correctCount = order.filter((el, i) => el.id === content.correctOrder[i]).length
    const score = Math.round((correctCount / content.correctOrder.length) * 100)
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
    setOrder([...content.elements].sort(() => Math.random() - 0.5))
    setChecked(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Scenario */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-foreground leading-relaxed">{content.scenario}</p>
      </div>

      <p className="text-sm text-muted-foreground">
        Drag and drop the items into the correct order, or use the arrow buttons.
      </p>

      {/* Sortable list */}
      <div className="flex flex-col gap-2">
        {order.map((element, i) => {
          const isCorrectPosition = checked && element.id === content.correctOrder[i]
          const isWrongPosition = checked && element.id !== content.correctOrder[i]

          return (
            <div
              key={element.id}
              draggable={!checked}
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-all",
                !checked && "border-border bg-card cursor-grab hover:border-primary/50",
                isCorrectPosition && "border-cyber-green/50 bg-cyber-green/5",
                isWrongPosition && "border-destructive/50 bg-destructive/5",
                draggedIdx === i && "opacity-50",
              )}
            >
              <span className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isCorrectPosition && "bg-cyber-green/20 text-cyber-green",
                isWrongPosition && "bg-destructive/20 text-destructive",
                !checked && "bg-secondary text-muted-foreground"
              )}>
                {i + 1}
              </span>

              {!checked && <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />}

              {checked && isCorrectPosition && <CheckCircle2 className="h-4 w-4 text-cyber-green shrink-0" />}
              {checked && isWrongPosition && <XCircle className="h-4 w-4 text-destructive shrink-0" />}

              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{element.label}</p>
                <p className="text-xs text-muted-foreground">{element.description}</p>
              </div>

              {!checked && (
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveItem(i, i - 1)}
                    disabled={i === 0}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItem(i, i + 1)}
                    disabled={i === order.length - 1}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Correct order reveal */}
      {checked && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-foreground mb-2">Correct Order:</p>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
            {content.correctOrder.map((id, i) => {
              const el = content.elements.find(e => e.id === id)
              return <li key={id}>{el?.label}</li>
            })}
          </ol>
        </div>
      )}

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
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Check Order
          </Button>
        )}
      </div>
    </div>
  )
}
