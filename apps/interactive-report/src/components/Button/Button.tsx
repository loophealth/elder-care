import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

import "./Button.css";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  isPrimary?: boolean;
}

export const Button = ({ children, isPrimary, ...restProps }: ButtonProps) => {
  const appliedClasses = clsx("Button", {
    "Button--Primary": isPrimary,
  });

  return (
    <button className={appliedClasses} {...restProps}>
      {children}
    </button>
  );
};
