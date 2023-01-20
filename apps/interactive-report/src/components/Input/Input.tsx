import { ComponentPropsWithoutRef } from "react";

import "./Input.css";

interface InputProps extends ComponentPropsWithoutRef<"input"> {}

export const Input = ({ ...restProps }: InputProps) => {
  return <input className="Input" {...restProps} />;
};
