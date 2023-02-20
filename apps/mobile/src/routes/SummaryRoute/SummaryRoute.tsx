import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePatient } from "@loophealth/api";
import { CardIndicator, ColorTheme, SummaryCard } from "@loophealth/ui";

import "./SummaryRoute.css";

export const SummaryRoute = () => {
  const navigate = useNavigate();
  const { patient } = usePatient();
  const [currentCard, setCurrentCard] = useState(0);

  const onForwardClick = () => {
    if (patient && currentCard === patient.report.summary.length - 1) {
      return navigate("/");
    }

    setCurrentCard((currentCard) => currentCard + 1);
  };

  const onBackClick = () => {
    if (currentCard === 0) {
      return;
    }

    setCurrentCard((currentCard) => currentCard - 1);
  };

  return (
    <main className="SummaryRoute">
      <SummaryCard
        summary={patient?.report.summary[currentCard] || null}
        colorTheme={ColorTheme.Light}
        className="SummaryRoute__SummaryCard"
        headerElt={
          <div className="SummaryRoute__Header">
            <CardIndicator
              numCards={patient?.report.summary.length || 0}
              current={currentCard}
              setCurrent={setCurrentCard}
              className="SummaryRoute__Header__CardIndicator"
              colorTheme={ColorTheme.Sepia}
            />
            <div className="SummaryRoute__Header__ButtonsContainer">
              <button
                className="SummaryRoute__Header__ButtonsContainer__Button"
                onClick={onBackClick}
              >
                Back
              </button>
              <button
                className="SummaryRoute__Header__ButtonsContainer__Button"
                onClick={onForwardClick}
              >
                Next
              </button>
            </div>
          </div>
        }
      />
    </main>
  );
};
