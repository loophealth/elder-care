import { LinkList } from "components/LinkList";
import { PageHeader } from "components/PageHeader";

import "./CareRoute.css";
import { logCustomEvent, usePatient } from "@loophealth/api";

export const CareRoute = () => {
  const { patient } = usePatient();
  const onCareClick = (title: string) => {
    logCustomEvent("ClickedOn_Care_"+title, {
      name: title,
      category: "Care",
      user_name: patient?.profile?.fullName,
      platform: "Elder_Care"
    });
  };
  return (
    <main className="CareRoute">
      <PageHeader label="Care" showProfile={true} />
      <h2 className="CareRoute__Label Utils__Label">Chat</h2>
      <LinkList
        links={[
          {
            href: "https://www.consult.loophealth.com/app/conversation",
            title: "Medical advisor",
            description: "Ask your medical advisor anything about your health",
            icon: <img src="/img/doctor.png" alt="A doctor" />,
            onClick: onCareClick,
          },
          {
            href: "https://www.consult.loophealth.com/app/conversation",
            title: "Contact us",
            description: "Ask any questions or queries about Loop and the app",
            icon: <img src="/img/contact-us.png" alt="A doctor" />,
            onClick: onCareClick,
          },
        ]}
      />
      {/* <h2 className="CareRoute__Label CareRoute__Label--TopMargin Utils__Label">
        Make a Booking
      </h2>
      <LinkList
        links={[
          {
            href: "https://loophealth.com",
            title: "Book a health checkup",
            description: "Choose from a variety of health packages",
            icon: null,
            onClick: onCareClick,
          },
        ]}
      /> */}
    </main>
  );
};
