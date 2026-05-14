"use client"

import { useState, useMemo } from "react"
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MatchingContent, ChallengeResult } from "@/lib/types"

interface Props {
  challengeId: string
  content: MatchingContent
  points: number
  onComplete: (result: ChallengeResult) => void
}

export function MatchingChallenge({ challengeId, content, points, onComplete }: Props) {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [startTime] = useState(Date.now())

  const shuffledDefs = useMemo(
    () => [...content.pairs].sort(() => Math.random() - 0.5),
    [content.pairs]
  )

  function handleTermClick(termId: string) {
    if (checked) return
    setSelectedTerm(selectedTerm === termId ? null : termId)
  }

  function handleDefClick(defId: string) {
    if (checked || !selectedTerm) return
    // Check if this def is already matched to something else
    const existingMatch = Object.entries(matches).find(([, v]) => v === defId)
    const newMatches = { ...matches }
    if (existingMatch) {
      delete newMatches[existingMatch[0]]
    }
    // Remove previous match for this term
    delete newMatches[selectedTerm]
    newMatches[selectedTerm] = defId
    setMatches(newMatches)
    setSelectedTerm(null)
  }

  function handleCheck() {
    setChecked(true)
    const correctCount = content.pairs.filter(
      (pair) => matches[pair.id] === pair.id
    ).length
    const score = Math.round((correctCount / content.pairs.length) * 100)
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
    setMatches({})
    setSelectedTerm(null)
    setChecked(false)
  }

  const allMatched = content.pairs.every((pair) => matches[pair.id])

  // Color assignments for matched pairs
  const matchColors = ['text-primary', 'text-cyber-green', 'text-cyber-purple', 'text-cyber-pink', 'text-cyber-yellow']

  function getMatchColor(termId: string): string {
    const matchedTerms = Object.keys(matches)
    const idx = matchedTerms.indexOf(termId)
    return idx >= 0 ? matchColors[idx % matchColors.length] : ''
  }

  function getDefMatchColor(defId: string): string {
    const entry = Object.entries(matches).find(([, v]) => v === defId)
    if (!entry) return ''
    return getMatchColor(entry[0])
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">{content.instruction}</p>

      <p className="text-xs text-muted-foreground">
        Click a term on the left, then click its matching definition on the right.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Terms */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Terms</h3>
          {content.pairs.map((pair) => {
            const isSelected = selectedTerm === pair.id
            const isMatched = !!matches[pair.id]
            const isCorrect = checked && matches[pair.id] === pair.id
            const isWrong = checked && matches[pair.id] && matches[pair.id] !== pair.id

            return (
              <button
                key={pair.id}
                onClick={() => handleTermClick(pair.id)}
                disabled={checked}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all",
                  isSelected && "border-primary bg-primary/10",
                  !isSelected && !isMatched && "border-border bg-card hover:border-primary/50",
                  isMatched && !checked && cn("border-border bg-card", getMatchColor(pair.id)),
                  isCorrect && "border-cyber-green/50 bg-cyber-green/5",
                  isWrong && "border-destructive/50 bg-destructive/5",
                )}
              >
                {checked && isCorrect && <CheckCircle2 className="h-4 w-4 text-cyber-green shrink-0" />}
                {checked && isWrong && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                <span className={cn(
                  isMatched && !checked && getMatchColor(pair.id),
                  (!isMatched || checked) && "text-foreground"
                )}>
                  {pair.term}
                </span>
              </button>
            )
          })}
        </div>

        {/* Definitions */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Definitions</h3>
          {shuffledDefs.map((pair) => {
            const isMatchedTo = Object.entries(matches).find(([, v]) => v === pair.id)
            const isCorrect = checked && isMatchedTo && isMatchedTo[0] === pair.id
            const isWrong = checked && isMatchedTo && isMatchedTo[0] !== pair.id

            return (
              <button
                key={pair.id}
                onClick={() => handleDefClick(pair.id)}
                disabled={checked || !selectedTerm}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all",
                  !isMatchedTo && !checked && "border-border bg-card",
                  !isMatchedTo && selectedTerm && !checked && "hover:border-primary/50 hover:bg-primary/5",
                  isMatchedTo && !checked && cn("border-border bg-card", getDefMatchColor(pair.id)),
                  isCorrect && "border-cyber-green/50 bg-cyber-green/5",
                  isWrong && "border-destructive/50 bg-destructive/5",
                )}
              >
                {checked && isCorrect && <CheckCircle2 className="h-4 w-4 text-cyber-green shrink-0" />}
                {checked && isWrong && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                <span className={cn(
                  isMatchedTo && !checked && getDefMatchColor(pair.id),
                  (!isMatchedTo || checked) && "text-foreground"
                )}>
                  {pair.definition}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Correct answers reveal */}
      {checked && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-foreground mb-2">Correct Matches:</p>
          <div className="space-y-1">
            {content.pairs.map((pair) => (
              <p key={pair.id} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{pair.term}</span> = {pair.definition}
              </p>
            ))}
          </div>
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
            disabled={!allMatched}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Check Matches
          </Button>
        )}
      </div>
    </div>
  )
}
