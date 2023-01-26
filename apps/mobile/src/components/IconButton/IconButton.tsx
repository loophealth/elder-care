import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

import "./IconButton.css";

interface IconButtonProps extends ComponentPropsWithoutRef<"button"> {
  iconPath: string;
  alt: string;
  className?: string;
}

export const IconButton = ({
  iconPath,
  alt,
  className,
  ...restProps
}: IconButtonProps) => {
  const appliedClasses = clsx("IconButton", className);

  return (
    <button className={appliedClasses} {...restProps}>
      <img src={iconPath} alt={alt} />
    </button>
  );
};
