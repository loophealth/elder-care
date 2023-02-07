import { Navbar } from "components/Navbar";
import { LinkThatLooksLikeButton } from "components/LinkThatLooksLikeButton";

import "./AdminRoute.css";

export const AdminRoute = () => {
  return (
    <>
      <Navbar />
      <main className="AdminRoute">
        <div className="AdminRoute__ButtonContainer">
          <LinkThatLooksLikeButton
            to="/admin/care-plan"
            icon="/img/chevron-right.svg"
          >
            Edit Care Plan
          </LinkThatLooksLikeButton>
          <LinkThatLooksLikeButton
            to="/admin/timeline"
            icon="/img/chevron-right.svg"
          >
            Edit Timeline
          </LinkThatLooksLikeButton>
          <LinkThatLooksLikeButton
            to="/admin/risk-factors"
            icon="/img/chevron-right.svg"
          >
            Edit Risk Factors
          </LinkThatLooksLikeButton>
        </div>
      </main>
    </>
  );
};
