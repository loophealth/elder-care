import { Outlet } from "react-router-dom";

import { Navbar } from "components/Navbar";

import "./RootLayout.css";

interface RootLayoutProps {
  shouldShowNavbar?: boolean;
  shouldShowHeader?: boolean;
}

export const RootLayout = ({
  shouldShowNavbar,
  shouldShowHeader,
}: RootLayoutProps) => {
  return (
    <div className="RootLayout">
      {shouldShowHeader ? <div>Header</div> : null}
      <Outlet />
      {shouldShowNavbar ? <Navbar /> : null}
    </div>
  );
};
