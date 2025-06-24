"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function CourseList({ courses, removeCourse, department }) {
  let count = 0;
  courses.forEach((course) => {
    if (course.department === department) {
      count++;
    }
  });
  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Course List</h5>
        <span className="badge bg-light text-dark">
          {count} Courses
        </span>
      </div>
      <div className="card-body p-0">
        {count === 0 ? (
          <div className="p-4 text-center text-muted">
            <i className="bi bi-journal-x" style={{ fontSize: "2rem" }}></i>
            <p className="mt-2">No courses added yet.</p>
          </div>
        ) : (
          <div
            className="list-group list-group-flush"
            style={{ maxHeight: "300px", overflow: "auto" }}
          >
            {courses.map((course, index) =>
              course.department === department ? (
                <div
                  key={index}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h6 className="mb-1">
                      {course.course_id}: {course.course_name}
                    </h6>
                    <small className="text-muted">
                      Credits: {course.number_cred} | Professor: {course.prof_name} |
                      Students: {course.number_stud}
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeCourse(index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ) : ""
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;
