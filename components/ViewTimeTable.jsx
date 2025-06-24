"use client";
import { useState } from "react";
import TimetableView from "./TimetableView";
import FacultyTimeTable from "./FacultyTimeTable";
import Header from "./Header";
import RoomTimeTable from "./RoomTimeTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function ViewTimeTable({ TimeTablesDeps, initialRooms }) {
  const [viewType, setViewtype] = useState("");

  const renderTimetableView = () => {
    switch (viewType) {
      case "department":
        return <TimetableView TimeTablesDeps={TimeTablesDeps} />;
      case "faculty":
        return <FacultyTimeTable TimeTablesDeps={TimeTablesDeps} />;
      case "room":
        return (
          <RoomTimeTable
            TimeTablesDeps={TimeTablesDeps}
            initialRooms={initialRooms}
          />
        );
      default:
        return (
          <div className="d-flex flex-column align-items-center justify-content-center p-5 text-muted">
            <h5>No timetable selected</h5>
            <p>Please select a view type from the dropdown.</p>
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="d-flex">
        <div className="container my-5">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="fw-bold text-center">View Timetable</h1>
              <p className="text-center text-muted">
                Select faculty, room, or department to display the corresponding
                timetable.
              </p>
              <hr />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Select a View Type</h5>
                </div>
                <div className="card-body">
                  <select
                    id="viewSelect"
                    className="form-select"
                    value={viewType}
                    onChange={(e) => setViewtype(e.target.value)}
                  >
                    <option value="">Select View Type</option>
                    <option value="department">Department-wise</option>
                    <option value="faculty">Faculty-wise</option>
                    <option value="room">Room-wise</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-4" style={{ minHeight: "300px" }}>
            <div className="col-12">{renderTimetableView()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewTimeTable;
