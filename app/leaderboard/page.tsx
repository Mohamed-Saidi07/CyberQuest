"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Trophy, Medal, Crown, Shield } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

// Podium setup
const podiumIcons = [Crown, Trophy, Medal];
const podiumColors = [
  "text-cyber-yellow border-cyber-yellow/30 bg-cyber-yellow/5",
  "text-primary border-primary/30 bg-primary/5",
  "text-cyber-pink border-cyber-pink/30 bg-cyber-pink/5",
];
const podiumGlow = ["glow-blue", "", ""];

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  odisityPoints: number;
  completedChallenges: number;
  clerkId: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [progress, setProgress] = useState<LeaderboardEntry | null>(null);

  const { user, isLoaded } = useUser();

  // Fetch leaderboard from API
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("/api/leaderboard");
        const leaderboard: LeaderboardEntry[] = res.data.leaderboard;
        setEntries(leaderboard);

        // Find current user
        const me = leaderboard.find((e) => e.clerkId === user.id);
        setProgress(me || null);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, [user, isLoaded]);
  console.log(entries);

  const userRank =
    entries.find((e) => e.displayName === progress?.displayName)?.rank || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            <p className="mt-2 text-muted-foreground">
              Top cyber defenders ranked by OdisityPoints
            </p>
          </div>

          {/* Your rank */}
          {userRank > 0 && (
            <div className="mt-6 flex items-center justify-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <Shield className="h-6 w-6 text-primary" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-2xl font-bold text-primary">#{userRank}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold text-foreground">
                  {progress?.odisityPoints.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Top 3 podium */}
          {/* <div className="mt-8 flex items-end justify-center gap-4">
            {[1, 0, 2].map((podiumIdx) => {
              // Map positions: 1 = second place (left), 0 = first place (middle), 2 = third place (right)
              const entry = entries[podiumIdx] || {
                displayName: "-",
                odisityPoints: 0,
                clerkId: "",
              };
              const Icon = podiumIcons[podiumIdx];
              const isUser = entry.clerkId === progress?.clerkId;

              // Correct heights: middle (winner) tallest, left (2nd) medium, right (3rd) shortest
              const heights = ["h-32", "h-40", "h-24"];
              // But now we reorder according to position
              const positionHeights =
                podiumIdx === 0 ? "h-40" : podiumIdx === 1 ? "h-32" : "h-24";

              return (
                <div
                  key={podiumIdx}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2",
                      podiumColors[podiumIdx],
                      isUser &&
                        "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isUser ? "text-primary" : "text-foreground",
                    )}
                  >
                    {entry.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.odisityPoints.toLocaleString()} pts
                  </p>
                  <div
                    className={cn(
                      "flex w-20 items-end justify-center rounded-t-lg border border-b-0",
                      podiumColors[podiumIdx],
                      positionHeights,
                      podiumGlow[podiumIdx],
                    )}
                  >
                    <span className="pb-2 text-lg font-bold">
                      #{podiumIdx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div> */}

          {/* Top podium */}
          {entries.length > 0 && (
            <div className="mt-8 flex items-end justify-center gap-4">
              {(() => {
                const topPlayers = entries.slice(0, 3);

                // Layout depending on number of players
                let order: number[] = [];

                if (topPlayers.length === 1) {
                  order = [0];
                } else if (topPlayers.length === 2) {
                  order = [1, 0]; // second left, first right
                } else {
                  order = [1, 0, 2]; // normal 3-podium layout
                }

                return order.map((podiumIdx) => {
                  const entry = topPlayers[podiumIdx];
                  if (!entry) return null;

                  const Icon = podiumIcons[podiumIdx];
                  const isUser = entry.clerkId === progress?.clerkId;

                  const positionHeights =
                    podiumIdx === 0
                      ? "h-40"
                      : podiumIdx === 1
                        ? "h-32"
                        : "h-24";

                  return (
                    <div
                      key={podiumIdx}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full border-2",
                          podiumColors[podiumIdx],
                          isUser &&
                            "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <p
                        className={cn(
                          "text-sm font-semibold",
                          isUser ? "text-primary" : "text-foreground",
                        )}
                      >
                        {entry.displayName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {entry.odisityPoints.toLocaleString()} pts
                      </p>

                      <div
                        className={cn(
                          "flex w-20 items-end justify-center rounded-t-lg border border-b-0",
                          podiumColors[podiumIdx],
                          positionHeights,
                          podiumGlow[podiumIdx],
                        )}
                      >
                        <span className="pb-2 text-lg font-bold">
                          #{podiumIdx + 1}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Full leaderboard list */}
          <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-border bg-secondary/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Rank</span>
              <span>Player</span>
              <span className="text-right">Points</span>
              {/* <span className="text-right">Done</span> */}
            </div>
            {entries.map((entry) => {
              const isUser = entry.clerkId === progress?.clerkId;
              return (
                <div
                  key={entry.rank}
                  className={cn(
                    "grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-4 py-3 border-b border-border/50 last:border-b-0 transition-colors",
                    isUser && "bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                      entry.rank <= 3
                        ? podiumColors[entry.rank - 1]
                        : "text-muted-foreground",
                    )}
                  >
                    {entry.rank <= 3
                      ? (() => {
                          const I = podiumIcons[entry.rank - 1];
                          return <I className="h-4 w-4" />;
                        })()
                      : entry.rank}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        isUser ? "text-primary" : "text-foreground",
                      )}
                    >
                      {entry.displayName}
                      {isUser && (
                        <span className="ml-1 text-xs text-primary">(You)</span>
                      )}
                    </span>
                  </div>
                  <span className="text-right text-sm font-mono font-semibold text-foreground">
                    {entry.odisityPoints.toLocaleString()}
                  </span>
                  {/* <span className="text-right text-sm text-muted-foreground">
                    {entry.completedChallenges}
                  </span> */}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
