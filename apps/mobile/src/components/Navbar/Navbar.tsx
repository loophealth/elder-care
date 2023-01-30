import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { useSafeArea } from "lib/useSafeArea";

import "./Navbar.css";

export const Navbar = () => {
  const { isLoadingSafeAreaInsets, safeAreaInsets } = useSafeArea();

  if (isLoadingSafeAreaInsets || !safeAreaInsets) {
    return null;
  }

  return (
    <div className="Navbar" style={{ bottom: `${safeAreaInsets.bottom}px` }}>
      <NavbarLink to="/">
        <div className="Navbar__Item__Icon">
          <img src="/img/home.svg" alt="Home icon" />
        </div>
        <div className="Navbar__Item__Label">Home</div>
      </NavbarLink>
      <NavbarLink to="/care">
        <div className="Navbar__Item__Icon">
          <img src="/img/stethoscope.svg" alt="Care icon" />
        </div>
        <div className="Navbar__Item__Label">Care</div>
      </NavbarLink>
      <NavbarLink to="/insurance">
        <div className="Navbar__Item__Icon">
          <img src="/img/shield.svg" alt="Insurance icon" />
        </div>
        <div className="Navbar__Item__Label">Insurance</div>
      </NavbarLink>
      <NavbarLink to="/you">
        <div className="Navbar__Item__Icon">
          <img src="/img/user.svg" alt="User icon" />
        </div>
        <div className="Navbar__Item__Label">You</div>
      </NavbarLink>
    </div>
  );
};

const NavbarLink = ({ to, children }: { to: string; children: ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "Navbar__Item Navbar__Item--Active" : "Navbar__Item"
      }
    >
      {children}
    </NavLink>
  );
};
