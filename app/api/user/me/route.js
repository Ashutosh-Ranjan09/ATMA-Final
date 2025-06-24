import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
    });
  } catch (err) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }
}
