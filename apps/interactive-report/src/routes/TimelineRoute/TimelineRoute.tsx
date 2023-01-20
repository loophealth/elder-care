import { Navbar } from "components/Navbar";
import { Timeline } from "components/Timeline";

import "./TimelineRoute.css";

export const TimelineRoute = () => {
  return (
    <>
      <Navbar />
      <main className="TimelineRoute">
        <Timeline />
      </main>
    </>
  );
};
