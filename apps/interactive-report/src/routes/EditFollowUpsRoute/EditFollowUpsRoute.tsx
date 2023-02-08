import { FormEvent, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

import { FollowUp, usePatient } from "@loophealth/api";

import { AdminEditorLayout } from "components/AdminEditorLayout";
import { Button } from "components/Button";
import { Input } from "components/Input";
import { IconTextTileList } from "components/IconTextTileList";
import { IconTextTile } from "components/IconTextTile";

import "./EditFollowUpsRoute.css";

export const EditFollowUpsRoute = () => {
  const { patient } = usePatient();

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  // Subscribe to follow ups updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.profileRef, (snapshot) => {
      const followUps: FollowUp[] = snapshot.data()?.followUps ?? [];
      setFollowUps(followUps);
    });

    return () => {
      unsub();
    };
  }, [patient]);

  // Add a new follow up to the user profile.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      const firebaseDate = Timestamp.fromDate(parseISO(date));
      const newFollowUp: FollowUp = { title, date: firebaseDate };
      const newFollowUps = [...followUps, newFollowUp];

      // Sort new follow ups by date.
      newFollowUps.sort((a, b) => {
        if (a.date.seconds < b.date.seconds) {
          return -1;
        }
        if (a.date.seconds > b.date.seconds) {
          return 1;
        }
        return 0;
      });

      await updateDoc(patient.profileRef, { followUps: newFollowUps });
      setTitle("");
      setDate("");
    } catch (e) {
      alert(
        "There was an error adding the follow up. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete follow up.
  const onDeleteFollowUp = async (index: number) => {
    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      const newFollowUps = [...followUps];
      newFollowUps.splice(index, 1);
      await updateDoc(patient.profileRef, { followUps: newFollowUps });
    } catch (e) {
      alert(
        "There was an error deleting this follow up. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminEditorLayout
      renderLeft={() => (
        <form
          className="EditFollowUpsRoute__Form Utils__VerticalForm"
          onSubmit={onSubmit}
        >
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="approximateDate">
              Title
            </label>
            <Input
              id="approximateDate"
              type="text"
              placeholder="e.g. Follow up with Dr. Waseem"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="event">
              Date
            </label>
            <Input
              id="event"
              type="date"
              placeholder="Enter the main text"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__ButtonsContainer">
            <Button type="submit" isPrimary disabled={isLoading}>
              Add follow up
            </Button>
          </div>
        </form>
      )}
      renderRight={() => (
        <IconTextTileList>
          {followUps.map((followUp, index) => (
            <IconTextTile
              key={followUp.title}
              title={followUp.title}
              details={format(followUp.date.toDate(), "d MMMM, yyyy")}
              onDelete={() => onDeleteFollowUp(index)}
              isLoading={isLoading}
            />
          ))}
        </IconTextTileList>
      )}
    />
  );
};
