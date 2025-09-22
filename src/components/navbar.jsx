import { Link } from "react-router-dom";
import "./../styles/navbar.css";

function Navbar() {
    return (
        <nav>
            <Link to="/" className="home">
            COLORS
            </Link>
            <label id="overlay" htmlFor="sidebar-active"></label>
            <input type="checkbox" id="sidebar-active"></input>
            <ul>
                <label htmlFor="sidebar-active" className="close-sidebar"></label>
                <li><Link to="/color">Color</Link></li>
                <li><Link to="/composition">Composition</Link></li>
            </ul>
            <label htmlFor="sidebar-active" className="button"></label>
        </nav>
    )
}

export default Navbar;