import { Navbar } from "components/Navbar";
import { LinkThatLooksLikeButton } from "components";

import "./AdminRoute.css";
import { usePatient } from "@loophealth/api";

export const AdminRoute = () => {
  const { patient } = usePatient();
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
          {!patient?.profile?.parentId ? (
            <LinkThatLooksLikeButton
              to="/admin/notification"
              icon="/img/chevron-right.svg"
            >
              Notification
            </LinkThatLooksLikeButton>
          ) : null}
        </div>
      </main>
    </>
  );
};
