"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, ChevronRight, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

const typingTexts = [
  "Password Security",
  "Phishing Detection",
  "Network Safety",
  "Malware Defense",
  "Data Privacy",
  "Safe Browsing",
]

export function HeroSection() {
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = typingTexts[textIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % typingTexts.length)
        }
      }
    }, isDeleting ? 40 : 80)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex])

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid-bg" />
      <div className="absolute inset-0 cyber-scanline pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Interactive Cybersecurity Training</span>
          </div>

          {/* Title */}
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            <span className="text-foreground">Master</span>{" "}
            <span className="text-primary text-glow-blue">Cybersecurity</span>
            <br />
            <span className="text-foreground">Through Play</span>
          </h1>

          {/* Typing effect */}
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-mono text-sm">
            <Terminal className="h-4 w-4 text-cyber-green" />
            <span className="text-muted-foreground">{">"} Learning:</span>
            <span className="text-cyber-green">
              {typingTexts[textIndex].substring(0, charIndex)}
            </span>
            <span className="animate-pulse text-primary">|</span>
          </div>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
            CyberQuest transforms cybersecurity education into an engaging
            adventure. Complete challenges, earn OdisityPoints, climb the
            leaderboard, and build real-world security skills.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="glow-blue bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              <Link href="/dashboard">
                Start Your Quest
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary">
              <Link href="/leaderboard">
                View Leaderboard
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { label: "Challenges", value: "24" },
              { label: "Categories", value: "8" },
              { label: "Difficulty Levels", value: "3" },
              { label: "Badges to Earn", value: "10" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl font-bold text-primary lg:text-3xl">{stat.value}</span>
                <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
