import clsx from "clsx";

import { ColorTheme } from "../../types";

import "./ValuePill.css";
import { useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";

interface ValuePillProps {
  value: string | number;
  unit: string;
  className?: string;
  hasArrow?: boolean;
  colorTheme?: ColorTheme;
}

const isValidHttpUrl = (str: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i"
  );
  return pattern.test(str);
};

export const ValuePill = ({
  value,
  unit,
  className,
  hasArrow,
  colorTheme = ColorTheme.Dark,
}: ValuePillProps) => {
  const [showLoader, setShowLoader] = useState<boolean>(() => {
    if (typeof value === "string" && isValidHttpUrl(value)) {
      return true;
    }
    return false;
  });
  const [imageError, setImageError] = useState<boolean>(false);
  const appliedClassNames = clsx(
    "ValuePill",
    className,
    {
      "ValuePill--Light": colorTheme === ColorTheme.Light,
      "ValuePill--Dark": colorTheme === ColorTheme.Dark,
      "ValuePill--Sepia": colorTheme === ColorTheme.Sepia,
    },
    typeof value === "string" && isValidHttpUrl(value)
      ? "Image__Value__Container"
      : ""
  );

  return (
    <>
      <div style={{ display: showLoader ? "block" : "none" }}>
        {<LoadingSpinner />}
      </div>
      <div
        className={appliedClassNames}
        style={{ visibility: showLoader ? "hidden" : "visible" }}
      >
        <div className="ValuePill__Value">
          {typeof value === "string" && isValidHttpUrl(value) && !imageError ? (
            <img
              src={value}
              width={"100%"}
              height={"100%"}
              className="Image__Value"
              loading="lazy"
              onLoad={() => setShowLoader(false)}
              onError={() => {
                setShowLoader(false);
                setImageError(true);
              }}
            />
          ) : (
            value
          )}
        </div>
        <div className="ValuePill__Unit">{unit}</div>
        {hasArrow && <div className="ValuePill__Arrow" />}
      </div>
    </>
  );
};
