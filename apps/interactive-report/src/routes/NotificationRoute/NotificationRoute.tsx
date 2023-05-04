import { FormEvent, useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { onSnapshot, Timestamp, updateDoc } from "firebase/firestore";

import {
  NotificationCategory,
  PatientNotificationItem,
  sendNotification,
  usePatient,
} from "@loophealth/api";

import {
  AdminEditorLayout,
  Button,
  Input,
  IconTextTile,
  IconTextTileList,
  TextArea,
  Select,
} from "components";

import "./NotificationRoute.css";
import { generateId, notificationSource } from "utils";

export const NotificationRoute = () => {
  const { patient } = usePatient();

  const [notifications, setNotifications] = useState<PatientNotificationItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedData, setSelectedData] = useState<
    PatientNotificationItem | undefined | null
  >();

  // Subscribe to notification updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.notificationRef, (snapshot) => {
      const data = snapshot.data();
      const notifications: PatientNotificationItem[] =
        data?.notifications ?? [];
      setNotifications(notifications);
    });

    return () => {
      unsub();
    };
  }, [patient]);

  // Reset local state
  const resetData = () => {
    setTitle("");
    setBody("");
    setDate("");
    setTime("");
    setType("");
    setSelectedData(null);
  };

  const setAdditionalParams = (newNotification: PatientNotificationItem) => {
    let customDate, firebaseDate;
    if (date && time && type !== "recurring") {
      customDate = new Date(date + " " + time);
      firebaseDate = Timestamp.fromDate(parseISO(customDate.toISOString()));
      newNotification = {
        ...newNotification,
        scheduledTime: firebaseDate,
        time,
      };
    } else if ((!date && time) || type === "recurring") {
      newNotification = {
        ...newNotification,
        scheduledTime: "",
        time,
      };
    } else if (!date && !time) {
      newNotification = {
        ...newNotification,
        scheduledTime: "",
        time: "",
        sent: true,
      };
    }
    return newNotification;
  };

  // Add a new notification to the user profile.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient) {
      return;
    }
    if (selectedData) {
      onUpdateNotification();
    } else {
      setIsLoading(true);
      try {
        let newNotification: PatientNotificationItem = {
          id: generateId(),
          title,
          body,
          sent: false,
          type,
          source: notificationSource.notification,
        };

        newNotification = setAdditionalParams(newNotification);

        const newNotifications = [...notifications, newNotification];

        await updateDoc(patient.notificationRef, {
          notifications: newNotifications,
        });

        if (
          !newNotification?.scheduledTime &&
          !newNotification?.time &&
          patient?.profile?.fcmToken
        ) {
          const notificationData = {
            title,
            body,
            fcmToken: patient?.profile?.fcmToken,
          };
          sendNotification(notificationData);
        }
        resetData();
      } catch (e) {
        alert(
          `There was an error adding the notification. Please check your network and try again. If the error persists, please contact support.`
        );
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Delete notification.
  const onDeleteNotification = async (id: string) => {
    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      let newNotifications = [...notifications];
      newNotifications = newNotifications.filter(
        (data) => !data.id || (data.id && data.id !== id)
      );
      await updateDoc(patient.notificationRef, {
        notifications: newNotifications,
      });
    } catch (e) {
      alert(
        "There was an error deleting this notification. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  //update data on edit
  const updateNotificationData = (item: PatientNotificationItem) => {
    resetData();
    setSelectedData(item);
    if (item?.title) {
      setTitle(item.title);
    }
    if (item?.type) {
      setType(item.type);
    }
    if (item?.body) {
      setBody(item.body);
    }
    if (item?.scheduledTime) {
      setDate(format(item.scheduledTime.toDate(), "yyyy-MM-dd"));
      setTime(format(item.scheduledTime.toDate(), "hh:mm"));
    }
    if (!item.scheduledTime && item.time) {
      setTime(item.time);
    }
  };

  // Update item.
  const onUpdateNotification = async () => {
    if (!patient || !selectedData) {
      return;
    }

    setIsLoading(true);
    try {
      let newNotifications = [...notifications];
      let updatedNotification: PatientNotificationItem = {
        id: selectedData.id,
        title,
        body,
        sent: false,
        type,
        source: notificationSource.notification,
      };

      updatedNotification = setAdditionalParams(updatedNotification);

      newNotifications = newNotifications.map((data) => {
        if (data.id && data.id === selectedData.id) {
          data = { ...updatedNotification };
        }
        return data;
      });
      await updateDoc(patient.notificationRef, {
        notifications: newNotifications,
      });
      resetData();
    } catch (e) {
      alert(
        "There was an error updating this notification. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotification = useMemo(() => {
    return notifications.filter(
      (notification: PatientNotificationItem) =>
        notification &&
        notification.source === notificationSource.notification &&
        notification.type !== "immediate"
    );
  }, [notifications]);

  return (
    <AdminEditorLayout
      title="Notification"
      renderLeft={() => (
        <form
          className="NotificationRoute__Form Utils__VerticalForm"
          onSubmit={onSubmit}
        >
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="notificationType">
              Notification Type
            </label>
            <Select
              name="notificationType"
              id="notificationType"
              value={type}
              onChange={(e) => setType(e.target.value as NotificationCategory)}
              required
              disabled={isLoading}
            >
              <option value="">Select type</option>
              <option value="immediate">Immediate</option>
              <option value="scheduled">Scheduled</option>
              <option value="recurring">Recurring</option>
            </Select>
          </div>

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="notificationHeading">
              Heading
            </label>
            <Input
              id="notificationHeading"
              type="text"
              placeholder="Enter the main text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="notificationDescription">
              Description
            </label>
            <TextArea
              id="notificationDescription"
              placeholder="Any additional info (eg. before breakfast)"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              disabled={isLoading}
            />
          </div>
          {type === "scheduled" ? (
            <div className="Utils__VerticalForm__Group">
              <label className="Utils__Label" htmlFor="notificationDate">
                Date
              </label>
              <Input
                id="notificationDate"
                type="date"
                placeholder="Select Date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                disabled={isLoading}
              />
            </div>
          ) : null}
          {type === "scheduled" || type === "recurring" ? (
            <div className="Utils__VerticalForm__Group">
              <label className="Utils__Label" htmlFor="notificationTime">
                Time
              </label>
              <Input
                id="notificationTime"
                type="time"
                placeholder="Select Time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required={date ? true : false}
                disabled={isLoading}
              />
            </div>
          ) : null}

          <div className="Utils__VerticalForm__ButtonsContainer">
            <Button type="submit" isPrimary disabled={isLoading}>
              {selectedData ? "Done" : "Add notification"}
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
      renderRight={() =>
        filteredNotification ? (
          <IconTextTileList>
            {filteredNotification.map((notification, index) => (
              <IconTextTile
                key={index}
                title={notification.title}
                details={`${notification.body} ${
                  notification.scheduledTime
                    ? format(
                        notification.scheduledTime.toDate(),
                        "d MMMM, yyyy hh:mm a"
                      )
                    : notification.time
                }`}
                onDelete={() => onDeleteNotification(notification.id)}
                onUpdate={() => updateNotificationData(notification)}
                isLoading={isLoading}
              />
            ))}
          </IconTextTileList>
        ) : null
      }
    />
  );
};
