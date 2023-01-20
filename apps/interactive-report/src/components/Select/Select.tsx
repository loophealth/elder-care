import { ComponentPropsWithoutRef } from "react";

import "./Select.css";

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  children: React.ReactNode;
}

export const Select = ({ children, ...restProps }: SelectProps) => {
  return (
    <select className="Select" {...restProps}>
      {children}
    </select>
  );
};
