import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { hash } from "bcryptjs";
import User from "@/lib/models/user.models";

export async function POST(req: Request) {
  try {
    // Destructure the required fields from the request body
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing name, email, or password" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the new user, including the name
    const user = await User.create({
      // Add name field
      email,
      password: hashedPassword,
    });

    // Return success response (excluding password)
    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name, // Include the name in the response
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
