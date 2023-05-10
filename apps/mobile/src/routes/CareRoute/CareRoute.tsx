import { LinkList } from "components/LinkList";
import { PageHeader } from "components/PageHeader";

import { ReactComponent as UserIcon } from "images/user_circle.svg";

import "./CareRoute.css";
import { logCustomEvent } from "@loophealth/api";

export const CareRoute = () => {
  const onCareClick = (title: string) => {
    logCustomEvent("click_event", { name: title, category: "Care" });
  };
  return (
    <main className="CareRoute">
      <PageHeader label="Care" />
      <h2 className="CareRoute__Label Utils__Label">Chat</h2>
      <LinkList
        links={[
          {
            href: "https://www.consult.loophealth.com/app/conversation",
            title: "Medical advisor",
            description: "Ask your medical advisor anything about your health",
            icon: <img src="/img/doctor.png" alt="A doctor" />,
            onClick: onCareClick
          },
          {
            href: "https://www.consult.loophealth.com/app/conversation",
            title: "Contact us",
            description: "Ask any questions or queries about Loop and the app",
            icon: <UserIcon />,
            onClick: onCareClick
          },
        ]}
      />
      <h2 className="CareRoute__Label CareRoute__Label--TopMargin Utils__Label">
        Make a Booking
      </h2>
      <LinkList
        links={[
          {
            href: "https://loophealth.com",
            title: "Book a health checkup",
            description: "Choose from a variety of health packages",
            icon: null,
            onClick: onCareClick
          },
        ]}
      />
    </main>
  );
};
