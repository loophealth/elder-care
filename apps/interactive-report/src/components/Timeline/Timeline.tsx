import "./Timeline.css";

import { TimelineTicks } from "./TimelineTicks";
import { TimelineEvents } from "./TimelineEvents";
import { useState } from "react";

export const Timeline = () => {
  const [timelineLen, setTimelineLen] = useState(0);
  return (
    <div className={timelineLen > 8 ? "Timeline AutoWidth" : "Timeline"}>
      <TimelineTicks />
      <TimelineEvents updateEvent={setTimelineLen} />
    </div>
  );
};
