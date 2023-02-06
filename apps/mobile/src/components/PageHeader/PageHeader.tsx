import { Link } from "react-router-dom";

import "./PageHeader.css";

import { ReactComponent as BackIcon } from "images/back.svg";

interface PageHeaderProps {
  label: string;
  backHref?: string;
}

export const PageHeader = ({ label, backHref }: PageHeaderProps) => {
  return (
    <div className="PageHeader">
      <div className="PageHeader__Label">{label}</div>
      {backHref ? (
        <Link to={backHref} className="PageHeader__Icon">
          {<BackIcon />}
        </Link>
      ) : (
        <div className="PageHeader__PlaceholderIcon" />
      )}
    </div>
  );
};
