import { Link, useLocation } from "react-router-dom";
import './Navbar.css'

export const NavBar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <ul className="navbar__menu">
                <li className="navbar__item">
                    <Link to="/" className={"navbar__link " + (location.pathname == '/' && "active")}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className="stroke" d="M1.99609 8.5H11.4961" stroke="#ababba" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className="stroke" d="M5.99609 16.5H7.99609" stroke="#ababba" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className="stroke" d="M10.4961 16.5H14.4961" stroke="#ababba" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className="stroke" d="M21.9961 12.03V16.11C21.9961 19.62 21.1061 20.5 17.5561 20.5H6.43609C2.88609 20.5 1.99609 19.62 1.99609 16.11V7.89C1.99609 4.38 2.88609 3.5 6.43609 3.5H14.4961" stroke="#ababba" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className="stroke" d="M19.0761 4.13006L15.3661 7.84006C15.2261 7.98006 15.0861 8.26006 15.0561 8.46006L14.8561 9.88006C14.7861 10.3901 15.1461 10.7501 15.6561 10.6801L17.0761 10.4801C17.2761 10.4501 17.5561 10.3101 17.6961 10.1701L21.4061 6.46006C22.0461 5.82006 22.3461 5.08006 21.4061 4.14006C20.4561 3.19006 19.7161 3.49006 19.0761 4.13006Z" stroke="#ababba" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            <path className="stroke" d="M18.5461 4.65991C18.8661 5.78991 19.7461 6.66991 20.8661 6.97991" stroke="#ababba" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        PDFcreator
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link to="/overview" className={"navbar__link " + ((location.pathname == '/overview' || location.pathname == '/Overview') && "active")}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className="fill" d="M3 5.6A2.6 2.6 0 0 1 5.6 3h2.8A2.6 2.6 0 0 1 11 5.6v2.8A2.6 2.6 0 0 1 8.4 11H5.6A2.6 2.6 0 0 1 3 8.4V5.6ZM3 15.6A2.6 2.6 0 0 1 5.6 13h2.8a2.6 2.6 0 0 1 2.6 2.6v2.8A2.6 2.6 0 0 1 8.4 21H5.6A2.6 2.6 0 0 1 3 18.4v-2.8ZM13 5.6A2.6 2.6 0 0 1 15.6 3h2.8A2.6 2.6 0 0 1 21 5.6v2.8a2.6 2.6 0 0 1-2.6 2.6h-2.8A2.6 2.6 0 0 1 13 8.4V5.6ZM17 13a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1Z" fill="#ababba"/>
                        </svg>
                        Dashboard
                    </Link>
                </li>
                <li className="navbar__item">
                    <Link to="/template-creator" className={"navbar__link " + ((location.pathname == '/template-creator' || location.pathname == '/Template-creator') && "active")}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ababba">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <g id="ic-editor-scale">
                            <rect className="cls-1" x="19" y="1" width="4" height="4" rx="1.25"></rect>
                            <rect className="cls-1" x="1" y="1" width="4" height="4" rx="1.25"></rect>
                            <rect className="cls-1" x="19" y="19" width="4" height="4" rx="1.25"></rect>
                            <rect className="cls-1" x="1" y="19" width="4" height="4" rx="1.25"></rect>
                            <line className="cls-1" x1="5" y1="3" x2="19" y2="3"></line>
                            <line className="cls-1" x1="21" y1="5" x2="21" y2="19"></line>
                            <line className="cls-1" x1="19" y1="21" x2="5" y2="21"></line>
                            <line className="cls-1" x1="3" y1="19" x2="3" y2="5"></line>
                            <line className="cls-1" x1="7" y1="18" x2="12" y2="6"></line>
                            <line className="cls-1" x1="17" y1="18" x2="12" y2="6"></line>
                            <line className="cls-1" x1="8.67" y1="14" x2="15.33" y2="14"></line>
                            </g>
                        </g>
                        </svg>

                        TemplateCreator
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
