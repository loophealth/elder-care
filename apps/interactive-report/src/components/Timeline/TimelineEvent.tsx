import { HealthTimelineEvent as TimelineEventType } from "@loophealth/api";

export const TimelineEvent = ({ event }: { event: TimelineEventType }) => {
  return (
    <div className="TimelineEvent">
      <div className="TimelineEvent__Dot" />
      <div className="TimelineEvent__TextContainer">
        <div className="TimelineEvent__Date">{event.approximateTime}</div>
        <div className="TimelineEvent__Event">{event.event}</div>
      </div>
    </div>
  );
};
