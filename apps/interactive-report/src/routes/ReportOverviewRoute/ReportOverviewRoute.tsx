import { usePatient } from "@loophealth/api";

import { Navbar } from "components/Navbar";
import { ReportOverviewGrid } from "components/ReportOverviewGrid";

import "./ReportOverviewRoute.css";

export const ReportOverviewRoute = () => {
  const { patient } = usePatient();

  return (
    <>
      <Navbar />
      <main className="ReportOverviewRoute">
        <ReportOverviewGrid className="ReportOverviewRoute__ReportOverviewGrid" />
        <ReportOverviewRouteBasicInfo
          name={patient?.profile.fullName || "Unknown"}
          age={patient?.profile.age || "Unknown"}
        />
      </main>
    </>
  );
};

const ReportOverviewRouteBasicInfo = ({
  name,
  age,
}: {
  name: string;
  age: number | string;
}) => {
  return (
    <div className="ReportOverviewRouteBasicInfo">
      <div className="ReportOverviewRouteBasicInfo__Item">
        <div className="ReportOverviewRouteBasicInfo__Item__Label Utils__Label">
          Name
        </div>
        <div className="ReportOverviewRouteBasicInfo__Item__Value">{name}</div>
      </div>
      <div className="ReportOverviewRouteBasicInfo__Item">
        <div className="ReportOverviewRouteBasicInfo__Item__Label Utils__Label">
          Age
        </div>
        <div className="ReportOverviewRouteBasicInfo__Item__Value">
          {age} years
        </div>
      </div>
    </div>
  );
};
