import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import "./MobileNavbar.css";

export const MobileNavbar = () => {
  return (
    <div className="MobileNavbar">
      <MobileNavbarLink to="/">
        <div className="MobileNavbar__Item__Icon MobileNavbar__Item__Icon--Home" />
        <div className="MobileNavbar__Item__Label">Home</div>
      </MobileNavbarLink>
      <MobileNavbarLink to="/care">
        <div className="MobileNavbar__Item__Icon MobileNavbar__Item__Icon--Care" />
        <div className="MobileNavbar__Item__Label">Care</div>
      </MobileNavbarLink>
      <MobileNavbarLink to="/report">
        <div className="MobileNavbar__Item__Icon MobileNavbar__Item__Icon--You" />
        <div className="MobileNavbar__Item__Label">You</div>
      </MobileNavbarLink>
    </div>
  );
};

const MobileNavbarLink = ({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "MobileNavbar__Item MobileNavbar__Item--Active"
          : "MobileNavbar__Item"
      }
    >
      {children}
    </NavLink>
  );
};
