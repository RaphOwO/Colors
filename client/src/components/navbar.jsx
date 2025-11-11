import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./../styles/navbar.css";
import { isLoggedIn } from "../utils/checkLogin";

function Dropdown({ title, links, name, isSidebar,isCompositionPage }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <li className={`dropdown ${isSidebar ? "sidebar-dropdown" : ""}`} ref={ref}>
      <button
        className="dropdown-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        {title}
        <span className="caret">▼</span>
      </button>

      <ul
        className={`dropdown-menu ${isSidebar ? "sidebar" : ""} ${
          open ? "show" : ""
        }`}
        style={{color: isCompositionPage ? "black" : "white"}}
      >
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

function Sidebar({ className, user, onLoginClick, onLogOutClick,isCompositionPage }) {
  return (
    <ul className={className}>
      <label htmlFor="sidebar-active" className="close-sidebar"></label>

      <Dropdown
        title="Color"
        name="color"
        links={[
          { to: "/color/theory", label: "Theory" },
          { to: "/color/meaning", label: "Meaning" },
        ]}
        isSidebar={className === "sidebar"}
        isCompositionPage={isCompositionPage}

      />

      <Dropdown
        title="Composition"
        name="composition"
        links={[
          { to: "/composition/theory", label: "Info" },
          { to: "/composition/canvas", label: "Canvas" },
        ]}
        isSidebar={className === "sidebar"}
        isCompositionPage={isCompositionPage}

      />

      <li>
        <Link to="/test">Test</Link>
      </li>

      {user ? (
        <li><button onClick={onLogOutClick}>Logout</button></li>
      ) : (
        <li><button onClick={onLoginClick}>Login</button></li>
      )}
    </ul>
  );
}

function Navbar({ onLoginClick, user, onLogOutClick }) {
  const location = useLocation();

  useEffect(() => {
    const sidebarCheckbox = document.getElementById("sidebar-active");
    if (sidebarCheckbox) sidebarCheckbox.checked = false;
  }, [location]);

  const isCompositionPage = location.pathname.includes("composition/canvas");

  return (
    <>
      <nav
        style={{
          backgroundColor: isCompositionPage ? "white" : "transparent",
          color: isCompositionPage ? "#1a1a1a" : "white"
        }}
      >
        <Link to="/" className="home" style={{color: isCompositionPage ? "#1a1a1a" : "white"}}>COLORS</Link>
        <input type="checkbox" id="sidebar-active" />
        <label id="overlay" htmlFor="sidebar-active"></label>

        <Sidebar
          className="nav"
          user={user}
          onLoginClick={onLoginClick}
          onLogOutClick={onLogOutClick}
          isCompositionPage={isCompositionPage}
        />
        <Sidebar
          className="sidebar"
          user={user}
          onLoginClick={onLoginClick}
          onLogOutClick={onLogOutClick}
          isCompositionPage={isCompositionPage}
        />

        <label htmlFor="sidebar-active" className="button">
          <span className="lineTop" />
          <span className="lineBottom" />
        </label>
      </nav>
    </>
  );
}

export default Navbar;