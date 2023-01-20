import { ComponentPropsWithoutRef } from "react";

import "./TextArea.css";

interface TextAreaProps extends ComponentPropsWithoutRef<"textarea"> {
  children?: React.ReactNode;
}

export const TextArea = ({ children, ...restProps }: TextAreaProps) => {
  return (
    <textarea className="TextArea" rows={4} {...restProps}>
      {children}
    </textarea>
  );
};
