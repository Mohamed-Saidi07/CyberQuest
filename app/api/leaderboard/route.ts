import { NextResponse } from "next/server";
import { connectDb } from "@/libs/db";
import User from "@/models/user";

export async function GET() {
  try {
    await connectDb();

    // Fetch all users sorted by odisityPoints descending
    const users = await User.find({}).sort({ odisityPoints: -1 }).lean();

    // Map users to leaderboard entries with rank
    const leaderboard = users.map((user, idx) => ({
      rank: idx + 1,
      displayName: user.displayName,
      odisityPoints: user.odisityPoints || 0,
      completedChallenges: user.completedChallenges || 0,
      clerkId: user.clerkId,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
