import { FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

import { FollowUp, PatientNotificationItem, usePatient } from "@loophealth/api";

import {
  AdminEditorLayout,
  Button,
  Input,
  IconTextTile,
  IconTextTileList,
} from "components";

import "./EditFollowUpsRoute.css";
import {
  convertFollowupDate,
  followUpRules,
  generateId,
  notificationSource,
  substractDate,
} from "utils";

export const EditFollowUpsRoute = () => {
  const { patient } = usePatient();

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [notifications, setNotifications] = useState<PatientNotificationItem[]>(
    []
  );
  const [selectedData, setSelectedData] = useState<
    FollowUp | undefined | null
  >();
  const [selectedIndex, setSelectedIndex] = useState<number | null>();

  // Subscribe to follow ups updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.profileRef, (snapshot) => {
      const followUps: FollowUp[] = snapshot.data()?.followUps ?? [];
      setFollowUps(followUps);
    });
    const unsubNotification = onSnapshot(
      patient.notificationRef,
      (snapshot) => {
        const data = snapshot.data();
        const notifications: PatientNotificationItem[] =
          data?.notifications ?? [];
        setNotifications(notifications);
      }
    );

    return () => {
      unsub();
      unsubNotification();
    };
  }, [patient]);

  // Reset local state
  const resetData = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setSelectedData(null);
    setSelectedIndex(null);
  };

  const updateFollowUpNotification = (date: Date, id: string) => {
    // FollowUp Notification rule & Filtering date less than today
    let scheduledTimeArray = followUpRules
      .map((count) => substractDate(date, count))
      .filter((data) => data >= Timestamp.fromDate(new Date()));

    let newNotification: PatientNotificationItem = {
      id,
      title,
      body: description,
      sent: false,
      scheduledTimeArray,
      source: notificationSource.followUp,
    };
    return newNotification;
  };

  // Add a new follow up to the user profile.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient) {
      return;
    }

    if (selectedData) {
      onUpdateFollowUp(selectedIndex || 0);
    } else {
      setIsLoading(true);
      try {
        const newFollowUpId = generateId();
        const { firebaseFollowUpDate, followUpDate } =
          convertFollowupDate(date);
        const newFollowUp: FollowUp = {
          id: newFollowUpId,
          title,
          description,
          date: firebaseFollowUpDate,
        };
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
        await updateDoc(patient.notificationRef, {
          notifications: [
            ...notifications,
            updateFollowUpNotification(followUpDate, newFollowUpId),
          ],
        });
        resetData();
      } catch (e) {
        alert(
          "There was an error adding the follow up. Please check your network and try again. If the error persists, please contact support."
        );
        console.error(e);
      } finally {
        setIsLoading(false);
      }
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
      const followUpId = newFollowUps[index]?.id;
      newFollowUps.splice(index, 1);
      await updateDoc(patient.profileRef, { followUps: newFollowUps });
      if (followUpId) {
        let newNotifications = [...notifications];
        newNotifications = newNotifications.filter(
          (data) => !data.id || (data.id && data.id !== followUpId)
        );
        await updateDoc(patient.notificationRef, {
          notifications: newNotifications,
        });
      }
    } catch (e) {
      alert(
        "There was an error deleting this follow up. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  //update data on edit
  const updateFollowUpData = (item: FollowUp, index: number) => {
    resetData();
    setSelectedData(item);
    setSelectedIndex(index);
    if (item?.title) {
      setTitle(item.title);
    }
    if (item?.description) {
      setDescription(item.description);
    }
    if (item?.date) {
      const formattedDate = format(item.date.toDate(), "yyyy-MM-dd");
      setDate(formattedDate);
    }
  };

  // Update item.
  const onUpdateFollowUp = async (index: number) => {
    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      let newFollowUps = [...followUps];
      const followUpId = newFollowUps[index]?.id;

      const { firebaseFollowUpDate, followUpDate } = convertFollowupDate(date);

      const updatedData = newFollowUps.map((item) => {
        if (item.id === followUpId) {
          item.date = firebaseFollowUpDate;
          item.title = title;
          item.description = description;
        }
        return item;
      });

      await updateDoc(patient.profileRef, { followUps: updatedData });

      if (followUpId) {
        let newNotifications = [...notifications];
        newNotifications = newNotifications.filter(
          (data) => !data.id || (data.id && data.id !== followUpId)
        );

        newNotifications = [
          ...newNotifications,
          updateFollowUpNotification(followUpDate, followUpId),
        ];

        await updateDoc(patient.notificationRef, {
          notifications: newNotifications,
        });
      }
      resetData();
    } catch (e) {
      alert(
        "There was an error updating this follow up. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminEditorLayout
      title="Follow Ups"
      renderLeft={() => (
        <form
          className="EditFollowUpsRoute__Form Utils__VerticalForm"
          onSubmit={onSubmit}
        >
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="followupHeading">
              Heading
            </label>
            <Input
              id="followupHeading"
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

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="followupDescription">
              Description
            </label>
            <Input
              id="followupDescription"
              type="text"
              placeholder="enter text here"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__ButtonsContainer">
            <Button type="submit" isPrimary disabled={isLoading}>
              {selectedData ? "Done" : "Add follow up"}
            </Button>
            {selectedData ? (
              <Button
                onClick={resetData}
                isPrimary={false}
                disabled={isLoading}
              >
                Cancel
              </Button>
            ) : null}
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
              onUpdate={() => updateFollowUpData(followUp, index)}
              isLoading={isLoading}
            />
          ))}
        </IconTextTileList>
      )}
    />
  );
};
