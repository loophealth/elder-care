import { ReactNode } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

import "./LinkThatLooksLikeAButton.css";

export const LinkThatLooksLikeAButton = ({
  to,
  children,
  className,
  ...restProps
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) => {
  const appliedClassName = clsx("LinkThatLooksLikeAButton", className);

  return (
    <Link className={appliedClassName} to={to} {...restProps}>
      {children}
    </Link>
  );
};
