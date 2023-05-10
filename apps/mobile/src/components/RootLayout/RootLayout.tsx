import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";

import { Navbar } from "components/Navbar";

import "./RootLayout.css";
import { logCurrentScreen } from "@loophealth/api";

interface RootLayoutProps {
  shouldShowNavbar?: boolean;
}

export const RootLayout = ({ shouldShowNavbar }: RootLayoutProps) => {
  const { pathname } = useLocation();

  const appliedClassNames = clsx("RootLayout", {
    "RootLayout--WithNavbar": shouldShowNavbar,
  });

  useEffect(() => {
    const currentScreen = pathname.split("/").reverse()[0];
    logCurrentScreen(currentScreen);
  }, [pathname]);

  return (
    <div className={appliedClassNames}>
      <Outlet />
      {shouldShowNavbar ? <Navbar /> : null}
    </div>
  );
};
