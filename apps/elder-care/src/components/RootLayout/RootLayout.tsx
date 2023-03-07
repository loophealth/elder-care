import { Outlet } from "react-router-dom";
import clsx from "clsx";

import { MobileNavbar } from "@loophealth/ui";

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
      <Outlet />
      {shouldShowNavbar ? <MobileNavbar /> : null}
    </div>
  );
};
