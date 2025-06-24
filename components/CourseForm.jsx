"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function CourseForm({ addCourse, department }) {
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState(3);
  const [professor, setProfessor] = useState("");
  const [students, setStudents] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNaN(credits) || isNaN(students)) {
      console.log("Invalid input\n");
      return;
    }
    const course = {
      course_name: courseName,
      course_id: courseId,
      number_stud: Number(students),
      number_cred: Number(credits),
      prof_name: professor,
      department: department,
    };
    axios
      .post("/api/courses", course)
      .then((res) => console.log("Success\n", res.data))
      .catch((err) => console.log(err));
    addCourse(course);
    setCourseId("");
    setCourseName("");
    setCredits(3);
    setProfessor("");
    setStudents(30);
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Add New Course</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="courseId" className="form-label">
              Course ID
            </label>
            <input
              type="text"
              className="form-control"
              id="courseId"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="e.g. CS101"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="courseName" className="form-label">
              Course Name
            </label>
            <input
              type="text"
              className="form-control"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. Introduction to Computer Science"
              required
            />
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="credits" className="form-label">
                Credits
              </label>
              <input
                type="number"
                className="form-control"
                id="credits"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                min="1"
                max="6"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="students" className="form-label">
                Number of Students
              </label>
              <input
                type="number"
                className="form-control"
                id="students"
                value={students}
                onChange={(e) => setStudents(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="professor" className="form-label">
              Professor
            </label>
            <input
              type="text"
              className="form-control"
              id="professor"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="e.g. Dr. Smith"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
