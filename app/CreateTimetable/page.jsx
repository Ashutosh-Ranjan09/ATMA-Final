import CreateTimetablePage from "../../components/CreateTimeTableClient";
import { cookies } from "next/headers";

async function getInitialClassrooms() {
  const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
 const cookieStore = await cookies();
const token = cookieStore.get("token")?.value || "";
const res = await fetch(`${baseUrl}/api/rooms`, {
  headers: {
    Cookie: `token=${token}`,
  },
});
  if (!res.ok) {
    throw new Error("Failed to fetch classrooms");
  }
  return res.json();
}

async function getInitialCourses() {
  const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
  const cookieStore = await cookies();
const token = cookieStore.get("token")?.value || "";
const res = await fetch(`${baseUrl}/api/courses`, {
  headers: {
    Cookie: `token=${token}`,
  },
});
  if (!res.ok) {
    throw new Error("Failed to fetch Courses");
  }
  return res.json();
}

export default async function CreatePage() {
  const initialClassrooms = await getInitialClassrooms();
  const initialCourses = await getInitialCourses();
  return (
    <CreateTimetablePage
      initialClassrooms={initialClassrooms}
      initialCourses={initialCourses}
    />
  );
}
