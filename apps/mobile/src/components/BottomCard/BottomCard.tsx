import { ReactNode } from "react";

import "./BottomCard.css";

interface BottomCardProps {
  isOpen: boolean;
  renderContent: () => ReactNode;
}

export const BottomCard = ({
  isOpen = true,
  renderContent,
}: BottomCardProps) => {
  if (!isOpen) {
    return null;
  }

  return <div className="BottomCard">{renderContent()}</div>;
};
