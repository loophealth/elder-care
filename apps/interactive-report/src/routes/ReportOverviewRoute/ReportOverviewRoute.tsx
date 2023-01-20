import { CategoryTile } from "components/CategoryTile";
import { Navbar } from "components/Navbar";
import { usePatient } from "lib/PatientProvider";

import "./ReportOverviewRoute.css";

export const ReportOverviewRoute = () => {
  const { patient } = usePatient();

  return (
    <>
      <Navbar />
      <main className="ReportOverviewRoute">
        {patient?.report.categories.map((category) => (
          <CategoryTile key={category.name} category={category} />
        ))}
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
