"use client";
import { Menu, Calendar, Bell, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username || "");
          setEmail(data.email || "");
        }
      } catch (err) {}
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="border-bottom bg-white py-3 sticky-top">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Sidebar />
            <div className="d-flex align-items-center">
              <Calendar className="text-primary me-2" size={24} />
              <h5 className="mb-0 fw-bold d-none d-sm-block">
                Timetable Management
              </h5>
              <h5 className="mb-0 fw-bold d-sm-none">TMS</h5>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="dropdown" ref={dropdownRef}>
              <button
                className="btn d-flex align-items-center"
                type="button"
                onClick={toggleDropdown}
              >
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                  style={{ width: "32px", height: "32px" }}
                >
                  <User size={18} />
                </div>
                <span className="d-none d-md-block">{username}</span>
              </button>
              {isOpen && (
                <div
                  className="position-absolute mt-1 shadow"
                  style={{
                    width: "280px",
                    right: "0",
                    zIndex: 1000,
                    backgroundColor: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="p-3">
                    <div
                      className="d-flex align-items-center mb-3 pb-3"
                      style={{ borderBottom: "1px solid #e9ecef" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: "#0d6efd",
                          color: "white",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {username ? username[0].toUpperCase() : ""}
                      </div>
                      <div className="ms-3">
                        <div className="fw-bold mb-0">{username}</div>
                        <div style={{ color: "#6c757d", fontSize: "14px" }}>
                          {email}
                        </div>
                      </div>
                    </div>
                    <div className="list-group list-group-flush">
                      <button
                        className="list-group-item list-group-item-action py-2 border-0 rounded-3"
                        style={{ color: "#dc3545" }}
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
