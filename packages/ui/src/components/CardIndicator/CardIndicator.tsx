import clsx from "clsx";

import { ColorTheme } from "../../types";

import "./CardIndicator.css";

interface CardIndicatorProps {
  numCards: number;
  current: number;
  setCurrent: (index: number) => void;
  className?: string;
  colorTheme?: ColorTheme;
}

export const CardIndicator = ({
  numCards,
  current,
  setCurrent,
  className,
  colorTheme = ColorTheme.Dark,
}: CardIndicatorProps) => {
  const appliedClassNames = clsx("CardIndicator", className, {
    "CardIndicator--Dark": colorTheme === ColorTheme.Dark,
    "CardIndicator--Light": colorTheme === ColorTheme.Light,
    "CardIndicator--Sepia": colorTheme === ColorTheme.Sepia,
  });

  return (
    <div className={appliedClassNames}>
      {[...Array(numCards)].map((_, index) => {
        return (
          <button
            className={`CardIndicator__Dot ${
              index === current ? "CardIndicator__Dot--Active" : ""
            }`}
            key={index}
            onClick={() => setCurrent(index)}
          ></button>
        );
      })}
    </div>
  );
};
