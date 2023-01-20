import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

import { usePatient } from "lib/PatientProvider";
import { HealthTimelineEvent } from "lib/commonTypes";
import { TimelineEvent } from "./TimelineEvent";

export const TimelineEvents = () => {
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
    });

    return () => {
      unsub();
    };
  }, [patient]);

  return (
    <div className="TimelineEvents">
      {timeline.map((item, index) => (
        <TimelineEvent key={index} event={item} />
      ))}
    </div>
  );
};
