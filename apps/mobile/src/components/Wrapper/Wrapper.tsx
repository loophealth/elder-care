import { logCurrentScreen } from "@loophealth/api";
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

interface WrapperProps {
  children: any;
}

export const Wrapper = ({ children }: WrapperProps) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
    const currentScreen = location.pathname.split("/").reverse()[0];
    logCurrentScreen(currentScreen);
  }, [location.pathname]);
  return children;
};
