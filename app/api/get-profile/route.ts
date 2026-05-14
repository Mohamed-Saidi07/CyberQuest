import { connectDb } from "@/libs/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { clerkId } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ message: "Missing clerkId" }, { status: 400 });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
