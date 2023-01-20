import { NavLink } from "react-router-dom";

import "./Navbar.css";

export const Navbar = () => {
  return (
    <nav className="Navbar">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/timeline">Timeline</NavLink>
        </li>
        <li>
          <NavLink to="/report">Report</NavLink>
        </li>
        <li>
          <NavLink to="/summary">Summary</NavLink>
        </li>
        <li>
          <NavLink to="/care-plan">Care Plan</NavLink>
        </li>
        <li>
          <NavLink to="/admin">Admin</NavLink>
        </li>
      </ul>
    </nav>
  );
};
