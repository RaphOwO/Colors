import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./../styles/navbar.css";
import { isLoggedIn } from "../utils/checkLogin";

function Dropdown({ title, links, name, isSidebar }) {
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

function Sidebar({ className, user, onLoginClick, onLogOutClick }) {
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
      />

      <Dropdown
        title="Composition"
        name="composition"
        links={[
          { to: "/composition/balance", label: "Balance" },
          { to: "/composition/rhythm", label: "Rhythm" },
          { to: "/composition/contrast", label: "Contrast" },
        ]}
        isSidebar={className === "sidebar"}
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

  return (
    <>
      <nav>
        <Link to="/" className="home">COLORS</Link>
        <input type="checkbox" id="sidebar-active" />
        <label id="overlay" htmlFor="sidebar-active"></label>

        <Sidebar
          className="nav"
          user={user}
          onLoginClick={onLoginClick}
          onLogOutClick={onLogOutClick}
        />
        <Sidebar
          className="sidebar"
          user={user}
          onLoginClick={onLoginClick}
          onLogOutClick={onLogOutClick}
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