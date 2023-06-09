import { Navbar } from "components/Navbar";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import "./AdminEditorLayout.css";

export const AdminEditorLayout = ({
  renderLeft,
  renderRight,
}: {
  renderLeft: () => ReactNode;
  renderRight: () => ReactNode;
}) => {
  return (
    <>
      <Navbar />
      <main className="AdminEditorLayout">
        <div className="AdminEditorLayout__Header">
          <Link className="AdminEditorLayout__Header__BackButton" to="/admin">
            <img src="/img/arrow-left.svg" alt="Back button" />
          </Link>
        </div>
        <div className="AdminEditorLayout__Content">
          <div className="AdminEditorLayout__Content__Left">{renderLeft()}</div>
          <div className="AdminEditorLayout__Content__Divider" />
          <div className="AdminEditorLayout__Content__Right">
            {renderRight()}
          </div>
        </div>
      </main>
    </>
  );
};
