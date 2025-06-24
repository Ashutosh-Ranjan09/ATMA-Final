import { NextResponse } from "next/server";
import TimeTable from "@/models/timetable";
import connectDB from "@/utils/connectDB";
import { main } from "@/utils/algo";
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

export async function POST(request) {
  await connectDB();
  const userId = await getUserIdFromRequest();
  if (!userId)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body || !body.department) {
    return NextResponse.json(
      { msg: "All fields are required" },
      { status: 400 }
    );
  }
  try {
    await TimeTable.findOneAndDelete({ department: body.department, userId });
    const timetableData = await main(body.department, userId);
    const result = await TimeTable.create({
      department: body.department,
      userId,
      TimeTableDep: timetableData,
    });
    return NextResponse.json({ msg: "Success", id: result.department });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Department TimeTable should be unique" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate timetable" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDB();
  const userId = await getUserIdFromRequest();
  if (!userId)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");
  if (department) {
    const timetable = await TimeTable.findOne({ department, userId });
    if (!timetable) {
      return NextResponse.json({ msg: "Not found" }, { status: 404 });
    }
    return NextResponse.json(timetable);
  } else {
    const timetables = await TimeTable.find({ userId });
    console.log("returning timetables without dept param ", timetables);
    return NextResponse.json(timetables);
  }
}

export async function PATCH(request) {
  await connectDB();
  const userId = await getUserIdFromRequest();
  if (!userId)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { department, period, day, update } = body;
  if (!department || period === undefined || !day) {
    return NextResponse.json(
      { msg: "Department, period, and day are required" },
      { status: 400 }
    );
  }
  const timetable = await TimeTable.findOne({ department, userId });
  if (!timetable) {
    return NextResponse.json({ msg: "Not found" }, { status: 404 });
  }
  const entryIndex = timetable.TimeTableDep.findIndex(
    (item) => item.period === period && item.day === day
  );
  if (entryIndex === -1) {
    if (update) {
      timetable.TimeTableDep.push({ ...update, period, day });
    }
  } else {
    if (update) {
      timetable.TimeTableDep[entryIndex] = {
        ...timetable.TimeTableDep[entryIndex],
        ...update,
      };
    } else {
      timetable.TimeTableDep.splice(entryIndex, 1);
    }
  }
  await timetable.save();
  return NextResponse.json({ msg: "Updated", timetable });
}

export async function DELETE(request) {
  await connectDB();
  const userId = await getUserIdFromRequest();
  if (!userId)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { department, period, day } = body;
  if (!department) {
    return NextResponse.json(
      { msg: "Department is required" },
      { status: 400 }
    );
  }
  if (period !== undefined && day) {
    const timetable = await TimeTable.findOne({ department, userId });
    if (!timetable) {
      return NextResponse.json({ msg: "Not found" }, { status: 404 });
    }
    timetable.TimeTableDep = timetable.TimeTableDep.filter(
      (item) => !(item.period === period && item.day === day)
    );
    await timetable.save();
    return NextResponse.json({ msg: "Cell cleared", timetable });
  } else {
    await TimeTable.findOneAndDelete({ department, userId });
    return NextResponse.json({ msg: "Timetable deleted" });
  }
}
