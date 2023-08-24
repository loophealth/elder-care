import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

import { usePatient, HealthTimelineEvent } from "@loophealth/api";

import { TimelineEvent } from "./TimelineEvent";

export const TimelineEvents = ({ updateEvent }: { updateEvent: any }) => {
  const { patient } = usePatient();
  const [timeline, setTimeline] = useState<HealthTimelineEvent[]>([]);

  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.profileRef, (snapshot) => {
      const timelineEvents: HealthTimelineEvent[] =
        snapshot.data()?.healthTimeline ?? [];
      setTimeline(timelineEvents);
      updateEvent(timelineEvents.length);
    });

    return () => {
      unsub();
    };
    // eslint-disable-next-line
  }, [patient]);

  return (
    <div className="TimelineEvents">
      {timeline.map((item, index) => (
        <TimelineEvent key={index} event={item} />
      ))}
    </div>
  );
};
