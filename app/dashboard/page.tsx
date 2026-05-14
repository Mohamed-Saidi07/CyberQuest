"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Lock,
  Fish,
  Wifi,
  Bug,
  Eye,
  Share2,
  Smartphone,
  Globe,
  Trophy,
  Flame,
  Target,
  ChevronRight,
  Award,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/challenges";

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

// Type for the user fetched from DB
interface UserProfile {
  displayName: string;
  rank: string;
  odisityPoints: number;
  completedChallenges: string[];
  streak: number;
  badges: { id: string; name: string; description: string }[];
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProfile | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchUserProfile = async () => {
      try {
        const res = await axios.post("/api/get-profile", { clerkId: user.id });
        setProgress(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchUserProfile();
  }, [user, isLoaded]);

  if (!progress) return null;

  const totalChallenges = categories.reduce(
    (s, c) => s + c.challenges.length,
    0,
  );
  const completionPercent = Math.round(
    (progress.completedChallenges.length / totalChallenges) * 100,
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Welcome header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Welcome back,{" "}
                <span className="text-primary">{progress.displayName}</span>
              </h1>
              <p className="mt-1 text-muted-foreground">
                Rank:{" "}
                <span className="font-medium text-foreground">
                  {progress.rank}
                </span>
              </p>
            </div>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/profile">
                <Award className="mr-2 h-4 w-4" />
                View Profile
              </Link>
            </Button>
          </div>

          {/* Stats cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Target}
              label="OdisityPoints"
              value={progress.odisityPoints.toLocaleString()}
              color="text-primary"
              bgColor="bg-primary/10"
            />
            <StatCard
              icon={Trophy}
              label="Challenges Done"
              value={`${progress.completedChallenges.length}/${totalChallenges}`}
              color="text-cyber-green"
              bgColor="bg-cyber-green/10"
            />
            <StatCard
              icon={Flame}
              label="Current Streak"
              value={progress.streak.toString()}
              color="text-cyber-pink"
              bgColor="bg-cyber-pink/10"
            />
            <StatCard
              icon={Award}
              label="Badges Earned"
              value={`${progress.badges.length}/10`}
              color="text-cyber-purple"
              bgColor="bg-cyber-purple/10"
            />
          </div>

          {/* Overall progress */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Overall Progress
              </h2>
              <span className="text-sm font-mono text-primary">
                {completionPercent}%
              </span>
            </div>
            <Progress
              value={completionPercent}
              className="mt-3 h-2 bg-secondary [&>div]:bg-primary"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {progress.completedChallenges.length} of {totalChallenges}{" "}
              challenges completed
            </p>
          </div>

          {/* Category grid */}
          <h2 className="mt-10 text-xl font-bold text-foreground">
            Challenge Categories
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Lock;
              const completed = cat.challenges.filter((c) =>
                progress.completedChallenges.includes(c.id),
              ).length;
              const total = cat.challenges.length;
              const pct = Math.round((completed / total) * 100);

              return (
                <Link
                  key={cat.id}
                  href={`/challenges/${cat.slug}`}
                  className={cn(
                    "group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5",
                    `hover:${cat.glowClass}`,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg border",
                        cat.color === "cyber-blue" &&
                          "bg-primary/10 border-primary/20 text-primary",
                        cat.color === "cyber-green" &&
                          "bg-cyber-green/10 border-cyber-green/20 text-cyber-green",
                        cat.color === "cyber-purple" &&
                          "bg-cyber-purple/10 border-cyber-purple/20 text-cyber-purple",
                        cat.color === "cyber-pink" &&
                          "bg-cyber-pink/10 border-cyber-pink/20 text-cyber-pink",
                        cat.color === "cyber-yellow" &&
                          "bg-cyber-yellow/10 border-cyber-yellow/20 text-cyber-yellow",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {completed}/{total} completed
                  </p>
                  <Progress
                    value={pct}
                    className="mt-3 h-1.5 bg-secondary [&>div]:bg-primary"
                  />
                </Link>
              );
            })}
          </div>

          {/* Recent activity */}
          {progress.badges.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-foreground">
                Recent Badges
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {progress.badges.slice(-5).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2"
                  >
                    <Award className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {badge.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg",
          bgColor,
        )}
      >
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("text-xl font-bold", color)}>{value}</p>
      </div>
    </div>
  );
}
