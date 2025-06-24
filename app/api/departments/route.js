import { NextResponse } from "next/server";
import Department from "@/models/Department";
import connectDB from "@/utils/connectDB";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserIdFromRequest(request) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET(request) {
  await connectDB();
  const userId = await getUserIdFromRequest(request);
  if (!userId)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const departments = await Department.find({ userId });
  return NextResponse.json(departments);
}

export async function POST(request) {
  await connectDB();
  const userId = await getUserIdFromRequest(request);
  if (!userId)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!(body && body.name)) {
    return NextResponse.json(
      { msg: "Department name is required" },
      { status: 400 }
    );
  }
  try {
    const result = await Department.create({
      ...body,
      userId,
    });
    return NextResponse.json({ msg: "Success", id: result._id });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Department should be unique" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { msg: "Error creating department" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectDB();
  const userId = await getUserIdFromRequest(request);
  if (!userId)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const { name } = await request.json();
  await Department.findOneAndDelete({ name, userId });
  return NextResponse.json({ status: "Success" });
}
