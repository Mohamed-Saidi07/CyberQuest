"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser, useClerk } from "@clerk/nextjs";

import {
  Shield,
  Lock,
  Skull,
  Cpu,
  Eye,
  Flame,
  Bug,
  Code,
  Ghost,
  User,
  Award,
  Trophy,
  Star,
  Calendar,
  Edit3,
  Check,
  X,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getAllBadgeDefinitions, getRanks } from "@/lib/game-store";
import { categories } from "@/lib/challenges";
import type { UserProgress } from "@/lib/types";

const avatarOptions = [
  { id: "shield", icon: Shield, label: "Shield" },
  { id: "lock", icon: Lock, label: "Lock" },
  { id: "skull", icon: Skull, label: "Skull" },
  { id: "cpu", icon: Cpu, label: "CPU" },
  { id: "eye", icon: Eye, label: "Eye" },
  { id: "flame", icon: Flame, label: "Flame" },
  { id: "bug", icon: Bug, label: "Bug" },
  { id: "code", icon: Code, label: "Code" },
  { id: "ghost", icon: Ghost, label: "Ghost" },
  { id: "user", icon: User, label: "User" },
];

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  /* ---------------- FETCH USER PROFILE ---------------- */
  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoaded || !user) return;

      try {
        const res = await axios.post("/api/get-profile", {
          clerkId: user.id,
        });

        setProgress(res.data);
        setNameInput(res.data.displayName);
        setSelectedAvatar(res.data.avatar);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [user, isLoaded]);

  if (!progress || !isLoaded) return null;

  const allBadges = getAllBadgeDefinitions();
  const ranks = getRanks();

  const totalChallenges = categories.reduce(
    (s, c) => s + c.challenges.length,
    0,
  );
  const completionPct = Math.round(
    (progress.completedChallenges.length / totalChallenges) * 100,
  );

  const currentRankIdx = ranks.findIndex((r) => r.name === progress.rank);
  const nextRank = ranks[currentRankIdx + 1];

  // const rankProgress = nextRank
  //   ? Math.round(
  //       ((progress.odisityPoints - ranks[currentRankIdx].minPoints) /
  //         (nextRank.minPoints - ranks[currentRankIdx].minPoints)) *
  //         100,
  //     )
  //   : 100;
  const rankProgress = nextRank
    ? Math.min(
        100,
        Math.max(
          0,
          ((progress.odisityPoints - ranks[currentRankIdx].minPoints) /
            (nextRank.minPoints - ranks[currentRankIdx].minPoints)) *
            100,
        ),
      )
    : 100;

  /* ---------------- SAVE PROFILE ---------------- */
  async function handleSave() {
    if (!nameInput.trim() || !user) return;

    try {
      const res = await axios.post("/api/update-profile", {
        clerkId: user.id,
        displayName: nameInput.trim(),
        avatar: selectedAvatar,
      });

      setProgress(res.data);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCancel() {
    setNameInput(progress.displayName);
    setSelectedAvatar(progress.avatar);
    setEditing(false);
  }

  const AvatarIcon =
    avatarOptions.find((a) => a.id === progress.avatar)?.icon || Shield;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          {/* PROFILE HEADER */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start justify-between">
              <div className="flex flex-1 gap-4 items-center sm:items-start">
                {/* Avatar */}
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                  <AvatarIcon className="h-10 w-10 text-primary" />
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  {editing ? (
                    <div className="flex flex-col gap-3">
                      <Input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="max-w-xs"
                        placeholder="Display name"
                      />

                      {/* Avatar picker */}
                      <div className="flex flex-wrap gap-2">
                        {avatarOptions.map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setSelectedAvatar(opt.id)}
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg border",
                                selectedAvatar === opt.id
                                  ? "border-primary bg-primary/10"
                                  : "border-border",
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>
                          <Check className="mr-1 h-4 w-4" /> Save
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="mr-1 h-4 w-4" /> Cancel
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => signOut()}
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <h1 className="text-2xl font-bold">
                          {progress.displayName}
                        </h1>

                        <button onClick={() => setEditing(true)}>
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-1 text-primary font-medium">
                        {progress.rank}
                      </p>

                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Joined{" "}
                        {new Date(progress.joinedAt).toLocaleDateString()}
                      </p>

                      {/* Logout Button */}
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => signOut()}
                        >
                          Logout
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* POINTS */}
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {progress.odisityPoints.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Odisity Points</p>
              </div>
            </div>

            {/* Rank Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-xs">
                <span>{progress.rank}</span>
                <span>{nextRank ? nextRank.name : "Max Rank"}</span>
              </div>

              <Progress value={rankProgress} className="mt-2" />

              {nextRank && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {Math.max(0, nextRank.minPoints - progress.odisityPoints)} pts
                  until {nextRank.name}
                </p>
              )}
            </div>
          </div>

          {/* STATS */}
          <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-4">
            <StatBox
              icon={Trophy}
              label="Challenges"
              value={`${progress.completedChallenges.length}/${totalChallenges}`}
            />
            <StatBox
              icon={Star}
              label="Completion"
              value={`${completionPct}%`}
            />
            <StatBox icon={Flame} label="Streak" value={`${progress.streak}`} />
            <StatBox
              icon={Award}
              label="Badges"
              value={`${progress.badges.length}/${allBadges.length}`}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ---------------- STAT BOX ---------------- */

function StatBox({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <Icon className="mx-auto h-5 w-5 text-primary" />
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
