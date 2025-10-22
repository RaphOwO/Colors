import { useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/navbar.css";

function Navbar({ onLoginClick }) {
  return (
    <nav>
      <Link to="/" className="home">COLORS</Link>
      <label id="overlay" htmlFor="sidebar-active"></label>
      <input type="checkbox" id="sidebar-active" />
      <ul>
        <label htmlFor="sidebar-active" className="close-sidebar"></label>
        <li><Link to="/color">Color</Link></li>
        <li><Link to="/composition">Composition</Link></li>
        <li><button onClick={onLoginClick}>Login</button></li>
      </ul>
      <label htmlFor="sidebar-active" className="button"></label>
    </nav>
  );
}


export default Navbar;