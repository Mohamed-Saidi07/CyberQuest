// app/api/checkAuth/route.ts
import { connectDb } from "@/libs/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { name, email, clerkId } = await req.json();

    if (!name || !email || !clerkId) {
      return NextResponse.json(
        { message: "Missing information" },
        { status: 400 }
      );
    }

    // Find or create user with clerkId
    const user = await User.findOneAndUpdate(
      { email },
      { displayName:name, email, clerkId },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { message: "User fetched/created successfully", data: user },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
