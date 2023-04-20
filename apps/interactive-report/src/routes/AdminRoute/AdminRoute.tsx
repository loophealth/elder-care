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
            Care plan
          </LinkThatLooksLikeButton>
          <LinkThatLooksLikeButton
            to="/admin/timeline"
            icon="/img/chevron-right.svg"
          >
            Timeline
          </LinkThatLooksLikeButton>
          <LinkThatLooksLikeButton
            to="/admin/risk-factors"
            icon="/img/chevron-right.svg"
          >
            Risk factors
          </LinkThatLooksLikeButton>
          <LinkThatLooksLikeButton
            to="/admin/follow-ups"
            icon="/img/chevron-right.svg"
          >
            Follow ups
          </LinkThatLooksLikeButton>
          <LinkThatLooksLikeButton
            to="/admin/notification"
            icon="/img/chevron-right.svg"
          >
            Notification
          </LinkThatLooksLikeButton>
        </div>
      </main>
    </>
  );
};
