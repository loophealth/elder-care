import { Navbar, Timeline } from "components";

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

export default TimelineRoute;
