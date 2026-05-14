"use client"

import { BookOpen, Target, Trophy, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: BookOpen,
    title: "Choose a Category",
    description: "Pick from 8 cybersecurity topics, from Password Security to Safe Browsing.",
  },
  {
    icon: Target,
    title: "Complete Challenges",
    description: "Work through interactive scenarios, quizzes, simulations, and hands-on exercises.",
  },
  {
    icon: TrendingUp,
    title: "Earn OdisityPoints",
    description: "Score points based on accuracy and speed. Watch your rank climb from Script Kiddie to Cyber Legend.",
  },
  {
    icon: Trophy,
    title: "Unlock Badges",
    description: "Earn achievement badges for milestones, streaks, and mastery of categories.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight lg:text-4xl text-foreground">
            How It Works
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Your journey from beginner to cybersecurity expert in four simple steps.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                {/* Step number */}
                <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
