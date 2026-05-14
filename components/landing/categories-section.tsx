"use client"

import Link from "next/link"
import { Lock, Fish, Wifi, Bug, Eye, Share2, Smartphone, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/challenges"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lock, Fish, Wifi, Bug, Eye, Share2, Smartphone, Globe,
}

export function CategoriesSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight lg:text-4xl text-foreground">
            8 Challenge Categories
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            From beginner to advanced, each category builds real-world security skills.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Lock
            return (
              <Link
                key={cat.id}
                href={`/challenges/${cat.slug}`}
                className={cn(
                  "group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1",
                  cat.glowClass.replace("glow-", "hover:glow-")
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg border",
                  cat.color === 'cyber-blue' && "bg-primary/10 border-primary/20 text-primary",
                  cat.color === 'cyber-green' && "bg-cyber-green/10 border-cyber-green/20 text-cyber-green",
                  cat.color === 'cyber-purple' && "bg-cyber-purple/10 border-cyber-purple/20 text-cyber-purple",
                  cat.color === 'cyber-pink' && "bg-cyber-pink/10 border-cyber-pink/20 text-cyber-pink",
                  cat.color === 'cyber-yellow' && "bg-cyber-yellow/10 border-cyber-yellow/20 text-cyber-yellow",
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{cat.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed flex-1">{cat.description}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-2 py-0.5">{cat.challenges.length} challenges</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5">
                    {cat.challenges.reduce((s, c) => s + c.points, 0)} pts
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
