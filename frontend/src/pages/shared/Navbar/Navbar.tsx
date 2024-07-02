import { Link, useLocation } from "react-router-dom";
import './Navbar.css'
import { PdfCreatorIcon } from "../../../components/MenuItems/Icons/PdfCreatorIcon";
import { DashBoardIcon } from "../../../components/MenuItems/Icons/DashBoardIcon";
import { TemplateCreatorIcon } from "../../../components/MenuItems/Icons/TemplateCreatorIcon";
import { CogWheelIcon } from "../../../components/MenuItems/Icons/CogWheelIcon";

export const NavBar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <ul className="navbar__menu">
                <li className="navbar__item">
                    <Link to="/" className={"navbar__link " + (location.pathname == '/' && "active")}>
                        <PdfCreatorIcon />
                        PDFcreator
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link to="/overview" className={"navbar__link " + ((location.pathname == '/overview' || location.pathname == '/Overview') && "active")}>
                        <DashBoardIcon />
                        Dashboard
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link to="/template-creator" className={"navbar__link " + ((location.pathname == '/template-creator' || location.pathname == '/Template-creator') && "active")}>
                        <TemplateCreatorIcon />
                        TemplateCreator
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link to="/bootcamp-management" className={"navbar__link " + ((location.pathname == '/bootcamp-management' || location.pathname == '/Bootcamp-management') && "active")}>
                        <CogWheelIcon />
                        BootcampOptions
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
