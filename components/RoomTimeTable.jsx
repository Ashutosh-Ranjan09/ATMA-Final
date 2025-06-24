"use client";
import { useState } from "react";
import { User, MapPin } from "lucide-react";

const days = {
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  TH: "Thursday",
  F: "Friday",
};
const dayLabels = Object.values(days);

const timeSlots = [
  { time: "08:00", label: "8:00 AM" },
  { time: "09:00", label: "9:00 AM" },
  { time: "10:00", label: "10:00 AM" },
  { time: "11:00", label: "11:00 AM" },
  { time: "12:00", label: "12:00 PM" },
  { time: "13:00", label: "1:00 PM" },
  { time: "14:00", label: "2:00 PM" },
  { time: "15:00", label: "3:00 PM" },
  { time: "16:00", label: "4:00 PM" },
  { time: "17:00", label: "5:00 PM" },
];

function normalizeDay(day) {
  const map = {
    ...days,
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
  };
  return map[day] || day;
}

const getRandomColor = (id) => {
  const colors = ["primary", "secondary", "success", "danger", "warning"];
  return colors[id % colors.length];
};

export default function RoomTimeTable({ TimeTablesDeps, initialRooms }) {
  const [selectedRoom, setSelectedRoom] = useState("");
  const [entries, setEntries] = useState([]);

  const handleRoomChange = (e) => {
    const room = e.target.value;
    setSelectedRoom(room);
    let darray = [];
    for (let j = 0; j < TimeTablesDeps.length; j++) {
      for (let i = 0; i < (TimeTablesDeps[j].TimeTableDep || []).length; i++) {
        let entry = TimeTablesDeps[j].TimeTableDep[i];
        if (entry.roomName === room) {
          darray.push(entry);
        }
      }
    }
    setEntries(darray);
  };

  const timetableGrid = {};
  dayLabels.forEach((day) => {
    timetableGrid[day] = {};
    timeSlots.forEach((slot) => {
      timetableGrid[day][slot.time] = null;
    });
  });

  entries.forEach((obj, idx) => {
    const day = normalizeDay(obj.day);
    const time = timeSlots[obj.period]?.time;
    if (timetableGrid[day] && time) {
      timetableGrid[day][time] = {
        course: { id: obj.courseId, name: obj.courseName },
        instructor: obj.instructor,
        classroom: obj.roomName,
        color: getRandomColor(idx),
      };
    }
  });

  return (
    <div className="h-100 d-flex flex-column flex-grow-1">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0 fw-bold">Room Timetable</h5>
        <div className="d-flex align-items-center">
          <select
            className="form-select form-select-sm me-2"
            value={selectedRoom}
            onChange={handleRoomChange}
          >
            <option value="">Select Room</option>
            {initialRooms.map((room, idx) => (
              <option key={idx} value={room.name}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-responsive h-100 overflow-auto">
        {selectedRoom && timetableGrid["Monday"] ? (
          <table className="table table-bordered timetable-table">
            <thead className="table-light sticky-top" style={{ zIndex: -1 }}>
              <tr>
                <th className="text-center" style={{ minWidth: "80px" }}>
                  Time
                </th>
                {dayLabels.map((day) => (
                  <th key={day} className="text-center">
                    <span className="d-none d-md-inline">{day}</span>
                    <span className="d-md-none">{day.substring(0, 3)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot.time}>
                  <td className="text-center align-middle bg-light fw-medium">
                    {slot.time}
                  </td>
                  {dayLabels.map((day) => {
                    const cellData = timetableGrid[day][slot.time];
                    return (
                      <td
                        key={day}
                        className={`position-relative ${
                          cellData ? `bg-${cellData.color} bg-opacity-10` : ""
                        }`}
                        style={{ height: "100px", minWidth: "150px" }}
                      >
                        {cellData && (
                          <div className="p-2 h-100">
                            <div
                              className={`mb-1 fw-bold text-${cellData.color}`}
                            >
                              {cellData.course.name}
                            </div>
                            <div className="d-flex align-items-center mb-1 small">
                              <User size={12} className="me-1 text-muted" />
                              <span>{cellData.instructor}</span>
                            </div>
                            <div className="d-flex align-items-center small">
                              <MapPin size={12} className="me-1 text-muted" />
                              <span>{cellData.classroom}</span>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center p-5 text-muted">
            <h5>No timetable available</h5>
            <p>Please select a room from the dropdown list.</p>
          </div>
        )}
      </div>
    </div>
  );
}
