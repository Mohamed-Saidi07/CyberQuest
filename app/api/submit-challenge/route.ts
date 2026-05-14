import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connectDb } from "@/libs/db";
import { RANKS } from "@/lib/game-store";


// 🔥 Get Rank From Points
function getRankFromPoints(points: number) {
  let currentRank = RANKS[0].name;

  for (const rank of RANKS) {
    if (points >= rank.minPoints) {
      currentRank = rank.name;
    }
  }

  return currentRank;
}

function generateBadge(badgeNumber: number) {
  return {
    id: `badge-${badgeNumber}`,
    name: `Century ${badgeNumber}`,
    description: `Earned ${badgeNumber * 100} Odisity Points`,
    icon: "medal",
    earnedAt: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId, challengeResult } = body;

    if (!clerkId || !challengeResult) {
      return NextResponse.json(
        { error: "Missing clerkId or challengeResult" },
        { status: 400 }
      );
    }

    await connectDb();

    // 🔍 Find user
    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const {
      challengeId,
      points,
    } = challengeResult;

    if (!challengeId || typeof points !== "number") {
      return NextResponse.json(
        { error: "Invalid challenge data" },
        { status: 400 }
      );
    }

    // =============================
    // 🎯 HANDLE COMPLETED CHALLENGE
    // =============================

    if (!user.completedChallenges.includes(challengeId)) {
      user.completedChallenges.push(challengeId);
    }

    // =============================
    // 🧠 HANDLE SCORE UPDATE (ANTI FARM)
    // =============================

    const prevPoints =
      user.challengeScores.get(challengeId) || 0;

    let pointsToAdd = 0;

    if (points > prevPoints) {
      pointsToAdd = points - prevPoints;

      user.challengeScores.set(challengeId, points);
    }

    user.odisityPoints += pointsToAdd;

     const totalBadgesShouldHave = Math.floor(
      user.odisityPoints / 100
    );

    const currentBadgeCount = user.badges.length;

    const newBadges = [];

    if (totalBadgesShouldHave > currentBadgeCount) {
      for (
        let i = currentBadgeCount + 1;
        i <= totalBadgesShouldHave;
        i++
      ) {
        const badge = generateBadge(i);
        user.badges.push(badge);
        newBadges.push(badge);
      }
    }

    // =============================
    // 🏆 UPDATE RANK
    // =============================

    const previousRank = user.rank;
    const newRank = getRankFromPoints(user.odisityPoints);

    user.rank = newRank;

    const leveledUp = previousRank !== newRank;

    // =============================
    // 🔥 OPTIONAL: STREAK UPDATE
    // =============================

    user.streak += 1;

    await user.save();

    return NextResponse.json({
      message: "Challenge result updated successfully",
      odisityPoints: user.odisityPoints,
      rank: user.rank,
      leveledUp,
      streak: user.streak,
      pointsAdded: pointsToAdd,
    });

  } catch (error) {
    console.error("Error updating challenge:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
