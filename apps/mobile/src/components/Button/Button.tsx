import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

import "./Button.css";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  const appliedClasses = clsx("Button", className);

  return (
    <button className={appliedClasses} {...props}>
      {children}
    </button>
  );
};
