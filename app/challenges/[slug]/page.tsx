"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Fish,
  Wifi,
  Bug,
  Eye,
  Share2,
  Smartphone,
  Globe,
  ArrowLeft,
  Clock,
  Star,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategoryBySlug } from "@/lib/challenges";
import { getProgress } from "@/lib/game-store";
import type { UserProgress, ChallengeCategory, Difficulty } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lock,
  Fish,
  Wifi,
  Bug,
  Eye,
  Share2,
  Smartphone,
  Globe,
};

const difficultyColors: Record<
  Difficulty,
  { bg: string; text: string; label: string }
> = {
  beginner: {
    bg: "bg-cyber-green/10",
    text: "text-cyber-green",
    label: "Beginner",
  },
  intermediate: {
    bg: "bg-cyber-yellow/10",
    text: "text-cyber-yellow",
    label: "Intermediate",
  },
  advanced: {
    bg: "bg-cyber-pink/10",
    text: "text-cyber-pink",
    label: "Advanced",
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [category, setCategory] = useState<ChallengeCategory | undefined>(
    undefined,
  );

  useEffect(() => {
    setProgress(getProgress());
    setCategory(getCategoryBySlug(slug));
  }, [slug]);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Category Not Found
            </h1>
            <p className="mt-2 text-muted-foreground">
              The category you are looking for does not exist.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = iconMap[category.icon] || Lock;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl border shrink-0",
                category.color === "cyber-blue" &&
                  "bg-primary/10 border-primary/20 text-primary",
                category.color === "cyber-green" &&
                  "bg-cyber-green/10 border-cyber-green/20 text-cyber-green",
                category.color === "cyber-purple" &&
                  "bg-cyber-purple/10 border-cyber-purple/20 text-cyber-purple",
                category.color === "cyber-pink" &&
                  "bg-cyber-pink/10 border-cyber-pink/20 text-cyber-pink",
                category.color === "cyber-yellow" &&
                  "bg-cyber-yellow/10 border-cyber-yellow/20 text-cyber-yellow",
              )}
            >
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                {category.name}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {category.description}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {category.challenges.map((challenge) => {
              const diff = difficultyColors[challenge.difficulty];
              const isCompleted =
                progress?.completedChallenges.includes(challenge.id) ?? false;
              const score = progress?.challengeScores[challenge.id];

              return (
                <Link
                  key={challenge.id}
                  href={`/challenges/${slug}/${challenge.id}`}
                  className={cn(
                    "group flex flex-col rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5",
                    isCompleted ? "border-cyber-green/30" : "border-border",
                    `hover:${category.glowClass}`,
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-foreground">
                          {challenge.title}
                        </h3>
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-cyber-green shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-0.5" />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        diff.bg,
                        diff.text,
                      )}
                    >
                      {diff.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3" />
                      {challenge.points} pts
                    </span>
                    {challenge.timeLimit && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {challenge.timeLimit}s
                      </span>
                    )}
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground capitalize">
                      {challenge.type}
                    </span>
                    {score !== undefined && (
                      <span className="text-xs text-cyber-green font-medium">
                        Best: {score}%
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
