"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function ClassroomList({ classrooms, removeClassroom, department }) {
  const availableClassrooms = [];
  classrooms.forEach((classroom) => {
    if (classroom.roomtype === department || classroom.roomtype === "Central") {
      availableClassrooms.push(classroom);
    }
  });
  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Classroom List</h5>
        <span className="badge bg-light text-dark">
          {availableClassrooms.length} Classrooms
        </span>
      </div>
      <div className="card-body p-0">
        {availableClassrooms.length === 0 ? (
          <div className="p-4 text-center text-muted">
            <i className="bi bi-building" style={{ fontSize: "2rem" }}></i>
            <p className="mt-2">No classrooms added yet.</p>
          </div>
        ) : (
          <div
            className="list-group list-group-flush"
            style={{ maxHeight: "475px", overflow: "auto" }}
          >
            {availableClassrooms.map((classroom, index) => (
              <div
                key={index}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{classroom.name}</h6>
                  <small className="text-muted">
                    Capacity: {classroom.capacity} students | Room type: {classroom.roomtype === "Central" ? "Central" : "Department"}
                  </small>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeClassroom(index)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassroomList;
