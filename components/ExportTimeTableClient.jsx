"use client";
import Header from "./Header";
import "bootstrap/dist/css/bootstrap.min.css";
import ExportTimeTable from "./ExportTimeTable";
import { useEffect, useState } from "react";

export default function ExportTimeTableClient() {
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

  return (
    <>
      <Header />
      <div className="d-flex">
        <ExportTimeTable
          TimeTablesDeps={timeTablesDeps}
          initialRooms={initialRooms}
        />
      </div>
    </>
  );
}
