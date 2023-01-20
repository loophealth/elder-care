import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

import "./Input.css";

interface InputProps extends ComponentPropsWithoutRef<"input"> {}

export const Input = ({ ...props }: InputProps) => {
  const appliedClasses = clsx("Input");
  return <input className={appliedClasses} {...props} />;
};
