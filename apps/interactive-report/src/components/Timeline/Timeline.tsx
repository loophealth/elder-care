import "./Timeline.css";

import { TimelineTicks } from "./TimelineTicks";
import { TimelineEvents } from "./TimelineEvents";

export const Timeline = () => {
  return (
    <div className="Timeline">
      <TimelineTicks />
      <TimelineEvents />
    </div>
  );
};
