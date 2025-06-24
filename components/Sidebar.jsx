"use client";
import { CalendarHeart, Menu } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import {
  Home,
  Calendar,
  PlusCircle,
  Download,
  Printer,
  Settings,
  ChevronRight,
  Building,
  Edit,
  Filter,
} from "lucide-react";
import { useState, useEffect } from "react";

function Sidebar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username || "");
        }
      } catch (err) {
        setUsername("");
      }
    };
    fetchUser();
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const NavItem = ({ href, icon, children, isActive }) => {
    return (
      <Link
        href={href}
        className={`nav-link py-2 px-3 mb-1 rounded d-flex align-items-center ${
          isActive ? "active bg-primary text-white" : "text-dark"
        }`}
      >
        {icon}
        <span className="ms-3">{children}</span>
        {isActive && <ChevronRight className="ms-auto" size={16} />}
      </Link>
    );
  };

  return (
    <>
      <button
        className="btn"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        <Menu size={20} />
      </button>
      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabIndex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <div className="h-100 d-flex flex-column">
            <div className="p-3 border-bottom">
              <div
                className="d-flex align-items-center flex-grow-1"
                style={{ background: "light" }}
              >
                <Calendar className="text-primary" size={32} />
                <div className="ms-3 ">
                  <h5 className="fw-bold mb-0">Timetable</h5>
                  <p className="mb-0 text-muted small">Management System</p>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="p-3 flex-grow-1">
            <p className="text-uppercase text-muted small fw-bold mb-2">
              Main Menu
            </p>
            <nav className="nav flex-column">
              <NavItem href="/Dashboard" icon={<Home size={18} />}>
                Dashboard
              </NavItem>
              <NavItem href="/CreateTimetable" icon={<PlusCircle size={18} />}>
                Create Timetable
              </NavItem>
              <NavItem href="/EditTimetable" icon={<Edit size={18} />}>
                Edit Timetable
              </NavItem>
              <NavItem href="/ViewTimeTable" icon={<Calendar size={18} />}>
                View Timetable
              </NavItem>
              <NavItem href="/ExportTimeTable" icon={<Download size={18} />}>
                Export Timetable
              </NavItem>
            </nav>
          </div>
          <div className="p-3 border-top">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                style={{ width: "32px", height: "32px" }}
              >
                {username ? username[0].toUpperCase() : "?"}
              </div>
              <div className="ms-3">
                <p className="mb-0 fw-medium">{username || "Guest"}</p>
                <p className="mb-0 text-muted small">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
