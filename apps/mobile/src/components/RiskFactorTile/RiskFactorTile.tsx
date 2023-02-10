import { RiskFactor } from "@loophealth/api";

import "./RiskFactorTile.css";

import { ReactComponent as RiskFactorGraphic } from "images/risk-factor.svg";

export const RiskFactorTile = ({ riskFactor }: { riskFactor: RiskFactor }) => {
  return (
    <div className="RiskFactorTile">
      <div className="RiskFactorTile__Name">
        <div className="RiskFactorTile__Name__Label">Risk of</div>
        <div className="RiskFactorTile__Name__Name">{riskFactor.name}</div>
      </div>
      <div className="RiskFactorTile__Reasons">{riskFactor.reasons}</div>
      <hr className="RiskFactorTile__Divider" />
      <div className="RiskFactorTile__Description">
        <div className="RiskFactorTile__Description__Graphic">
          <RiskFactorGraphic />
        </div>
        <div className="RiskFactorTile__Description__Text">
          {riskFactor.description}
        </div>
      </div>
    </div>
  );
};
