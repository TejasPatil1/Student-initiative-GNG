"use client";
import { NavLink } from "react-router-dom";

export function SectionNavBar() {
  const linkBase = "nav-link px-6 py-3 rounded-md hover:bg-primary/10 transition";
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      <NavLink
        to="/pyqs"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? "bg-primary/20 font-bold" : ""}`
        }
      >
        PYQs
      </NavLink>
      <NavLink
        to="/assignments"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? "bg-primary/20 font-bold" : ""}`
        }
      >
        Assignments
      </NavLink>
      <NavLink
        to="/courses"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? "bg-primary/20 font-bold" : ""}`
        }
      >
        Courses
      </NavLink>
    </div>
  );
}
