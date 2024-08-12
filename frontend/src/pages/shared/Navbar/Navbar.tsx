import { Link, useLocation } from "react-router-dom";
import './Navbar.css'
import { PdfCreatorIcon } from "../../../components/MenuItems/Icons/PdfCreatorIcon";
import { DashBoardIcon } from "../../../components/MenuItems/Icons/DashBoardIcon";
import { TemplateCreatorIcon } from "../../../components/MenuItems/Icons/TemplateCreatorIcon";
import { CogWheelIcon } from "../../../components/MenuItems/Icons/CogWheelIcon";
import { HistoryIcon } from "../../../components/MenuItems/Icons/HistoryIcon";
import { MountainIcon } from "../../../components/MenuItems/Icons/MountainIcon";
import { HelpIcon } from "../../../components/MenuItems/Icons/HelpIcon";
import { HomeIcon } from "../../../components/MenuItems/Icons/HomeIcon";

export const NavBar = () => {
    const location = useLocation();
    const hideNavItems = location.pathname.startsWith('/verify');

    return (
        <nav className="navbar">
            <ul className="navbar__menu">
                {!hideNavItems && (
                    <>
                        <li className="navbar__item">
                            <Link to="/home" className={"navbar__link " + ((location.pathname === '/home' || location.pathname === '/home') && "active")}>
                                < HomeIcon/>
                                Home
                            </Link>
                        </li>
                        <li className="navbar__item">
                            <Link to="/overview" className={"navbar__link " + ((location.pathname === '/overview' || location.pathname === '/Overview') && "active")}>
                                <DashBoardIcon />
                                Dashboard
                            </Link>
                        </li>
                        <li className="navbar__item">
                            <Link to="/pdf-creator" className={"navbar__link " + (location.pathname === '/pdf-creator' && "active")}>
                                <PdfCreatorIcon />
                                PDFcreator
                            </Link>
                        </li>
                        <li className="navbar__item">
                            <Link to="/template-creator" className={"navbar__link " + ((location.pathname === '/template-creator' || location.pathname === '/Template-creator') && "active")}>
                                <TemplateCreatorIcon />
                                TemplateCreator
                            </Link>
                        </li>
                        <li className="navbar__item">
                            <Link to="/bootcamp-management" className={"navbar__link " + ((location.pathname === '/bootcamp-management' || location.pathname === '/Bootcamp-management') && "active")}>
                                <CogWheelIcon />
                                BootcampOptions
                            </Link>
                        </li>
                        <li className="navbar__item">
                            <Link to="/history" className={"navbar__link " + ((location.pathname === '/history' || location.pathname === '/history') && "active")}>
                                <HistoryIcon />
                                History
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};
