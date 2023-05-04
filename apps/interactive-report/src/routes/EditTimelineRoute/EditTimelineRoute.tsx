import { FormEvent, useEffect, useState } from "react";
import { onSnapshot, updateDoc } from "firebase/firestore";

import {
  usePatient,
  HealthTimelineEvent,
  moveArrayItem,
} from "@loophealth/api";

import {
  Button,
  Input,
  AdminEditorLayout,
  IconTextTile,
  IconTextTileList,
} from "components";

import "./EditTimelineRoute.css";

export const EditTimelineRoute = () => {
  const { patient } = usePatient();

  const [healthTimeline, setHealthTimeline] = useState<HealthTimelineEvent[]>(
    []
  );

  const [approximateTime, setApproximateTime] = useState("");
  const [event, setEvent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState<
    HealthTimelineEvent | undefined | null
  >();
  const [selectedIndex, setSelectedIndex] = useState<number | null>();

  // Subscribe to timeline updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.profileRef, (snapshot) => {
      const timelineEvents: HealthTimelineEvent[] =
        snapshot.data()?.healthTimeline ?? [];
      setHealthTimeline(timelineEvents);
    });

    return () => {
      unsub();
    };
  }, [patient]);

  // Add new event to timeline.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient) {
      return;
    }
    if (selectedData) {
      onUpdate();
    } else {
      setIsLoading(true);
      try {
        const newTimelineEvent: HealthTimelineEvent = {
          approximateTime,
          event,
        };
        const newTimeline = [...healthTimeline, newTimelineEvent];
        await updateDoc(patient.profileRef, { healthTimeline: newTimeline });
        onReset();
      } catch (e) {
        alert(
          "There was an error adding the timeline item. Please check your network and try again. If the error persists, please contact support."
        );
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Move timeline item up.
  const onMoveEvent = async (index: number, direction: 1 | -1) => {
    if (!patient) {
      return;
    }

    if (index === 0 && direction === -1) {
      return;
    } else if (index === healthTimeline.length - 1 && direction === 1) {
      return;
    }

    setIsLoading(true);
    try {
      const newTimeline = [...healthTimeline];
      moveArrayItem(newTimeline, index, index + direction);
      await updateDoc(patient.profileRef, { healthTimeline: newTimeline });
    } catch (e) {
      alert(
        "There was an error reordering this timeline item. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete timeline item.
  const onDeleteEvent = async (index: number) => {
    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      const newTimeline = [...healthTimeline];
      newTimeline.splice(index, 1);
      await updateDoc(patient.profileRef, { healthTimeline: newTimeline });
    } catch (e) {
      alert(
        "There was an error deleting this timeline item. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form.
  const onReset = () => {
    setApproximateTime("");
    setEvent("");
    setSelectedData(null);
    setSelectedIndex(null);
  };

  //update data on edit
  const updateData = (item: HealthTimelineEvent, index: number) => {
    onReset();
    setSelectedData(item);
    setSelectedIndex(index);
    if (item?.event) {
      setEvent(item.event);
    }
    if (item?.approximateTime) {
      setApproximateTime(item.approximateTime);
    }
  };

  // Update item.
  const onUpdate = async () => {
    if (!patient || !selectedData) {
      return;
    }

    setIsLoading(true);
    try {
      const newTimeline = [...healthTimeline];
      newTimeline[selectedIndex || 0] = {
        approximateTime,
        event,
      };
      await updateDoc(patient.profileRef, {
        healthTimeline: newTimeline,
      });
      onReset();
    } catch (e) {
      alert(
        "There was an error updating timeline. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminEditorLayout
      title="Timeline"
      renderLeft={() => (
        <form
          className="EditTimelineRoute__Form Utils__VerticalForm"
          onSubmit={onSubmit}
        >
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="approximateDate">
              Year and month
            </label>
            <Input
              id="approximateDate"
              type="text"
              placeholder="e.g. May 2022"
              value={approximateTime}
              onChange={(event) => setApproximateTime(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="event">
              Heading
            </label>
            <Input
              id="event"
              type="text"
              placeholder="Enter the main text"
              value={event}
              onChange={(event) => setEvent(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__ButtonsContainer">
            <Button type="submit" isPrimary disabled={isLoading}>
              {selectedData ? "Done" : "Add to timeline"}
            </Button>
            {selectedData ? (
              <Button onClick={onReset} isPrimary={false} disabled={isLoading}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      )}
      renderRight={() => (
        <IconTextTileList>
          {healthTimeline.map((event, index) => (
            <IconTextTile
              key={event.event}
              title={event.event}
              details={event.approximateTime}
              onReorder={(direction) => onMoveEvent(index, direction)}
              onDelete={() => onDeleteEvent(index)}
              onUpdate={() => updateData(event, index)}
              isLoading={isLoading}
            />
          ))}
        </IconTextTileList>
      )}
    />
  );
};
