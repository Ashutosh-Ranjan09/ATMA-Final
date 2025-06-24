import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ msg: "All fields are required", success: false }, { status: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ msg: "User not found", success: false }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.hashpassword);
    if (!isMatch) {
      return NextResponse.json({ msg: "Invalid credentials", success: false }, { status: 401 });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    const response = NextResponse.json({ msg: "Login successful", success: true });
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
    );
    return response;
  } catch (err) {
    return NextResponse.json({ msg: "Login failed", success: false }, { status: 500 });
  }
}
