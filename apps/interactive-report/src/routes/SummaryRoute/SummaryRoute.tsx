import { useState } from "react";

import { usePatient } from "@loophealth/api";

import { SummaryCard } from "components/SummaryCard";
import { Navbar } from "components/Navbar";

import "./SummaryRoute.css";

export const SummaryRoute = () => {
  const { patient } = usePatient();
  const [currentCard, setCurrentCard] = useState(0);

  const onForwardClick = () => {
    if (patient && currentCard === patient.report.summary.length - 1) {
      return;
    }

    setCurrentCard((currentCard) => currentCard + 1);
  };

  const onBackClick = () => {
    if (currentCard === 0) {
      return;
    }

    setCurrentCard((currentCard) => currentCard - 1);
  };

  const cardIndicatorElt = (
    <CardIndicator
      numCards={patient?.report.summary.length || 0}
      current={currentCard}
      setCurrent={setCurrentCard}
    />
  );

  return (
    <>
      <Navbar />
      <main className="SummaryRoute">
        <SummaryCard
          summary={null}
          iconPath="/img/back.svg"
          onClick={onBackClick}
        />
        <div className="SummaryRoute__ActiveCard">
          <SummaryCard
            summary={patient?.report.summary[currentCard] || null}
            headerElt={
              <div className="SummaryRoute__ActiveCard__Header">
                <button
                  className="SummaryRoute__ActiveCard__Header__Button"
                  onClick={onBackClick}
                >
                  <img
                    src="/img/back.svg"
                    alt="Back button"
                    className="SummaryRoute__ActiveCard__Header__Button__Icon"
                  />
                </button>
                {cardIndicatorElt}
                <button
                  className="SummaryRoute__ActiveCard__Header__Button"
                  onClick={onForwardClick}
                >
                  <img
                    src="/img/forward.svg"
                    alt="Forward button"
                    className="SummaryRoute__ActiveCard__Header__Button__Icon"
                  />
                </button>
              </div>
            }
          />
          {cardIndicatorElt}
        </div>
        <SummaryCard
          summary={null}
          iconPath="/img/forward.svg"
          onClick={onForwardClick}
        />
      </main>
    </>
  );
};

const CardIndicator = ({
  numCards,
  current,
  setCurrent,
}: {
  numCards: number;
  current: number;
  setCurrent: (index: number) => void;
}) => {
  return (
    <div className="SummaryRoute__CardIndicator">
      {[...Array(numCards)].map((_, index) => {
        return (
          <button
            className={`SummaryRoute__CardIndicator__Dot ${
              index === current
                ? "SummaryRoute__CardIndicator__Dot--Active"
                : ""
            }`}
            key={index}
            onClick={() => setCurrent(index)}
          ></button>
        );
      })}
    </div>
  );
};
