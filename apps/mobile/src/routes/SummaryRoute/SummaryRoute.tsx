import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePatient } from "@loophealth/api";
import { CardIndicator, ColorTheme, SummaryCard } from "@loophealth/ui";

import { useFirstRun } from "lib/useFirstRun";

import "./SummaryRoute.css";

export const SummaryRoute = () => {
  const navigate = useNavigate();
  const { patient } = usePatient();
  const [currentCard, setCurrentCard] = useState(0);
  const [, setFirstRun] = useFirstRun();

  const closeSummaryCard = () => {
    setFirstRun({ didShowReportSummary: true });
    return navigate("/");
  }

  const onForwardClick = () => {
    if (patient && currentCard === patient.report.summary.length - 1) {
      return closeSummaryCard();
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
            <div className="SummaryRoute__Header__Controls">
              <CardIndicator
                numCards={patient?.report.summary.length || 0}
                current={currentCard}
                setCurrent={setCurrentCard}
                className="SummaryRoute__Header__Controls__CardIndicator"
                colorTheme={ColorTheme.Sepia}
              />
              <div className="SummaryRoute__Header__Controls__ButtonsContainer">
                {currentCard !== 0 ? (
                  <button
                    className="SummaryRoute__Header__Controls__ButtonsContainer__Button"
                    onClick={onBackClick}
                  >
                    Back
                  </button>
                ) : null}
                <button
                  className="SummaryRoute__Header__Controls__ButtonsContainer__Button"
                  onClick={onForwardClick}
                >
                  Next
                </button>
                <button
                  className="SummaryRoute__Header__Controls__ButtonsContainer__Close__Button"
                  onClick={closeSummaryCard}
                >
                  X
                </button>
              </div>
            </div>
            {currentCard === 0 ? (
              <h1 className="SummaryRoute__Header__Title">Checkup Summary</h1>
            ) : null}
          </div>
        }
      />
    </main>
  );
};
