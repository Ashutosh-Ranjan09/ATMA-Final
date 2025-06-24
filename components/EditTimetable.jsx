"use client";
import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const days = {
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  TH: "Thursday",
  F: "Friday",
};
const dayKeys = Object.keys(days);
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

const createEmptyTimetable = () =>
  timeSlots.map((timeSlot) => {
    const rowData = { timeSlot: timeSlot.label };
    dayKeys.forEach((dayKey) => {
      rowData[dayKey] = {
        courseId: "",
        subject: "",
        room: "",
        instructor: "",
      };
    });
    return rowData;
  });

const EditTimetable = ({ timeTablesDeps }) => {
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [timetableData, setTimetableData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [mockBackendData, setMockBackendData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editFormData, setEditFormData] = useState({
    courseId: "",
    subject: "",
    room: "",
    instructor: "",
  });
  const [showClearModal, setShowClearModal] = useState(false);
  const clearBlock = useRef([]);
  const addBlock = useRef([]);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        const arr = (await res.json()).map((obj) => obj.name);
        setDepartments(arr);
      } catch (error) {
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (timeTablesDeps && timeTablesDeps.length > 0) {
      let processedData = [];
      timeTablesDeps.forEach((depData) => {
        if (depData.TimeTableDep && depData.TimeTableDep.length > 0) {
          const departmentClasses = depData.TimeTableDep.map((classItem) => ({
            course: { id: classItem.courseId, name: classItem.courseName },
            instructor: classItem.instructor,
            classroom: classItem.roomName,
            startTime: timeSlots[classItem.period]?.time,
            day: days[classItem.day] || classItem.day,
            department: depData.department,
            period: classItem.period,
            dayKey: classItem.day,
          }));
          processedData = [...processedData, ...departmentClasses];
        }
      });
      setMockBackendData(processedData);
    }
  }, [timeTablesDeps]);

  const populateTimetableFromArray = (classesArray) => {
    const newTimetable = createEmptyTimetable();
    if (!classesArray || classesArray.length === 0) return newTimetable;
    classesArray.forEach((classItem) => {
      const timeIndex = timeSlots.findIndex(
        (slot) => slot.time === classItem.startTime
      );
      const dayKey = Object.keys(days).find(
        (key) => days[key] === classItem.day
      );
      if (timeIndex !== -1 && dayKey) {
        newTimetable[timeIndex][dayKey] = {
          courseId: classItem.course.id,
          subject: classItem.course.name,
          instructor: classItem.instructor,
          room: classItem.classroom,
        };
      }
    });
    return newTimetable;
  };

  useEffect(() => {
    if (department === "") {
      setTimetableData(createEmptyTimetable());
      return;
    }
    const filteredData = mockBackendData.filter(
      (item) => item.department === department
    );
    const initialTimetable = populateTimetableFromArray(filteredData);
    setTimetableData(initialTimetable);
  }, [department, mockBackendData]);

  const handleDepartmentChange = (e) => setDepartment(e.target.value);

  const upsertRoomCombination = async ({ name, day, period }) => {
    await fetch("/api/roomCombinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        capacity: 0,
        day,
        period,
        isUsed: true,
        roomtype: "",
      }),
    });
  };

  const markRoomCombinationUnused = async ({ name, day, period }) => {
    await fetch("/api/roomCombinations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        day,
        period,
        isUsed: false,
      }),
    });
  };

  const handleCellChange = (
    timeIndex,
    day,
    courseId,
    subject,
    instructor,
    rN
  ) => {
    const updatedTimetable = [...timetableData];
    addBlock.current.push({
      courseId,
      courseName: subject,
      department,
      roomName: rN,
      day,
      period: timeIndex,
      instructor,
    });
    updatedTimetable[timeIndex][day] = {
      courseId,
      subject,
      room: rN,
      instructor,
    };
    setTimetableData(updatedTimetable);
  };

  const clearCell = (timeIndex, day) => {
    clearBlock.current.push({
      ind: timeIndex,
      dy: day,
      rN: timetableData[timeIndex][day].room,
    });
    const updatedTimetable = [...timetableData];
    updatedTimetable[timeIndex][day] = {
      courseId: "",
      subject: "",
      room: "",
      instructor: "",
    };
    setTimetableData(updatedTimetable);
  };

  const clearAllCells = () => {
    setShowClearModal(true);
  };

  const handleConfirmClear = () => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (timetableData[i][dayKeys[j]].courseId !== "") {
          clearCell(i, dayKeys[j]);
        }
      }
    }
    setShowClearModal(false);
  };

  const handleCancelClear = () => {
    setShowClearModal(false);
  };

  const patchCell = async (department, period, day, update) => {
    await fetch("/api/timetables", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department, period, day, update }),
    });
  };

  const deleteCellOrTimetable = async (department, period, day) => {
    await fetch("/api/timetables", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department, period, day }),
    });
  };

  const saveTimetable = async () => {
    if (!department) {
      alert("Please select a department first.");
      return;
    }
    setIsSaving(true);
    for (const cell of addBlock.current) {
      await patchCell(department, cell.period, cell.day, {
        courseId: cell.courseId,
        courseName: cell.courseName,
        roomName: cell.roomName,
        instructor: cell.instructor,
        day: cell.day,
        period: cell.period,
      });
      await upsertRoomCombination({
        name: cell.roomName,
        day: cell.day,
        period: cell.period,
      });
    }
    for (const cell of clearBlock.current) {
      await deleteCellOrTimetable(department, cell.ind, cell.dy);
      await markRoomCombinationUnused({
        name: cell.rN,
        day: cell.dy,
        period: cell.ind,
      });
    }
    alert("Timetable saved successfully!");
    setIsSaving(false);
    clearBlock.current = [];
    addBlock.current = [];
  };

  const CellEditor = ({ data, timeIndex, day }) => {
    const hasContent = data.subject || data.room || data.instructor;
    return (
      <div className={`border p-2 h-100 ${hasContent ? "bg-light" : ""}`}>
        {hasContent ? (
          <>
            <div className="d-flex justify-content-between mb-1">
              <strong className="text-primary">{data.subject}</strong>
              <button
                className="btn btn-sm btn-outline-danger py-0 px-1"
                onClick={() => clearCell(timeIndex, day)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            {data.courseId && (
              <div className="small">
                <i className="bi bi-hash me-1"></i>
                {data.courseId}
              </div>
            )}
            <div className="small">
              <i className="bi bi-person me-1"></i>
              {data.instructor || "No instructor"}
            </div>
            <div className="small text-muted">
              <i className="bi bi-building me-1"></i>
              {data.room || "No room"}
            </div>
          </>
        ) : (
          <button
            className="btn btn-sm btn-outline-primary w-100 h-100"
            data-bs-toggle="modal"
            data-bs-target="#editClassModal"
            onClick={() => {
              setEditingCell({ timeIndex, day });
              setEditFormData({
                courseId: "",
                subject: "",
                room: "",
                instructor: "",
              });
            }}
          >
            <i className="bi bi-plus"></i> Add Class
          </button>
        )}
      </div>
    );
  };

  const saveEditedCell = () => {
    if (
      editingCell &&
      editFormData.subject &&
      editFormData.courseId &&
      editFormData.room &&
      editFormData.instructor
    ) {
      handleCellChange(
        editingCell.timeIndex,
        editingCell.day,
        editFormData.courseId,
        editFormData.subject,
        editFormData.instructor,
        editFormData.room
      );
      setEditingCell(null);
      setEditFormData({ courseId: "", subject: "", room: "", instructor: "" });
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow-sm border-0">
            <div
              className="card-body bg-primary bg-gradient text-white"
              style={{ borderRadius: "0.375rem" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="h3 mb-0">Department Timetable</h1>
                <div className="form-group">
                  <select
                    className="form-select bg-white text-dark"
                    value={department}
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
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Timetable Editor</h5>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-danger me-2"
                  onClick={clearAllCells}
                  type="button"
                  disabled={!department}
                >
                  <i className="bi bi-trash me-2"></i>
                  Clear All
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveTimetable}
                  disabled={isSaving || !department}
                >
                  {isSaving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>
                      Save Timetable
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              {department ? (
                <div className="table-responsive">
                  <table className="table table-bordered mb-0">
                    <thead>
                      <tr className="bg-light">
                        <th className="text-center" style={{ width: "12%" }}>
                          Time
                        </th>
                        {dayLabels.map((day, index) => (
                          <th
                            key={index}
                            className="text-center"
                            style={{ width: `${88 / dayLabels.length}%` }}
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timetableData.map((row, timeIndex) => (
                        <tr key={timeIndex}>
                          <th className="align-middle text-center bg-light">
                            {row.timeSlot}
                          </th>
                          {dayKeys.map((day, dayIndex) => (
                            <td key={dayIndex} style={{ height: "100px" }}>
                              <CellEditor
                                data={row[day]}
                                timeIndex={timeIndex}
                                day={day}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center p-5 text-muted">
                  <i className="bi bi-exclamation-triangle fs-1 mb-3 text-warning"></i>
                  <h5>No timetable available</h5>
                  <p>Please select a department from the dropdown list.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showClearModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Confirm Clear All</h5>
                  <button
                    type="button"
                    className="btn-close bg-white"
                    aria-label="Close"
                    onClick={handleCancelClear}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to clear all classes from the
                    timetable?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelClear}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmClear}
                  >
                    Yes, Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      <div
        className="modal fade"
        id="editClassModal"
        tabIndex="-1"
        aria-labelledby="editClassModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="editClassModalLabel">
                Add/Edit Class
              </h5>
              <button
                type="button"
                className="btn-close bg-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="courseId" className="form-label">
                    Course ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="courseId"
                    value={editFormData.courseId}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        courseId: e.target.value,
                      })
                    }
                    placeholder="e.g. CS101"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    value={editFormData.subject}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        subject: e.target.value,
                      })
                    }
                    placeholder="e.g. Advanced Calculus"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="instructor" className="form-label">
                    Instructor
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="instructor"
                    value={editFormData.instructor}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        instructor: e.target.value,
                      })
                    }
                    placeholder="e.g. Prof. John Doe"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="room" className="form-label">
                    Room
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="room"
                    value={editFormData.room}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, room: e.target.value })
                    }
                    placeholder="e.g. Room 101"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={saveEditedCell}
                disabled={
                  !editFormData.subject ||
                  !editFormData.courseId ||
                  !editFormData.room ||
                  !editFormData.instructor
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTimetable;
