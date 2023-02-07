import { LinkList } from "components/LinkList";
import { PageHeader } from "components/PageHeader";

import { ReactComponent as UserIcon } from "images/user_circle.svg";

import "./CareRoute.css";

export const CareRoute = () => {
  return (
    <main className="CareRoute">
      <PageHeader label="Care" />
      <h2 className="CareRoute__Label Utils__Label">Chat</h2>
      <LinkList
        links={[
          {
            href: "https://wa.me/919999999999",
            title: "Medical advisor",
            description: "Ask your medical advisor anything about your health",
            icon: <img src="/img/doctor.png" alt="A doctor" />,
          },
          {
            href: "https://wa.me/919999999999",
            title: "Contact us",
            description: "Ask any questions or queries about Loop and the app",
            icon: <UserIcon />,
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
          },
        ]}
      />
    </main>
  );
};
