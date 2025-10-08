import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    return NextResponse.json({ token });
  } catch (err: unknown) {
    console.error("Signin error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
