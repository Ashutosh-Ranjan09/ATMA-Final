import Room from "@/models/Room";
import RoomCombination from "@/models/roomCombination";
import connectDB from "@/utils/connectDB";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserIdFromRequest() {
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

export async function GET() {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return new Response(
        JSON.stringify({ msg: "User ID is required", success: false }),
        { status: 400 }
      );
    }
    const rooms = await Room.find({ userId });
    return new Response(JSON.stringify(rooms), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ msg: "Error fetching rooms", success: false }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectDB();
  const userId = await getUserIdFromRequest();
  if (!userId)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { name, capacity, roomtype } = body;
  if (!name || !capacity || !roomtype) {
    return NextResponse.json(
      { msg: "All fields are required" },
      { status: 400 }
    );
  }
  try {
    const result = await Room.create({
      name,
      capacity,
      roomtype,
      userId,
    });
    const days = ["M", "T", "W", "TH", "F"];
    const roomCombinations = [];
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < 5; j++) {
        roomCombinations.push({
          name,
          capacity,
          day: days[i],
          period: j,
          isUsed: false,
          roomtype,
          userId,
        });
      }
    }
    await RoomCombination.insertMany(roomCombinations);
    return NextResponse.json({ msg: "Success", id: result._id });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Unique Fields" }, { status: 409 });
    }
    return NextResponse.json({ msg: "Error creating room" }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connectDB();
  const userId = await getUserIdFromRequest();
  if (!userId)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const { name } = await request.json();
  await Room.findOneAndDelete({ name, userId });
  await RoomCombination.deleteMany({ name, userId });
  return NextResponse.json({ status: "Success" });
}
