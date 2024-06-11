import { Link, useLocation } from "react-router-dom";
import './Navbar.css'

export const NavBar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <ul className="navbar__menu">
                <li className="navbar__item">
                    <Link to="/" className={"navbar__link " + (location.pathname == '/' && "active")}>
                        PDFcreator
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link to="/overview" className={"navbar__link " + (location.pathname == '/overview' && "active")}>
                        Dashboard
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
