"use client";
import { useState, useEffect } from "react";
import { User, MapPin } from "lucide-react";

export default function TimetableView({ userId }) {
  const periodToTime = {
    0: "08:00",
    1: "09:00",
    2: "10:00",
    3: "11:00",
    4: "12:00",
    5: "13:00",
    6: "14:00",
    7: "15:00",
    8: "16:00",
    9: "17:00",
  };

  const normalizeDay = (day) => {
    const map = {
      M: "Monday",
      Mon: "Monday",
      T: "Tuesday",
      Tue: "Tuesday",
      W: "Wednesday",
      Wed: "Wednesday",
      TH: "Thursday",
      Thu: "Thursday",
      F: "Friday",
      Fri: "Friday",
      S: "Saturday",
      Sat: "Saturday",
    };
    return map[day] || day;
  };

  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [timetableData, setTimetableData] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`/api/departments?userId=${userId}`);
        const data = await response.json();
        const departmentNames = data.map((obj) => obj.name);
        setDepartments(departmentNames);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, [userId]);

  const fetchTimetable = async (department) => {
    try {
      const response = await fetch(
        `/api/timetables?userId=${userId}&department=${department}`
      );
      const data = await response.json();
      const timetableArray = Array.isArray(data.TimeTableDep)
        ? data.TimeTableDep
        : [];
      const formattedData = {
        entries: timetableArray.map((obj) => ({
          course: { id: obj.courseId, name: obj.courseName },
          instructor: obj.instructor,
          classroom: obj.roomName,
          startTime: periodToTime[obj.period],
          day: obj.day,
        })),
      };
      setTimetableData(organizeTimetableData(formattedData));
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setTimetableData(null);
    }
  };

  const organizeTimetableData = (data) => {
    const timetableData = {};
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
    const weekDays = [
      { day: "Monday", shortName: "Mon" },
      { day: "Tuesday", shortName: "Tue" },
      { day: "Wednesday", shortName: "Wed" },
      { day: "Thursday", shortName: "Thu" },
      { day: "Friday", shortName: "Fri" },
      { day: "Saturday", shortName: "Sat" },
    ];

    weekDays.forEach(({ day }) => {
      timetableData[day] = {};
      timeSlots.forEach(({ time }) => {
        timetableData[day][time] = null;
      });
    });

    data.entries.forEach((entry) => {
      const day = normalizeDay(entry.day);
      if (
        timetableData[day] &&
        timetableData[day][entry.startTime] !== undefined
      ) {
        timetableData[day][entry.startTime] = {
          course: entry.course,
          instructor: entry.instructor,
          classroom: entry.classroom,
          color: getRandomColor(Math.floor(Math.random() * 100)),
        };
      }
    });

    return timetableData;
  };

  const getRandomColor = (id) => {
    const colors = ["primary", "secondary", "success", "danger", "warning"];
    return colors[id % colors.length];
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setDepartmentId(department);
    fetchTimetable(department);
  };

  return (
    <div className="h-100 d-flex flex-column flex-grow-1">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0 fw-bold">Department Timetable</h5>
        <div className="d-flex align-items-center">
          <select
            className="form-select form-select-sm me-2"
            value={departmentId}
            onChange={handleDepartmentChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive h-100 overflow-auto">
        {departmentId !== "" && timetableData && timetableData["Monday"] ? (
          <table className="table table-bordered timetable-table">
            <thead className="table-light sticky-top" style={{ zIndex: -1 }}>
              <tr>
                <th className="text-center" style={{ minWidth: "80px" }}>
                  Time
                </th>
                {Object.keys(timetableData).map((day) => (
                  <th key={day} className="text-center">
                    <span className="d-none d-md-inline">{day}</span>
                    <span className="d-md-none">{day.substring(0, 3)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(timetableData["Monday"]).map((time) => (
                <tr key={time}>
                  <td className="text-center align-middle bg-light fw-medium">
                    {time}
                  </td>
                  {Object.keys(timetableData).map((day) => {
                    const cellData = timetableData[day][time];
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
            <p>Please select a department from the dropdown list.</p>
          </div>
        )}
      </div>
    </div>
  );
}
