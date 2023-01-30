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
        <div className="Navbar__Item__Icon Navbar__Item__Icon--Home" />
        <div className="Navbar__Item__Label">Home</div>
      </NavbarLink>
      <NavbarLink to="/care">
        <div className="Navbar__Item__Icon Navbar__Item__Icon--Care" />
        <div className="Navbar__Item__Label">Care</div>
      </NavbarLink>
      <NavbarLink to="/insurance">
        <div className="Navbar__Item__Icon Navbar__Item__Icon--Insurance" />
        <div className="Navbar__Item__Label">Insurance</div>
      </NavbarLink>
      <NavbarLink to="/you">
        <div className="Navbar__Item__Icon Navbar__Item__Icon--You" />
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
