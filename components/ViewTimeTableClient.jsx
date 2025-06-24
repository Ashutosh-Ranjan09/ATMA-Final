"use client";
import { useEffect, useState } from "react";
import ViewTimeTable from "./ViewTimeTable";

export default function ViewTimeTableClient() {
  const [timeTablesDeps, setTimeTablesDeps] = useState([]);
  const [initialRooms, setInitialRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ttRes, roomsRes] = await Promise.all([
          fetch("/api/timetables", { cache: "no-store" }),
          fetch("/api/rooms", { cache: "no-store" }),
        ]);
        setTimeTablesDeps(ttRes.ok ? await ttRes.json() : []);
        setInitialRooms(roomsRes.ok ? await roomsRes.json() : []);
      } catch {
        setTimeTablesDeps([]);
        setInitialRooms([]);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <ViewTimeTable TimeTablesDeps={timeTablesDeps} initialRooms={initialRooms} />;
}
