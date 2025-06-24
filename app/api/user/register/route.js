import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";

export async function POST(req) {
  try {
    await connectDB();
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json({ msg: "All fields are required", success: false }, { status: 400 });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ msg: "Email already registered", success: false }, { status: 409 });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, hashpassword });
    return NextResponse.json({ msg: "Registration successful", success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ msg: "Registration failed", success: false }, { status: 500 });
  }
}
