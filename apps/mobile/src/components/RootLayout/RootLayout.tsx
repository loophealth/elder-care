import { Outlet } from "react-router-dom";

import { Navbar } from "components/Navbar";

import "./RootLayout.css";

export const RootLayout = () => {
  return (
    <div className="RootLayout">
      <Outlet />
      <Navbar />
    </div>
  );
};
