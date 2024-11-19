import AppLogo from "@/assets/app-logo.svg";
import { Menu02Icon, UserCircleIcon } from "hugeicons-react";

/**
 * TODO 1: Update menu with actual routes
 * TODO 2: Update user icon with Clerk component
 */

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <nav className="navbar bg-neutral shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-circle btn-ghost"
            >
              <Menu02Icon size={24} />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <a>Generate Diplomas</a>
              </li>
              <li>
                <a>Manage Templates</a>
              </li>
              <li>
                <a>View Diplomas</a>
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
          <button className="btn btn-circle btn-ghost">
            <UserCircleIcon size={24} />
          </button>
        </div>
      </nav>
    </header>
  );
}
