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
import { UserButton } from "@clerk/clerk-react";

export const NavBar = () => {
    const location = useLocation();
    const hideNavItems = location.pathname.startsWith('/verify');

    return (
        <nav className="navbar">
            <ul className="navbar__menu">
                {!hideNavItems && (
                    <>
                        <div className="navbar__items">
                            <li className="navbar__item home">
                                <Link to="/home" className={"navbar__link " + ((location.pathname === '/home' || location.pathname === '/Home' || location.pathname === '/') && "active")}>
                                    <HomeIcon />
                                    Home
                                </Link>
                            </li>
                            <li className="navbar__item overview">
                                <Link to="/overview" className={"navbar__link " + ((location.pathname === '/overview' || location.pathname === '/Overview') && "active")}>
                                    <DashBoardIcon />
                                    Dashboard
                                </Link>
                            </li>
                            <li className="navbar__item pdf-creator">
                                <Link to="/pdf-creator" className={"navbar__link " + (location.pathname === '/pdf-creator' && "active")}>
                                    <PdfCreatorIcon />
                                    PDFcreator
                                </Link>
                            </li>
                            <li className="navbar__item template-creator">
                                <Link to="/template-creator" className={"navbar__link " + ((location.pathname === '/template-creator' || location.pathname === '/Template-creator') && "active")}>
                                    <TemplateCreatorIcon />
                                    TemplateCreator
                                </Link>
                            </li>
                            <li className="navbar__item bootcamp-management">
                                <Link to="/bootcamp-management" className={"navbar__link " + ((location.pathname === '/bootcamp-management' || location.pathname === '/Bootcamp-management') && "active")}>
                                    <CogWheelIcon />
                                    BootcampOptions
                                </Link>
                            </li>
                            <li className="navbar__item history">
                                <Link to="/history" className={"navbar__link " + ((location.pathname === '/history' || location.pathname === '/history') && "active")}>
                                    <HistoryIcon />
                                    History
                                </Link>
                            </li>
                        </div>
                        <li className="navbar__item user-profile">
                            <UserButton showName={true} appearance={{
                                elements: {
                                    userButtonAvatarBox: {
                                        width: '35px',
                                        height: '35px',
                                        borderRadius: '50%',
                                        
                                    },
                                    userButtonOuterIdentifier : {
                                        color: '#ababba',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        padding: '0px 2px 0px 0px',
                                    },
                                  
                                },
                            }} />
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};
