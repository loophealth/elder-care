import { Outlet } from "react-router-dom";
import clsx from "clsx";

import { Navbar } from "components/Navbar";

import "./RootLayout.css";

interface RootLayoutProps {
  shouldShowNavbar?: boolean;
}

export const RootLayout = ({ shouldShowNavbar }: RootLayoutProps) => {
  const appliedClassNames = clsx("RootLayout", {
    "RootLayout--WithNavbar": shouldShowNavbar,
  });

  return (
    <div className={appliedClassNames}>
      {/* <Outlet /> */}
      {shouldShowNavbar ? <Navbar /> : null}
    </div>
  );
};
