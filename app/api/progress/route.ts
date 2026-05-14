


import { connectDb } from "@/libs/db";
import User from "@/models/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  

  const { clerkId, challengeResult, newBadges, updatedRank } = req.body;
  if (!clerkId || !challengeResult) return res.status(400).json({ message: "Missing data" });

  try {
    await connectDb();

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyCompleted = user.completedChallenges.includes(challengeResult.challengeId);

    if (!alreadyCompleted) {
      user.completedChallenges.push(challengeResult.challengeId);
      user.odisityPoints += challengeResult.pointsEarned;
      user.streak += 1;
    }

    const prevScore = user.challengeScores.get(challengeResult.challengeId) || 0;
    if (challengeResult.score > prevScore) {
      user.challengeScores.set(challengeResult.challengeId, challengeResult.score);
      if (alreadyCompleted) {
        const pointDiff = challengeResult.pointsEarned - Math.floor((prevScore / challengeResult.maxScore) * challengeResult.pointsEarned);
        if (pointDiff > 0) user.odisityPoints += pointDiff;
      }
    }

    // Update rank and badges from frontend
    if (updatedRank) user.rank = updatedRank;
    if (newBadges?.length) {
      for (const badge of newBadges) {
        if (!user.badges.some(b => b.id === badge.id)) user.badges.push(badge);
      }
    }

    await user.save();

    res.status(200).json({ message: "Progress updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
