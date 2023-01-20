import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

import "./Button.css";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  const appliedClasses = clsx("Button");

  return (
    <button className={appliedClasses} {...props}>
      {children}
    </button>
  );
};
