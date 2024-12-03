import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import {
  DashboardSquare01Icon,
  FileEditIcon,
  Files01Icon,
  Menu02Icon,
  PlusSignIcon,
} from "hugeicons-react";

import AppLogo from "@/assets/app-logo.svg";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <nav className="navbar bg-neutral shadow-sm">
        <div className="navbar-start">
          <SignedIn>
            <DropdownMenu />
          </SignedIn>
        </div>
        <div className="navbar-center">
          <AppLogo />
        </div>
        <div className="navbar-end">
          <div className="px-3">
            <UserButton />
          </div>
        </div>
      </nav>
    </header>
  );
}

function DropdownMenu() {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
        <Menu02Icon size={24} />
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-[1] mt-4 w-max rounded-box border bg-neutral p-4 shadow"
      >
        <li>
          <Link
            to="/"
            className="py-[6px] font-display text-base data-[status=active]:!font-medium data-[status=active]:!text-primary"
          >
            <DashboardSquare01Icon size={22} className="mr-1" />
            View Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/diploma-generator"
            className="py-[6px] font-display text-base data-[status=active]:!font-medium data-[status=active]:!text-primary"
          >
            <PlusSignIcon size={22} className="mr-1" />
            Generate Diplomas
          </Link>
        </li>

        <li>
          <Link
            to="/template-designer"
            className="py-[6px] font-display text-base data-[status=active]:!font-medium data-[status=active]:!text-primary"
          >
            <FileEditIcon size={22} className="mr-1" />
            Design Templates
          </Link>
        </li>

        <li>
          <Link
            to="/history"
            className="py-[6px] font-display text-base data-[status=active]:!font-medium data-[status=active]:!text-primary"
          >
            <Files01Icon size={22} className="mr-1" />
            View Diplomas
          </Link>
        </li>
      </ul>
    </div>
  );
}
