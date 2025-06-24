import RoomCombination from "@/models/roomCombination";
import connectDB from "@/utils/connectDB";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

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
    const roomCombinations = await RoomCombination.find({ userId });
    return new Response(JSON.stringify(roomCombinations), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({
        msg: "Error fetching room combinations",
        success: false,
      }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return new Response(
        JSON.stringify({ msg: "User ID is required", success: false }),
        { status: 400 }
      );
    }
    const body = await request.json();
    const { name, capacity, day, period, isUsed, roomtype } = body;
    if (
      !name ||
      capacity === undefined ||
      !day ||
      period === undefined ||
      isUsed === undefined ||
      roomtype === undefined
    ) {
      return new Response(
        JSON.stringify({ msg: "All fields are required", success: false }),
        { status: 400 }
      );
    }
    const newRoomCombination = await RoomCombination.findOneAndUpdate(
      { userId, name, day, period },
      { $set: { capacity, isUsed, roomtype } },
      { upsert: true, new: true }
    );
    return new Response(JSON.stringify(newRoomCombination), { status: 201 });
  } catch (err) {
    return new Response(
      JSON.stringify({
        msg: "Error creating/updating room combination",
        success: false,
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return new Response(
        JSON.stringify({ msg: "User ID is required", success: false }),
        { status: 400 }
      );
    }
    const body = await request.json();
    const { name, day, period, isUsed } = body;
    if (!name || !day || period === undefined || isUsed === undefined) {
      return new Response(
        JSON.stringify({ msg: "All fields are required", success: false }),
        { status: 400 }
      );
    }
    const updated = await RoomCombination.findOneAndUpdate(
      { userId, name, day, period },
      { $set: { isUsed } },
      { new: true }
    );
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({
        msg: "Error updating room combination",
        success: false,
      }),
      { status: 500 }
    );
  }
}
