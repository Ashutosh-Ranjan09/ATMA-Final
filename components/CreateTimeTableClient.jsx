"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Header from "./Header";
import CourseForm from "./CourseForm";
import CourseList from "./CourseList";
import ClassroomForm from "./ClassroomForm";
import ClassroomList from "./ClassroomList";

const DepartmentSelector = ({ department, setDepartment }) => {
  const [newDept, setNewDept] = useState("");
  const [departments, setDepartments] = useState([
    "Computer Science",
    "Mechanical Engg",
  ]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        let res = await axios.get("/api/departments");
        res = res.data;
        const arr = res.map((obj) => obj.name);
        setDepartments(arr);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleDepartmentChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "add_new") {
      setIsAddingNew(true);
      setDepartment("");
    } else {
      setIsAddingNew(false);
      setDepartment(selectedValue);
    }
  };

  const handleAddNewDepartment = async () => {
    if (newDept.trim() && !departments.includes(newDept)) {
      await axios.post("/api/departments", { name: newDept });
      setDepartments([...departments, newDept]);
      setDepartment(newDept);
    }
    setIsAddingNew(false);
    setNewDept("");
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Select Department</h5>
          </div>
          <div className="card-body">
            <select
              id="departmentSelect"
              className="form-select"
              value={isAddingNew ? "add_new" : department}
              onChange={handleDepartmentChange}
            >
              <option value="" disabled>
                Select a department
              </option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
              <option value="add_new">➕ Add New Department</option>
            </select>
            {isAddingNew && (
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter new department name"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleAddNewDepartment}
                >
                  ✅ Add Department
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function CreateTimetablePage({ initialClassrooms, initialCourses }) {
  const [courses, setCourses] = useState(initialCourses);
  const [department, setDepartment] = useState("");
  const [classrooms, setClassrooms] = useState(initialClassrooms);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const addCourse = (course) => {
    if (!department) {
      alert("Please select a department before adding a course.");
      return;
    }
    let exist = false;
    exist = courses.some(
      (c) =>
        c.course_id === course.course_id || c.course_name === course.course_name
    );
    if (!exist) setCourses([...courses, { ...course, department }]);
    else {
      console.log("Already exists");
    }
  };
  const removeCourse = (index) => {
    const del_name = courses[index].course_id;
    axios
      .delete(`/api/courses`, { data: { course_id: del_name } })
      .then((response) => {
        setCourses(courses.filter((course) => course.course_id !== del_name));
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });
  };
  const addClassroom = (classroom) => {
    if (!department) {
      alert("Please select a department before adding a classroom.");
      return;
    }
    let exist = false;
    exist = classrooms.some((c) => c.name === classroom.name);
    if (!exist) setClassrooms([...classrooms, { ...classroom, department }]);
    else {
      console.log("Already exists");
    }
  };
  const removeClassroom = (index) => {
    const del_name = classrooms[index].name;
    axios
      .delete(`/api/rooms`, { data: { name: del_name } })
      .then((response) => {
        setClassrooms(
          classrooms.filter((classroom) => classroom.name !== del_name)
        );
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });
  };
  const handleGenerateClick = () => {
    if (!department) {
      alert("Please select a department before generating a timetable.");
      return false;
    }
    if (courses.length === 0 || classrooms.length === 0) {
      alert(
        "Please add at least one course and one classroom before generating a timetable."
      );
      return false;
    }
    setShowConfirmation(true);
    return true;
  };
  const handleConfirmGenerate = async () => {
    try {
      await axios.post("/api/timetables", {
        department: department,
      });
      router.push("/Dashboard");
      setShowConfirmation(false);
    } catch (err) {
      console.log("Error: ", err);
    }
  };
  let count = 0;
  courses.forEach((course) => {
    if (course.department === department) {
      count++;
    }
  });
  const availableClassrooms = [];
  classrooms.forEach((classroom) => {
    if (classroom.roomtype === department || classroom.roomtype === "Central") {
      availableClassrooms.push(classroom);
    }
  });
  return (
    <>
      <Header />
      <div className="d-flex">
        <div className="container my-5">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="fw-bold text-center">Create Timetable</h1>
              <p className="text-center text-muted">
                Add courses, classrooms, and set constraints to generate a
                timetable
              </p>
              <hr />
            </div>
          </div>
          <DepartmentSelector
            department={department}
            setDepartment={setDepartment}
          />
          <div className="row">
            <div className="col-lg-6">
              <CourseForm addCourse={addCourse} department={department} />
              <CourseList
                courses={courses}
                removeCourse={removeCourse}
                department={department}
              />
            </div>
            <div className="col-lg-6">
              <ClassroomForm
                addClassroom={addClassroom}
                department={department}
              />
              <ClassroomList
                classrooms={classrooms}
                removeClassroom={removeClassroom}
                department={department}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 text-center">
              <button
                className="btn btn-success btn-lg px-5"
                onClick={handleGenerateClick}
                disabled={
                  !department || courses.length === 0 || classrooms.length === 0
                }
              >
                <i className="bi bi-calendar-check me-2"></i>
                Generate Timetable
              </button>
            </div>
          </div>
          <Modal
            show={showConfirmation}
            onHide={() => setShowConfirmation(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Timetable Generation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>You are about to generate a timetable with:</p>
              <ul>
                <li>
                  <strong>Department:</strong> {department}
                </li>
                <li>
                  <strong>Courses:</strong> {count}
                </li>
                <li>
                  <strong>Classrooms:</strong> {availableClassrooms.length}
                </li>
              </ul>
              <p>Do you want to proceed?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmGenerate}>
                Generate
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default CreateTimetablePage;
