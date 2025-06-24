"use client";
import Header from "./Header";
import EditTimetable from "./EditTimetable";
import { useEffect, useState } from "react";

export default function EditTimetableClient() {
  const [timeTablesDeps, setTimeTablesDeps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const res = await fetch("/api/timetables", { cache: "no-store" });
        if (res.ok) {
          setTimeTablesDeps(await res.json());
        } else {
          setTimeTablesDeps([]);
        }
      } catch (error) {
        setTimeTablesDeps([]);
      }
      setLoading(false);
    };
    fetchTimetables();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="d-flex">
        <EditTimetable timeTablesDeps={timeTablesDeps} />
      </div>
    </>
  );
}
