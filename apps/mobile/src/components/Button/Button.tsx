import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

import "./Button.css";

export enum ButtonVariant {
  Primary = "primary",
  Danger = "secondary",
}

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

export const Button = ({
  children,
  variant = ButtonVariant.Primary,
  className,
  ...props
}: ButtonProps) => {
  const appliedClassNames = clsx("Button", className, {
    "Button--Danger": variant === ButtonVariant.Danger,
  });

  return (
    <button className={appliedClassNames} {...props}>
      {children}
    </button>
  );
};
