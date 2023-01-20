import { ReactNode } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

import "./LinkThatLooksLikeButton.css";

export const LinkThatLooksLikeButton = ({
  to,
  icon,
  children,
  className,
}: {
  to: string;
  icon: string;
  children: ReactNode;
  className?: string;
}) => {
  const appliedClasses = clsx("LinkThatLooksLikeButton", className);

  return (
    <Link to={to} className={appliedClasses}>
      <span className="LinkThatLooksLikeButton__Label">{children}</span>
      <img src={icon} alt="" />
    </Link>
  );
};
