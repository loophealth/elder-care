import { NavLink } from "react-router-dom";

import "./Navbar.css";
import { usePatient } from "@loophealth/api";

export const Navbar = () => {
  const { patient } = usePatient();
  return (
    <nav className="Navbar">
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/timeline">History & Symptoms</NavLink>
        </li>
        <li>
          <NavLink to="/summary">Report Summary</NavLink>
        </li>
        <li>
          <NavLink to="/report">Detailed Report</NavLink>
        </li>
        <li>
          <NavLink to="/care-plan">Treatment Plan</NavLink>
        </li>
        <li>
          <NavLink to="/admin">Admin</NavLink>
        </li>
      </ul>
      <div className="Navbar__User__Info">
        <p className="Navbar__User__Label">{patient?.profile?.fullName}</p>
        <p>Age: {patient?.profile?.age}</p>
      </div>
    </nav>
  );
};
