import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { Menu02Icon } from "hugeicons-react";

import AppLogo from "@/assets/app-logo.svg";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <nav className="navbar bg-neutral shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <SignedIn>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost"
              >
                <Menu02Icon size={24} />
              </div>
            </SignedIn>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <Link
                  to="/"
                >Dashboard</Link>
              </li>

              <li>
                <Link
                  to="/template-designer"
                >Design Templates</Link>
              </li>

              <li>
                <Link
                  to="/diploma-generator"
                >Generate Diplomas</Link>
              </li>

              <li>
                <Link
                  to="/history"
                >Diploma History</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">
            <AppLogo />
          </a>
        </div>
        <div className="navbar-end">
          <UserButton />
        </div>
      </nav>
    </header>
  );
}
