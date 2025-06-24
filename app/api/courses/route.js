import { NextResponse } from "next/server";
import Course from "@/models/Course";
import connectDB from "@/utils/connectDB";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

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
  const userId = await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const courses = await Course.find({ userId });
  return NextResponse.json(courses);
}

export async function POST(request) {
  await connectDB();
  const userId = await getUserIdFromRequest();
  if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!(body && body.course_name && body.course_id && body.number_stud && body.number_cred)) {
    return NextResponse.json({ msg: "All fields are required" }, { status: 400 });
  }
  try {
    const result = await Course.create({
      ...body,
      userId,
    });
    return NextResponse.json({ msg: "Success", id: result._id });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Unique Fields" }, { status: 409 });
    }
    return NextResponse.json({ msg: "Error creating course" }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connectDB();
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const { course_id } = await request.json();
  await Course.findOneAndDelete({ course_id, userId });
  return NextResponse.json({ status: "Success" });
}
