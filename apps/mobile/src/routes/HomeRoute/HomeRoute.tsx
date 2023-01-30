import { useState } from "react";
import { useAuth } from "@loophealth/api";

import { BottomCard } from "components/BottomCard";
import { Button } from "components/Button";
import { IconButton } from "components/IconButton";
import { TimelineList } from "components/TimelineList";
import { signOut } from "lib/firebaseHelpers";
import { useSafeArea } from "lib/useSafeArea";
import { useLocalStorage } from "lib/useLocalStorage";

import "./HomeRoute.css";

export const HomeRoute = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { isLoadingSafeAreaInsets, safeAreaInsets } = useSafeArea();

  const [didShowFirstRunModal, setDidShowFirstRunModal] = useLocalStorage(
    "didShowFirstRunModal",
    false
  );

  const onLogOut = async () => {
    await signOut();
  };

  const onCloseFirstRunModal = () => {
    setIsModalOpen(false);
    setDidShowFirstRunModal(true);
  };

  if (isLoadingSafeAreaInsets) {
    return null;
  }

  return (
    <div
      className="HomeRoute"
      style={{ paddingTop: `${safeAreaInsets?.top}px` }}
    >
      <p>You are currently logged in as: {user?.phoneNumber ?? "unknown"}</p>
      <button onClick={onLogOut}>Log Out</button>
      {didShowFirstRunModal ? null : (
        <BottomCard
          isOpen={isModalOpen}
          renderContent={() => (
            <BottomCardContent onClose={onCloseFirstRunModal} />
          )}
        />
      )}
    </div>
  );
};

const BottomCardContent = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="HomeRoute__BottomCardContent">
      <div className="HomeRoute__BottomCardContent__Header">
        <IconButton
          iconPath="/img/close.svg"
          alt="Close modal dialog"
          onClick={onClose}
        />
      </div>
      <h1>Your past, present, and future health — all in one place</h1>
      <p>
        Loop automatically imports reports, consultations and prescriptions and
        create an accurate forecast of your future health.
      </p>

      <p>
        Now you can prevent serious conditions even before they present any
        signs.
      </p>

      <TimelineList
        items={[
          { label: "Past reports", when: "past" },
          { label: "Current checkup", when: "past" },
          { label: "Current care plan", when: "present" },
          { label: "Follow-up scheduled", when: "future" },
          { label: "Future health forecast", when: "future" },
        ]}
      />

      <Button
        className="HomeRoute__BottomCardContent__Button"
        onClick={onClose}
      >
        Go to Timeline
      </Button>
    </div>
  );
};
