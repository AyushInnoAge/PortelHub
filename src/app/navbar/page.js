"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaListUl } from "react-icons/fa6";
import { MdOutlineEvent } from "react-icons/md";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { MdOutlinePreview } from "react-icons/md";
import {
  FaThLarge,
  FaBox,
  FaUsers,
  FaUserCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname(); // Get the current path
  const [activeRoute, setActiveRoute] = useState(pathname);
  const router = useRouter();
  const handleNavClick = (route) => {
    setActiveRoute(route);
    router.push(route); // Navigate to the route
  };

  // Toggle dropdown menus
  const toggleDropdown = (menu) => {
    setDropdownOpen(isDropdownOpen === menu ? null : menu);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setProfileOpen(!isProfileOpen);
  };

  // Toggle sidebar menu
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".nav-item") &&
        !event.target.closest(".profile-container")
      ) {
        setDropdownOpen(null);
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".sidebar") &&
        !event.target.closest(".menu-btn")
      ) {
        setSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-container">
          <button className="menu-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          {/* Logo */}
          <div className="logo-container">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <span className="brand-name">InnoHub</span>
          </div>

          {/* Hamburger Menu for Small Screens */}

          {/* Navigation Links (Visible on Large Screens) */}
          <div className={`nav-links ${isSidebarOpen ? "hide" : ""}    `}>
            <Link
              href="/dashboard"
              className={`nav-link ${
                activeRoute === "/dashboard" ? "active" : ""
              }`}
              onClick={() => handleNavClick("/dashboard")}
            >
              Dashboard
            </Link>
            <div className="nav-item">
              <div className="dropdown1">
                <button
                  className={`nav-link ${
                    activeRoute === "/nominations" ? "active" : ""
                  }`}
                  onClick={() => {
                    toggleDropdown("awards");
                    handleNavClick("/nominations");
                  }}
                >
                  Awards
                </button>
              </div>
            </div>
            <div className="nav-item">
              <div className="dropdown1">
                <button
                  className={`nav-link ${
                    activeRoute === "/funactivity" ? "active" : ""
                  }`}
                  onClick={() => {
                    handleNavClick("/funactivity");
                  }}
                >
                  Fun & Social Activities
                </button>
              </div>
            </div>
            <div className="nav-item">
              {user?.userRole &&
                (user.userRole === 1 || user.userRole === 2) && (
                  <div className="nav-item">
                    <div className="dropdown1">
                      <button
                        className="nav-link dropdown-btn"
                        onClick={() => toggleDropdown("Admin")}
                      >
                        Admin
                      </button>
                      <FaChevronDown
                        size={12}
                        onClick={() => toggleDropdown("Admin")}
                      />
                    </div>
                    {isDropdownOpen === "Admin" && (
                      <div className="dropdown-content lower-dropdown">
                        <Link href="/approval" className="dropdown-item">
                          {user.userRole === 1 ? "Approval" : "Review"}
                        </Link>
                        <Link href="/allemployees" className="dropdown-item">
                          All Employee
                        </Link>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Profile & Cart */}
          <div className="right-container">
            <div className="profile-container">
              <button className="profile-btn" onClick={toggleProfileDropdown}>
                <img
                  src={
                    user?.image.length > 0
                      ? user.image
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`
                  }
                  alt="User"
                  className="profile-pic"
                  width={32}
                  height={32}
                />
                <span className="profile-text">{user?.name}</span>
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <Link href="/profilepage" className="dropdown-item">
                    Profile
                  </Link>
                  <Link
                    href="/login"
                    onClick={logout}
                    className="dropdown-item"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu for Small Screens */}
      {/* Sidebar Menu for Small Screens */}
      {isSidebarOpen && (
        <div className="sidebar">
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <Image src="/logo.svg" alt="Logo" width={120} height={40} />
          </div>

          {/* Scrollable Sidebar Links */}
          <div className="sidebar-menu">
            <Link
              href="/dashboard"
              className="sidebar-link"
              onClick={toggleSidebar}
            >
              <FaThLarge /> Dashboard
            </Link>

            <Link
              href="/nominations"
              className="sidebar-link"
              onClick={toggleSidebar}
            >
              <FaTrophy />
              Awards
            </Link>

            <Link
              href="/funactivity"
              className="sidebar-link"
              onClick={toggleSidebar}
            >
              <MdOutlineEvent />
              Fun And Social Activities
            </Link>
            {user?.userRole && (user.userRole === 1 || user.userRole === 2) && (
              <div className="sidebar-section"> Admin</div>
            )}

            {user?.userRole && (user.userRole === 1 || user.userRole === 2) && (
              <Link
                href="/approval"
                className="sidebar-link"
                onClick={toggleSidebar}
              >
                <MdOutlinePreview />
                {user.userRole === 1 ? "Approval" : "Review"}
              </Link>
            )}
            {user?.userRole && (user.userRole === 1 || user.userRole === 2) && (
              <Link
                href="/allemployees"
                className="sidebar-link"
                onClick={toggleSidebar}
              >
                <FaListUl />
                All Employees
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
