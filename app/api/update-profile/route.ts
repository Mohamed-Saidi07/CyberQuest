import { connectDb } from "@/libs/db";
import User from "@/models/user";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { clerkId, displayName, avatar } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ message: "Missing clerkId" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      {
        ...(displayName && { displayName }),
        ...(avatar && { avatar }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
