import { useState } from "react";
import { useAuth } from "@loophealth/api";

import { BottomCard } from "components/BottomCard";
import { Button } from "components/Button";
import { signOut } from "lib/firebaseHelpers";

export const HomeRoute = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const onLogOut = async () => {
    await signOut();
  };

  return (
    <>
      <p>You are currently logged in as: {user?.phoneNumber ?? "unknown"}</p>
      <button onClick={onLogOut}>Log Out</button>
      <BottomCard
        isOpen={isModalOpen}
        renderContent={() => (
          <BottomCardContent onClose={() => setIsModalOpen(false)} />
        )}
      />
    </>
  );
};

const BottomCardContent = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="Prose">
      <h1>Your past, present, and future health — all in one place</h1>
      <p>
        Loop automatically imports reports, consultations and prescriptions and
        create an accurate forecast of your future health.
      </p>

      <p>
        Now you can prevent serious conditions even before they present any
        signs.
      </p>

      <Button onClick={onClose}>Go to Timeline</Button>
    </div>
  );
};
