import { Timestamp } from "firebase/firestore";

export const substractDate = (date: Date, count = 0) => {
  var dateOffset = 24 * 60 * 60 * 1000 * count;
  return Timestamp.fromDate(
    new Date(new Date().setTime(date.getTime() - dateOffset))
  );
};

export const generateId = () => {
  return crypto.randomUUID();
};

//FollowUp is before 1 week(i.e. 7 days), before 2 days(i.e. 2 days), before 2 day, selected date
export const followUpRules = [7, 2, 1, 0];

//CarePlan Category Time
export const carePlanCategoryTime = {
  morning: "08:00",
  afternoon: "13:00",
  evening: "17:00",
  night: "20:00",
};

//Notification source
export const notificationSource = {
  notification: "Notification",
  carePlan: "Care Plan",
  followUp: "Follow Up",
};
