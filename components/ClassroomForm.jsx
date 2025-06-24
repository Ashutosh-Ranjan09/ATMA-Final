"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function ClassroomForm({ addClassroom, department }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(90);
  const [roomtype, setRoomtype] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNaN(capacity)) {
      console.log("Invalid input\n");
      return;
    }
    const classroom = {
      name: name,
      capacity: Number(capacity),
      roomtype: roomtype
    };
    axios
      .post("/api/rooms", classroom)
      .then((res) => console.log("Success\n", res.data))
      .catch((err) => console.log(err));
    addClassroom(classroom);
    setName("");
    setCapacity(90);
    setRoomtype("")
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Add New Classroom</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="classroomName" className="form-label">
              Classroom Name/Code
            </label>
            <input
              type="text"
              className="form-control"
              id="classroomName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Room 101"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="capacity" className="form-label">
              Capacity
            </label>
            <input
              type="number"
              className="form-control"
              id="capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="capacity" className="form-label">
              Room Type
            </label>
            <select value={roomtype} onChange={(e) => setRoomtype(e.target.value)} className="form-control" required>
              <option value="" disabled>
                Select an option
              </option>
              <option value="Central">Central</option>
              <option value={department}>Department</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add Classroom
          </button>
        </form>
      </div>
    </div>
  );
}

export default ClassroomForm;
