import { Link } from "react-router-dom";

import "./PageHeader.css";

import { ReactComponent as BackIcon } from "images/back.svg";
import { Sidebar } from "components/Sidebar";

interface PageHeaderProps {
  label: string;
  backHref?: string;
  showProfile?: boolean;
}

export const PageHeader = ({
  label,
  backHref,
  showProfile,
}: PageHeaderProps) => {
  return (
    <div className="PageHeader">
      <div className="PageHeader__Label">{label}</div>
      {showProfile ? <Sidebar /> : null}
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
