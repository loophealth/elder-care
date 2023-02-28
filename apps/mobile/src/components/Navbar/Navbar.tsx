import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

export const Navbar = () => {
  return (
    <div className="Navbar">
      <NavbarLink to="/">
        <div className="Navbar__Item__Icon Navbar__Item__Icon--Home" />
        <div className="Navbar__Item__Label">Home</div>
      </NavbarLink>
      <NavbarLink to="/care">
        <div className="Navbar__Item__Icon Navbar__Item__Icon--Care" />
        <div className="Navbar__Item__Label">Care</div>
      </NavbarLink>
      <NavbarLink to="/report">
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
