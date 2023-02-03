import { Outlet } from "react-router-dom";
import clsx from "clsx";

import { Navbar } from "components/Navbar";
import { useSafeArea } from "lib/useSafeArea";

import "./RootLayout.css";

interface RootLayoutProps {
  shouldShowNavbar?: boolean;
}

export const RootLayout = ({ shouldShowNavbar }: RootLayoutProps) => {
  const { safeAreaInsets, isLoadingSafeAreaInsets } = useSafeArea();

  if (isLoadingSafeAreaInsets || !safeAreaInsets) {
    return null;
  }

  const style = {
    "--safe-area-inset-top": `${safeAreaInsets.top}px`,
    "--safe-area-inset-right": `${safeAreaInsets.right}px`,
    "--safe-area-inset-bottom": `${safeAreaInsets.bottom}px`,
    "--safe-area-inset-left": `${safeAreaInsets.left}px`,
  } as React.CSSProperties;

  const appliedClassNames = clsx("RootLayout", {
    "RootLayout--WithNavbar": shouldShowNavbar,
  });

  return (
    <div className={appliedClassNames} style={style}>
      <Outlet />
      {shouldShowNavbar ? <Navbar /> : null}
    </div>
  );
};
