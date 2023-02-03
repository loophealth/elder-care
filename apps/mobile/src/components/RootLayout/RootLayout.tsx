import { Outlet } from "react-router-dom";
import clsx from "clsx";

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
  const appliedClassNames = clsx("RootLayout", {
    "RootLayout--WithNavbar": shouldShowNavbar,
  });

  return (
    <div className={appliedClassNames}>
      {shouldShowHeader ? <div>Header</div> : null}
      <Outlet />
      {shouldShowNavbar ? <Navbar /> : null}
    </div>
  );
};
