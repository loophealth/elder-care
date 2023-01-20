import { ComponentPropsWithoutRef } from "react";

import "./IconButton.css";

interface IconButtonProps extends ComponentPropsWithoutRef<"button"> {
  icon: string;
  alt: string;
}

export const IconButton = ({ icon, alt, ...restProps }: IconButtonProps) => {
  return (
    <button className="IconButton" {...restProps}>
      <img src={icon} alt={alt} />
    </button>
  );
};
