import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/lib/models/user.models";

export async function POST(req: Request) {
  try {
    // Parse request body
    const { email, password } = await req.json();

    // Connect to the database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string, 
      { expiresIn: "7d" }
    );

    // Return the token and user info (excluding password)
    return NextResponse.json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
