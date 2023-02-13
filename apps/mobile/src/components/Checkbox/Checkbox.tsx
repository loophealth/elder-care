import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

import "./Checkbox.css";

interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
  className?: string;
}

export const Checkbox = ({ className, ...restProps }: CheckboxProps) => {
  const appliedClassNames = clsx("Checkbox", className);
  return <input type="checkbox" className={appliedClassNames} {...restProps} />;
};
