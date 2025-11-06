import { useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/navbar.css";

function Sidebar({ className, user, onLoginClick, onLogOutClick }) {
  return (
    <ul className={className}>
      <label htmlFor="sidebar-active" className="close-sidebar"></label>
      <li><Link to="/color">Color</Link></li>
      <li><Link to="/composition">Composition</Link></li>
      {user ? (
        <li><button onClick={onLogOutClick}>Logout</button></li>
      ) : (
        <li><button onClick={onLoginClick}>Login</button></li>
      )}
    </ul>
  );
}

function Navbar({ onLoginClick, user, onLogOutClick }) {
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
          <span className="lineTop"/>
          <span className="lineBottom"/>
        </label>
      </nav>

    </>
  );
}


export default Navbar;